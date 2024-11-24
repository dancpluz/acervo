import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateIndex } from '@/lib/dbWrite';
import { UseFormReturn } from 'react-hook-form';
import { entityTitles } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { errorToast } from '@/hooks/general';
import { converters } from '@/lib/converters';
import db from '@/lib/firebase';
import { setDoc, doc, collection, updateDoc, getDoc } from 'firebase/firestore';
import { useCRMContext } from '@/hooks/useCRMContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes } from "firebase/storage";
import { ProductT, VersionT } from '@/lib/types';

export interface FormActionsT {
  proposalSubmit: (values: any) => Promise<void>;
  productSubmit: (values: any) => Promise<void>;
  saveProduct: boolean;
  setSaveProduct: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useCRMFormActions(
  id: string,
  setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>,
  data?: any,
  setFunctions?: () => Promise<void>
): FormActionsT {

  const { proposal, versionNum, getProposal, setProposal } = useCRMContext();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saveProduct, setSaveProduct] = useState<boolean>(false);
  //const [conflicts, setConflicts] = useState<{ [key: string]: [string, number] } | undefined>(undefined);

  // useEffect(() => {
  //   console.log(form.getValues());
  //   console.log('errors: ')
  //   console.log(form.formState.errors)
  // }, [form.formState]);

  const handleSetFunctions = async () => {
    if (data && setFunctions) {
      await setFunctions()
    }
  }

  useEffect(() => {
    handleSetFunctions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function proposalSubmit(values: any) {
    const entityTitle = entityTitles['proposal'];

    try {
      try {
        if (data) {
          const { versions } =  await getProposal();

          const updatedProposal = { ...proposal, ...values, versions }
          await setDoc(doc(collection(db, 'proposal'), id).withConverter(converters['proposal']), updatedProposal, { merge: true })
        } else {
          await setDoc(doc(collection(db, 'proposal'), id).withConverter(converters['proposal']), values)
          await updateIndex('proposal', values.num)
        }

      } catch (error) {
        console.log(error);
        throw new Error('Erro ao adicionar no banco de dados')
      }
      
      toast({
        title: `${entityTitle.singular[0].toUpperCase() + entityTitle.singular.slice(1)} ${data ? 'editad' : 'adicionad'}${entityTitle.sufix} com sucesso!`,
      });

      setPopupOpen(false)
      setProposal(await getProposal(true))
      
    } catch (error) {
      console.log(error);
      errorToast(error);
    }
  }

  async function productSubmit(values: any) {
    const entityTitle = entityTitles['product'];

    try {
      try {
        if (proposal) {
          if (saveProduct) {
            await setDoc(doc(collection(db, 'product'), id).withConverter(converters['product']), values)

            await updateIndex('product', values.num)
          }
   
          if (values.image.length > 0) {
            const imageId = `products/${id}`
            const storageRef = ref(storage, imageId);
            const upload = await uploadBytes(storageRef, values.image[0]).then((snapshot) => {
              return true;
            }).catch((error) => {
              console.log(error);
              return false;
            });
            
            if (upload) {
              const dimensions = await new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (e) => {
                  const img = new Image();
                  img.onload = () => {
                    resolve({ width: img.width, height: img.height });
                  };
                  img.onerror = (err) => {
                    reject(err);
                  };
                  if (e.target?.result) {
                    img.src = e.target.result as string;
                  }
                };

                reader.onerror = (err) => {
                  reject(err);
                };

                reader.readAsDataURL(values.image[0]);
              });

              values.image = { path: imageId, width: dimensions.width, height: dimensions.height };

            } else {
              values.image = '';
            }
          } else {
            values.image = '';
          }

          values.factory = doc(db, 'factory', values.factory as string)
          values.freight = doc(db, 'config', 'markup_freight', 'freight', values.freight as string)
          values.markup = doc(db, 'config', 'markup_freight', 'markup', values.markup as string)
          values.id = id;

          const proposalRef = doc(db, 'proposal', proposal.id);
          const proposalDoc = await getDoc(proposalRef)
          const proposalData = proposalDoc.data()

          const versions = proposalData && proposalData.versions.length > 0 ? proposalData.versions.map((version: VersionT) => {
            if (version.num === versionNum) {
              version.complement = version.complement || { discount: 0, freight: 0, expiration: 0, deadline: 0, payment_method: '', general_info: '', info: '' }
              if (data) {
                const productIndex = version.products.findIndex((product: ProductT) => product.id === data.id);
                if (productIndex !== -1) {
                  version.products[productIndex] = values;
                  return version;
                }
              }
              return { ...version, products: [...version.products, values] }
            }
            return version;
          }) : [{ num: versionNum, products: [values] }]

          
          await updateDoc(proposalRef, { versions })
          
        } else {
          throw new Error('Erro ao adicionar produto: Proposta não encontrada')
        }
      } catch (error) {
        console.log(error);
        throw new Error('Erro ao adicionar no banco de dados')
      }
      
      toast({
        title: `${entityTitle.singular[0].toUpperCase() + entityTitle.singular.slice(1)} ${data ? 'editad' : 'adicionad'}${entityTitle.sufix} com sucesso!`,
      });

      setPopupOpen(false)
      setProposal(await getProposal(true))

    } catch (error) {
      console.log(error);
      errorToast(error);
    }
  }

  return {
    proposalSubmit,
    productSubmit,
    isEditing,
    setIsEditing,
    saveProduct,
    setSaveProduct
  };
}