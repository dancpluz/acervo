import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateIndex } from '@/lib/dbWrite';
import { entityTitles, uploadImageToFirestore } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { errorToast } from '@/hooks/general';
import { converters } from '@/lib/converters';
import db from '@/lib/firebase';
import { setDoc, doc, collection, updateDoc, getDoc } from 'firebase/firestore';
import { useCRMContext } from '@/hooks/useCRMContext';
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
    delete values.temp
    delete values.temp_edit

    try {
      try {
        if (data) {
          const { versions } =  await getProposal();

          const updatedProposal = { ...proposal, ...values, versions }
          await setDoc(doc(collection(db, 'proposal'), id).withConverter(converters['proposal']), updatedProposal, { merge: true })
          setProposal(await getProposal(true))

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
          const finish = values.finish

          const [image, fabric_img, frame_img, extra_img] = await Promise.all([
            uploadImageToFirestore(values.image, ['products', id]),
            uploadImageToFirestore(finish.fabric_img, ['finish', `fabric_${id}`]),
            uploadImageToFirestore(finish.frame_img, ['finish', `frame_${id}`]),
            uploadImageToFirestore(finish.extra_img, ['finish', `extra_${id}`])
          ]);

          values.image = image
          values.finish.fabric_img = fabric_img
          values.finish.frame_img = frame_img
          values.finish.extra_img = extra_img
          values.factory = doc(db, 'factory', values.factory as string)
          values.freight = doc(db, 'config', 'markup_freight', 'freight', values.freight as string)
          values.markup = doc(db, 'config', 'markup_freight', 'markup', values.markup as string)
          values.id = id;

          const proposalRef = doc(db, 'proposal', proposal.id);
          const proposalDoc = await getDoc(proposalRef)
          const proposalData = proposalDoc.data()

          const defaultComplement = {
            discount: 0,
            freight: 0,
            expiration: 5,
            deadline: 90,
            payment_method: '',
            general_info: `Pedimos atenção a alguns pontos que antes do fechamento do pedido:
1) Conferir com atenção as dimensões das peças; 
2) Conferir com atenção os acabamentos, caso eles já tenham sido escolhidos;`,
            info: ''
          }

          const versions = proposalData && proposalData.versions.length > 0 ? proposalData.versions.map((version: VersionT) => {
            if (version.num === versionNum) {
              version.complement = version.complement || defaultComplement
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