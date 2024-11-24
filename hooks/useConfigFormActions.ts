import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import { entityTitles } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { errorToast } from '@/hooks/general';
import db from '@/lib/firebase';
import { setDoc, doc, collection, deleteDoc, addDoc } from 'firebase/firestore';
import { converters } from '@/lib/converters';

export default function useConfigFormActions(
  form: UseFormReturn<any>,
  data: any,
  subcollection: string,
  config: string,
) {
  const router = useRouter();
  const entityTitle = entityTitles[config];

  useEffect(() => {
    console.log(form.getValues());
  }, [form.formState]);

  useEffect(() => {
    form.reset({ [config]: data });
  }, [data]);

  async function onSubmit(values: any) {
    try {
      values[config].forEach(async (e: any, i: number) => {
        console.log(e,i)
        const configCollection = collection(db, 'config', subcollection, config).withConverter(converters[config])
        if (e.id) {
          const docRef = doc(configCollection, e.id)
          await setDoc(docRef, e)
        } else {
          await addDoc(configCollection, e)
        }
      })

      toast({
        title: `${entityTitle.plural[0].toUpperCase() + entityTitle.plural.slice(1)} salv${entityTitle.sufix}s com sucesso!`,
      });

      router.refresh();
    } catch (error) {
      console.log(error);
      errorToast(error);
    }
  }

  async function undoSubmit() {
    // WIP
    try {
      form.reset({ keepDirty: true, keepDirtyValues: false });
    } catch (error) {
      console.log(error);
      errorToast(error);
    }
  }

  async function deleteSubmit(id: string) {
    try {
      await deleteDoc(doc(db, 'config', subcollection, config, id))

      toast({
        title: `${entityTitle.singular[0].toUpperCase() + entityTitle.singular.slice(1)} removid${entityTitle.sufix} com sucesso!`,
      });
    } catch (error) {
      console.log(error);
      errorToast(error);
    }
  }

  return {
    onSubmit,
    undoSubmit,
    deleteSubmit,
  };
}