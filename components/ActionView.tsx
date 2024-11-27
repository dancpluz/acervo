'use client'

import { useCRMContext } from "@/hooks/useCRMContext";
import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "@/components/ui/popover";
import { X, CirclePlus, ChevronDown, SquarePen, CircleCheckBig, Trash } from "lucide-react";
import ActionForm from "./ActionForm";
import { useState } from "react";
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { timestampToDate, cn, formatFields } from "@/lib/utils";
import { useForm, useFieldArray } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actionFields } from "@/lib/fields";
import { ActionT } from "@/lib/types";
import { z } from "zod";


let [, fieldValidations] = formatFields({ actions: actionFields, temp: actionFields, temp_edit: actionFields });

export default function ActionView() {
  const { proposal } = useCRMContext();
  const [actionPopupOpen, setActionPopupOpen] = useState(false);

  const form = useForm<z.infer<typeof fieldValidations>>({
    resolver: zodResolver(fieldValidations),
    defaultValues: { actions: proposal.actions.map((action) => {
        const date = action.date instanceof Date ? action.date : timestampToDate(action.date as Timestamp)
        return { ...action, date }
      }) },
    shouldFocusError: false,
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'actions',
  });

  const appendItem = async () => {
    await form.trigger('temp')
    if (!form.formState.errors.temp) {
      fieldArray.append(form.getValues('temp'))
      form.resetField('temp')
      setActionPopupOpen(false)
    }
  }

  const editItem = async (index: number) => {
    await form.trigger('temp_edit')
    if (!form.formState.errors.temp_edit) {
      fieldArray.update(index, form.getValues('temp_edit'))
      form.resetField('temp_edit')
      setActionPopupOpen(false)
    }
  }

  const submitLoading = form.formState.isSubmitting && !form.formState.isDirty;

  if (!proposal) return (
    <div>Carregando...</div>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        <div className='flex flex-col relative gap-2'>
          {fieldArray.fields.sort((a,b) => a.date - b.date).map((action, i) => 
            <ActionCard key={i + '-' + action.date.toString()} action={action} fieldArray={fieldArray} />
          )}
          <div className='flex justify-between'>
            <Popover open={actionPopupOpen} onOpenChange={setActionPopupOpen}>
              <PopoverTrigger asChild>
                <Button type='button' className='p-2'>
                  <CirclePlus className='size-5' />
                  NOVA AÇÃO
                </Button>
              </PopoverTrigger>
              <PopoverContent onInteractOutside={(e) => e.preventDefault()} className='flex flex-col p-4 w-[320px] border border-secondary bg-background justify-between'>
                <PopoverClose className='absolute top-4 right-4'>
                  <X className="h-5 w-5 text-primary/60 hover:text-primary" />
                </PopoverClose>
                <ActionForm path={'temp'} append={appendItem} />
              </PopoverContent>
            </Popover>
            <Button disabled={true || submitLoading} className='p-2 bg-background' variant='outline' type='submit'>
              <CircleCheckBig className='text-primary size-5' />
              SALVAR
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

function ActionCard({ action, fieldArray }: { action: ActionT }) {
  const [isOpen, setIsOpen] = useState(false)

  const dateFull = action.date instanceof Date ? action.date : timestampToDate(action.date as Timestamp)
  const date = format(dateFull, 'dd/MM/yyyy')
  const hour = format(dateFull, 'HH:mm')

  const index = fieldArray.fields.indexOf(action)
  const length = fieldArray.fields.length

  const lastIndex = length === index + 1
  const firstIndex = index === 0

  return (
    <div className='first:bg-secondary/20 relative rounded-lg p-2'>
      <div className='flex items-center justify-between'>
        <h2 className='text-base'>
          {'Thiago'}
        </h2>
        <div className='flex items-center gap-2'>
          <div className='flex flex-col text-xs items-end'>
            <span>
              {date}
            </span>
            <span>
              {hour}
            </span>
          </div>
          <span className={cn('size-2 bg-secondary rounded-full relative', firstIndex ? 'before:animate-ping before:bg-secondary before:absolute before:inline-flex before:size-full before:rounded-full before:animate-ping' : '')}/>
          <span style={{ display: lastIndex ? 'none' : 'block' }} className='absolute h-[calc(100%-8px)] top-8 right-[11px] w-[2px] bg-secondary' />
        </div>
      </div>
      <div className='flex gap-1 relative mr-4'>
        <p onClick={() => setIsOpen(prev => !prev)} className={cn('cursor-pointer text-xs',isOpen ? '' : 'line-clamp-2')}>
          {'Cras vel fermentum ligula, vitae fringilla felis. Vivamus ullamcorper nunc ac sem blandit, non dignissim tellus pulvinar.'}
        </p>
        <ChevronDown onClick={() => setIsOpen(prev => !prev)} className={cn('cursor-pointer absolute bottom-0 right-12 text-tertiary size-4', isOpen ? 'hidden' : '')} />
        <div className='flex items-end'>
          <Button disabled className='p-1 h-auto w-auto' variant='ghost'>
            <Trash onClick={() => fieldArray.remove(index)} className='size-4 text-primary' />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button disabled className='p-1 h-auto w-auto' variant='ghost'>
                <SquarePen onClick={() => console.log('tys')} className='size-4 text-primary' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='flex flex-col p-4 w-[320px] border border-secondary bg-background justify-between'>
              <PopoverClose className='absolute top-4 right-4'>
                <X className="h-5 w-5 text-primary/60 hover:text-primary" />
              </PopoverClose>
              <ActionForm path={'actions.' + index} remove={() => fieldArray.remove(index)} edit={() => console.log('test', index)} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
