'use client'

import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CircleX, CirclePlus, CircleCheck, Undo } from 'lucide-react';
import { useForm, useFieldArray } from "react-hook-form";
import { freightFields } from "@/lib/fields";
import { formatFields, calculateTextWidth } from "@/lib/utils";
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
import { FreightT } from "@/lib/types";
import { useConfigFormActions } from "@/lib/hooks";

const fieldValidations = z.object({ freight: z.array(z.object(Object.values(freightFields).reduce((acc, field) => ({ ...acc, [field.value]: field.validation }), {}))) })
const [defaultArrayValues, ] = formatFields(freightFields);

export default function FreightForm({ data }: { data: FreightT[] }) {
  const form = useForm<any>({
    resolver: zodResolver(fieldValidations),
    defaultValues: { freight: data },
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'freight',
  });

  const appendItem = async () => {
    await form.trigger('freight')
    if (!form.formState.errors.freight) {
      fieldArray.append(defaultArrayValues)
    }
  }

  const {
    onSubmit,
    undoSubmit,
    deleteSubmit,
  } = useConfigFormActions(form, 'markup_freight', 'freight');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex gap-2'>
          <div className='flex w-full flex-wrap gap-2'>
            {fieldArray.fields.length > 0 ? fieldArray.fields.map((row: any, index) => {
              return (
                <div key={row.id} onClick={() => document.getElementById(`freight.${index}.${freightFields.region.value}`)?.focus()} className='flex border rounded-lg cursor-pointer h-10 hover:bg-secondary/20 border-secondary gap-1 items-center px-2'>
                  <FormField
                    control={form.control}
                    name={`freight.${index}.${freightFields.region.value}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input id={`freight.${index}.${freightFields.region.value}`} style={{ width: calculateTextWidth(16, field.value) }} className='p-0 border-none h-10 text-base min-w-5 focus-visible:ring-transparent focus-visible:ring-offset-0' mask={freightFields.region.mask} {...field} />
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
                  {row.ref ?
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <CircleX className='w-5 h-5 text-destructive cursor-pointer' />
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
                          <AlertDialogAction onClick={() => { deleteSubmit(row.ref); fieldArray.remove(index) }}>APAGAR</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    :
                    <CircleX onClick={() => fieldArray.remove(index)} className='text-destructive cursor-pointer' />}
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
              <Button type="button" disabled variant='outline' onClick={()=> ''} className="border-primary"><Undo className='text-primary' />DESFAZER</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
