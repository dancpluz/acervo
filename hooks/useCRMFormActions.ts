import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addProposal, updateEntity, deleteEntity } from '@/lib/dbWrite';
import { checkExistingFields } from '@/lib/dbRead';
import { UseFormReturn } from 'react-hook-form';
import { entityTitles } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { deleteToast } from '@/hooks/general';

export interface FormActionsT {
  addSubmit: (values: any) => Promise<void>;
  editSubmit: (values: any) => Promise<void>;
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
  entity: string,
  id: string,
  refEntities: string[],
): FormActionsT {

  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [conflicts, setConflicts] = useState<{ [key: string]: [string, number] } | undefined>(undefined);
  const entityTitle = entityTitles[entity];

  useEffect(() => {
    // console.log(form.getValues());
    // console.log('errors: ')
    // console.log(form.formState.errors)
  }, [form.formState]);

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function addSubmit(values: any) {
    delete values.temp
    values.num = 1
    try {
      await addProposal(values, id, entity, refEntities)
    
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
    addSubmit,
    editSubmit,
    deleteSubmit,
    isEditing,
    setIsEditing,
    popupOpen,
    setPopupOpen,
    conflicts
  };
}