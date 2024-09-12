import { useRouter } from 'next/navigation';
import { updateConfig, addConfig, deleteConfig } from '@/lib/dbWrite';
import { UseFormReturn } from 'react-hook-form';
import { entityTitles } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { deleteToast } from '@/hooks/general';

export default function useConfigFormActions(
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
          if (form.getFieldState(config + "." + i).isDirty) { updateConfig(e, subcollection, config) }
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