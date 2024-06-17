'use client'

import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CircleX, CirclePlus, CircleCheck, Undo } from 'lucide-react';
import { useForm, useFieldArray } from "react-hook-form";
import { freightFields } from "@/lib/fields";
import { formatVerifications, createDefaultValues, calculateTextWidth } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from 'react';
import { FreightT } from "@/lib/types";

const freightDefaultValues = createDefaultValues(freightFields);
const freightVerification = formatVerifications(freightFields);

const freightSchema = z.object({ freight: z.array(z.object(freightVerification)) });

export default function FreightForm({ data }: { data: FreightT[] }) {
  const [initialValues, setInitialValues] = useState<FreightT[] | null>(null)

  const form = useForm<z.infer<typeof freightSchema>>({
    resolver: zodResolver(freightSchema),
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'freight',
  });

  const appendItem = async () => {
    await form.trigger('freight')
    if (!form.formState.errors.freight) {
      fieldArray.append(freightDefaultValues)
    }
  }

  useEffect(() => {
    if (data) {
      initialValues ?? setInitialValues(data)
      form.setValue('freight', data)
      console.log(initialValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  async function onSubmit(values: z.infer<typeof freightSchema>) {
    // Check if values already exists
    console.log(values)
    form.setValue('freight', [{ id: 'sagfasg', region: 'DF', fee: '' }, { id: 'dsgsdg', region: 'Teste', fee: '5' }])
    //markupForm.setValue('freight', [{id: 'sagfasg', region: 'DF', fee: 0},{id: 'dsgsdg', region: 'Teste',fee: 5}])
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex gap-2'>
          <div className='flex w-full flex-wrap gap-2'>
            {fieldArray.fields.length > 0 ? fieldArray.fields.map((row, index) => {
              return (
                <div key={row.id} onClick={() => document.getElementById(`freight.${index}.${freightFields.region.value}`)?.focus()} className='flex border rounded-lg cursor-pointer h-10 hover:bg-secondary/20 border-secondary gap-1 items-center px-2'>
                  <FormField
                    control={form.control}
                    name={`freight.${index}.${freightFields.region.value}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input id={`freight.${index}.${freightFields.region.value}`} style={{ width: calculateTextWidth(16, field.value) }} className='p-0 border-none h-10 text-base min-w-4 focus-visible:ring-transparent focus-visible:ring-offset-0' mask={freightFields.region.mask} {...field} />
                        </FormControl>
                        <FormMessage className='top-0.5' />
                      </FormItem>
                    )} />
                  <FormField
                    control={form.control}
                    name={`freight.${index}.${freightFields.fee.value}`}
                    render={({ field }) => (
                      <FormItem className='bg-secondary rounded-sm px-1 text-sm' onClick={(e) => {e.stopPropagation(); document.getElementById(`freight.${index}.${freightFields.fee.value}`)?.focus()}}>
                        <FormControl>
                          <div className='flex items-center'>
                            <Input id={`freight.${index}.${freightFields.fee.value}`} style={{ width: calculateTextWidth(12, field.value) }} className='p-0 border-none h-5 text-sm focus-visible:ring-offset-1 rounded-sm focus-visible:ring-primary selection:bg-background' mask={freightFields.region.mask} {...field} />
                            {field.value !== '' ? <span>%</span> : <span>Grátis</span>}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <CircleX className='h-5 w-5 text-destructive cursor-pointer' />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza que deseja apagar?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Essa ação eliminará removerá os dados dos nossos servidores. Essa ação é irreversível.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>CANCELAR</AlertDialogCancel> 
                        <AlertDialogAction onClick={() => fieldArray.remove(index)}>APAGAR</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                )
              }
            )
            : 
            <p className='text-tertiary'>Sem fretes cadastrados...</p>
            }
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex border-secondary border transition-colors hover:bg-secondary/20 rounded-md font-normal justify-center gap-2 cursor-pointer items-center py-2' onClick={appendItem}>
              <CirclePlus className='text-primary w-5 h-5' />
              Adicionar Frete
            </div>
            <div className='flex grow justify-end gap-2'>
              <Button type="submit"><CircleCheck className='text-background' />SALVAR</Button>
              <Button type="button" variant='outline' onClick={initialValues ? () => form.setValue('freight', initialValues) : undefined} className="border-primary"><Undo className='text-primary' />DESFAZER</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
