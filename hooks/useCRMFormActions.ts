import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateIndex } from '@/lib/dbWrite';
import { UseFormReturn } from 'react-hook-form';
import { entityTitles } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { deleteToast } from '@/hooks/general';
import { converters } from '@/lib/converters';
import db from '@/lib/firebase';
import { setDoc, doc, collection, updateDoc, getDoc } from 'firebase/firestore';
import { VersionT } from '@/lib/types';
import { useCRMContext } from '@/hooks/useCRMContext';

export interface FormActionsT {
  proposalSubmit: (values: any) => Promise<void>;
  productSubmit: (values: any) => Promise<void>;
  editSubmit: (values: any) => Promise<void>;
  saveProduct: boolean;
  setSaveProduct: React.Dispatch<React.SetStateAction<boolean>>;
  deleteSubmit: () => Promise<void>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  popupOpen: boolean;
  setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conflicts: any;
}

export default function useCRMFormActions(
  form: UseFormReturn,
  data: any,
  id: string,
): FormActionsT {

  const { proposal, versionNum } = useCRMContext();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [saveProduct, setSaveProduct] = useState<boolean>(false);
  const [conflicts, setConflicts] = useState<{ [key: string]: [string, number] } | undefined>(undefined);

  // useEffect(() => {
  //   console.log(form.getValues());
  //   console.log('errors: ')
  //   console.log(form.formState.errors)
  // }, [form.formState]);

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function proposalSubmit(values: any) {
    const entityTitle = entityTitles['proposal'];

    try {
      try {
        await setDoc(doc(collection(db, 'proposal'), id).withConverter(converters['proposal']), values)

        await updateIndex('proposal', values.num)

      } catch (error) {
        console.log(error);
        throw new Error('Erro ao adicionar no banco de dados')
      }
    
      toast({
        title: `${entityTitle.singular[0].toUpperCase() + entityTitle.singular.slice(1)} adicionad${entityTitle.sufix} com sucesso!`,
      });
      
    } catch (error) {
      console.log(error);
      deleteToast(error);
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

          values.factory = doc(db, 'factory', values.factory as string)
          values.freight = doc(db, 'config', 'markup_freight', 'freight', values.freight as string)
          values.markup = doc(db, 'config', 'markup_freight', 'markup', values.markup as string)
          values.id = id;

          const proposalRef = doc(db, 'proposal', proposal.id);
          const proposalDoc = await getDoc(proposalRef)
          const proposalData = proposalDoc.data()
          console.log(proposalData)

          const versions = proposalData && proposalData.versions.length > 0 ? proposalData.versions.map((version: VersionT) => {
            if (version.num === versionNum) {
              return { ...version, products: [...version.products, values] }
            }
            return version;
          }) : [{ num: versionNum, products: [values] }]

          
          await updateDoc(proposalRef, { versions })

          router.refresh()

        } else {
          throw new Error('Erro ao adicionar produto: Proposta não encontrada')
        }
      } catch (error) {
        console.log(error);
        throw new Error('Erro ao adicionar no banco de dados')
      }

      toast({
        title: `${entityTitle.singular[0].toUpperCase() + entityTitle.singular.slice(1)} adicionad${entityTitle.sufix} com sucesso!`,
      });

    } catch (error) {
      console.log(error);
      deleteToast(error);
    }
  }

  async function editSubmit(values: any) {
    console.log(values)
  }

  async function deleteSubmit() {
    console.log('delete')
  }

  return {
    proposalSubmit,
    productSubmit,
    editSubmit,
    deleteSubmit,
    isEditing,
    setIsEditing,
    popupOpen,
    setPopupOpen,
    conflicts,
    saveProduct,
    setSaveProduct
  };
}