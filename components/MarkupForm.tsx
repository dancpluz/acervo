'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { CirclePlus, CircleX, Pencil, Undo, CircleCheck } from 'lucide-react';
import { markupFields } from "@/lib/fields";
import { Button } from '@/components/ui/button';
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { createDefaultArray } from "@/lib/utils";
import useConfigFormActions from "@/hooks/useConfigFormActions";
import useGetEntities from '@/hooks/useGetEntities';
import { converters } from '@/lib/converters';

const fieldValidations = z.object({ markup: z.array(z.object(Object.values(markupFields).reduce((acc, field) => ({ ...acc, [field.value]: field.validation }), {}))) })
const defaultArrayValues = createDefaultArray(markupFields);

export default function MarkupForm() {
  const [data, loading, error] = useGetEntities('config, markup_freight, markup', converters['markup']);

  const form = useForm<any>({
    resolver: zodResolver(fieldValidations),
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'markup',
    keyName: 'uuid',
  });

  const appendItem = async () => {
    await form.trigger('markup')
    if (!form.formState.errors.markup) {
      fieldArray.append(defaultArrayValues)
    }
  }

  const {
    onSubmit,
    undoSubmit,
    deleteSubmit,
  } = useConfigFormActions(form, data, 'markup_freight', 'markup');
  
  const order = ["name", "observation", "12x", "6x", "cash"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-1'>
          <Table containerClassName="border-primary">
            <TableHeader className='bg-primary border-b border-secondary'>
              <TableRow className='border-0'>
                {markupFields.filter(field => order.includes(field.value)).map((column) => {
                  return (
                    <TableHead style={{ width: column.size}} key={column.label} className={`first:pl-4 px-4 text-background text-base`}>{column.label}</TableHead>
                  )
                })}
                <TableHead style={{ width: '24px'}} className='text-base w-2 px-0'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {fieldArray.fields.length > 0 ? fieldArray.fields.map((row: any, index) => {
                console.log(row)
                return (
                  <TableRow className='odd:bg-background even:bg-secondary/20' key={row.uuid}>
                    {Object.keys(row).sort((a, b) => { return order.indexOf(a) - order.indexOf(b) }).slice(2).map((key, i) => {
                      return (
                        <TableCell className='first:pl-4 transition-colors hover:cursor-pointer hover:bg-secondary/10' onClick={() => document.getElementById(`markup.${index}.${key}`)?.focus()} key={key}>
                          <FormField
                            control={form.control}
                            name={`markup.${index}.${key}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className='flex items-center gap-2 mr-6'>
                                    <Input id={`markup.${index}.${key}`} containerClassName={`${field.value === '' ? 'border-b' : ''} border-secondary`} className='px-0 focus-visible:rounded-sm border-0 focus-visible:ring-offset-4 h-4 focus-visible:bg-background' placeholder={markupFields[i + 1]?.placeholder} mask={markupFields[i + 1]?.mask} {...field} />
                                    {i === 2 && <span className='text-tertiary'>x</span>}
                                    {i > 2 && <span className='text-tertiary'>%</span>}
                                  </div>
                                </FormControl>
                                <Pencil className='text-secondary w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-0'/>
                                <FormMessage className='bottom-[18px]' />
                              </FormItem>
                            )} />
                        </TableCell>
                      )
                    })}
                    <TableCell className='flex justify-center pl-2 pr-4'>
                      {row.id ? 
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <CircleX className='text-destructive cursor-pointer' />
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
                            <AlertDialogAction onClick={() => {deleteSubmit(row.id); fieldArray.remove(index)}}>APAGAR</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      :
                      <CircleX onClick={() => fieldArray.remove(index)} className='text-destructive cursor-pointer' /> }
                    </TableCell>
                  </TableRow>
                )
              }) : 
                <TableRow>
                  <TableCell colSpan={markupFields.length + 2} className="h-16 text-center text-base text-tertiary">
                    Sem marcações cadastradas...
                  </TableCell>
                </TableRow>}
            </TableBody>
          </Table>
          <div className='flex z-10 transition-colors hover:bg-secondary/20 rounded w-full font-normal justify-center gap-2 cursor-pointer items-center py-2' onClick={appendItem}>
            <CirclePlus className='text-primary w-5 h-5' />
            Adicionar Marcação
          </div>
          <div className='flex grow justify-end gap-2'>
            <Button disabled={!form.formState.isDirty} type="submit"><CircleCheck className='text-background' />SALVAR</Button>
            <Button disabled type="button" variant='outline' onClick={() =>  ''} className="border-primary"><Undo className='text-primary'/>DESFAZER</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}