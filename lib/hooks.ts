import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "@/components/ui/use-toast";
import { addEntity, updateEntity, deleteEntity, updateConfig, addConfig, deleteConfig } from './dbWrite';
import { checkExistingFields } from '@/lib/dbRead';
import { UseFormReturn } from 'react-hook-form';
import { entityTitles } from './utils';

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

function deleteToast(error: any) {
  toast({
    variant: 'destructive',
    title: 'Ocorreu um erro inesperado',
    description: error.message,
  });
}

export function useFormActions(
  form: UseFormReturn,
  data: any,
  entity: string,
  check: string[][],
  entityRef?: string,
): FormActionsT {

  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [conflicts, setConflicts] = useState<{ [key: string]: [string, number] } | undefined>(undefined);
  const entityTitle = entityTitles[entity];

  // useEffect(() => {
  //   console.log(form.getValues());
  // }, [form.formState]);

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function addSubmit(values: any) {
    try {
      if (!popupOpen) {
        // Buscar conflitos nos caminhos especificados
        const found = await checkExistingFields(values, check);

        if (Object.keys(found).length !== 0) {
          // Se for encontrado conflitos, avisar o usuario
          setConflicts(found);
          setPopupOpen(true);
        } else {
          // Se não encontrar, adicionar normalmente
          await addEntity(values, entity, entityRef);
          toast({
            title: `${entityTitle.singular[0].toUpperCase() + entityTitle.singular.slice(1)} adicionad${entityTitle.sufix} com sucesso!`,
          });
          setPopupOpen(false);
        }
      } else if (popupOpen && conflicts) {
        // Usuario optar por adicionar mesmo com os conflitos

        await addEntity(values, entity, entityRef);
        toast({
          title: `${entityTitle.singular[0].toUpperCase() + entityTitle.singular.slice(1)} adicionad${entityTitle.sufix} com sucesso!`,
        });

        setPopupOpen(false);
        setConflicts(undefined);
      }
    } catch (error) {
      console.log(error);
      deleteToast(error);
    }
  }

  async function editSubmit(values: any) {
    try {
      await updateEntity(values, entity, data.refs, entityRef);
      setIsEditing(false);
      toast({
        title: `${entityTitle.singular[0].toUpperCase() + entityTitle.singular.slice(1)} editad${entityTitle.sufix} com sucesso!`,
      });
    } catch (error) {
      console.log(error);
      deleteToast(error);
    }
  }

  async function deleteSubmit() {
    try {
      for (const [entity, ref] of Object.entries(data.refs)) {
        await deleteEntity(entity as string, ref as string);
      }

      toast({
        title: `${entityTitle.singular[0].toUpperCase() + entityTitle.singular.slice(1)} apagad${entityTitle.sufix} com sucesso!`,
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      deleteToast(error);
    }
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

export function useConfigFormActions(
  form: UseFormReturn<any>,
  subcollection: string,
  config: string,
) {
  const router = useRouter();
  const entityTitle = entityTitles[config];

  // useEffect(() => {
  //   console.log(form.getValues());
  // }, [form.formState]);

  async function onSubmit(values: any) {
    try {
      values[config].forEach((e: any, i: number) => {
        if (e.ref) {
          if (form.getFieldState(config + "." + i).isDirty) {updateConfig(e, subcollection, config)}
        } else {
          addConfig(e, subcollection, config);
        }
      })

      toast({
        title: `${entityTitle.plural[0].toUpperCase() + entityTitle.plural.slice(1)} salv${entityTitle.sufix}s com sucesso!`,
      });

      router.refresh();
    } catch (error) {
      console.log(error);
      deleteToast(error);
    }
  }

  async function undoSubmit() {
    try {
      form.reset({ keepDirty: true, keepDirtyValues: false });
    } catch (error) {
      console.log(error);
      deleteToast(error);
    }
  }

  async function deleteSubmit(ref: string) {
    try {
      await deleteConfig(ref, subcollection, config);

      toast({
        title: `${entityTitle.singular[0].toUpperCase() + entityTitle.singular.slice(1)} removid${entityTitle.sufix} com sucesso!`,
      });
    } catch (error) {
      console.log(error);
      deleteToast(error);
    }
  }

  return {
    onSubmit,
    undoSubmit,
    deleteSubmit,
  };
}