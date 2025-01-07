'use client'

import { useCRMContext } from "@/hooks/useCRMContext";
import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "@/components/ui/popover";
import { X, CirclePlus, ChevronDown, LoaderCircle, SquarePen, CircleCheckBig, Trash } from "lucide-react";
import ActionForm from "./ActionForm";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { doc, Timestamp } from 'firebase/firestore';
import { timestampToDate, cn, formatFields, resolvePromises, getInsertIndex } from "@/lib/utils";
import { useForm, useFieldArray, useFormContext } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actionFields } from "@/lib/fields";
import { ActionT, CollaboratorT, PersonT } from "@/lib/types";
import { z } from "zod";
import { converters } from "@/lib/converters";
import db from "@/lib/firebase";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { Checkbox } from '@/components/ui/checkbox';

let [, fieldValidations] = formatFields({ actions: actionFields, temp: actionFields, temp_edit: actionFields });

export default function ActionView() {
  const { proposal, updateProposalActions } = useCRMContext();
  const [actionPopupOpen, setActionPopupOpen] = useState(false);

  const { actions } = proposal;
  let defaultValues = { actions: []};
  
  if (actions && actions.length > 0) {
    const newActions = actions.map((action: ActionT) => {
      const date = action.date instanceof Date ? action.date : timestampToDate(action.date as Timestamp)
      return { ...action, date }
    })
    defaultValues.actions = newActions;
  }

  const shape = fieldValidations.shape

  const form = useForm<z.infer<typeof fieldValidations>>({
    resolver: zodResolver(z.object({ actions: shape.actions.array(), temp: shape.temp.optional().or(z.literal('')), temp_edit: shape.temp_edit.optional().or(z.literal('')) })),
    defaultValues,
    shouldFocusError: false,
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'actions',
  });

  const appendItem = async () => {
    await form.trigger('temp')
    if (!form.formState.errors.temp) {
      fieldArray.insert(getInsertIndex<ActionT>(fieldArray.fields, form.getValues('temp').date), form.getValues('temp'))
      form.resetField('temp')
      setActionPopupOpen(false)
    }
  }

  const submitLoading = form.formState.isSubmitting && !form.formState.isDirty;

  if (!proposal) return (
    <div>Carregando...</div>
  )

  const tempDefaultValues = {
    done: false,
    date: '',
    description: '',
    collaborator: ''
  }

  async function onSubmit(values: z.infer<typeof fieldValidations>) {
    await updateProposalActions(values.actions)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col relative gap-2'>
          {fieldArray.fields.map((action) => 
            <ActionCard key={action.id} action={action} fieldArray={fieldArray} />
          )}
          <div className='flex justify-between'>
            <Popover open={actionPopupOpen} onOpenChange={setActionPopupOpen}>
              <PopoverTrigger asChild>
                <Button onClick={() => form.setValue('temp', tempDefaultValues)} type='button' className='p-2'>
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
            <Button disabled={submitLoading} className='p-2 bg-background' variant='outline' type='submit'>
              <CircleCheckBig className='text-primary size-5' />
              SALVAR
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

function ActionCard({ action, fieldArray }: { action: ActionT, fieldArray: ReturnType<typeof useFieldArray<ActionT>> }) {
  const form = useFormContext();

  const [collaborator, setCollaborator] = useState<CollaboratorT | undefined>(undefined)
  const docRef = doc(db, 'collaborator', action.collaborator as string).withConverter(converters['collaborator']);
  const [data, loading, error] = useDocumentDataOnce<CollaboratorT>(docRef);
  const [actionPopupOpen, setActionPopupOpen] = useState(false);

  useEffect(() => {
    resolvePromises(data).then((res) => setCollaborator(res))
  }, [data])

  const [isOpen, setIsOpen] = useState(false)

  const dateFull = action.date instanceof Date ? action.date : timestampToDate(action.date as Timestamp)
  const date = format(dateFull, 'dd/MM/yyyy')
  const hour = format(dateFull, 'HH:mm')

  const index = fieldArray.fields.indexOf(action)
  const filterIndex = fieldArray.fields.filter((field) => !field.done).indexOf(action)
  const length = fieldArray.fields.length
  
  const done = action.done === true ? true : false

  const lastIndex = length === index + 1
  const firstIndex = filterIndex === 0

  const dateColor = () => {
    const currentDate = new Date();
    const timeDiff = dateFull.getTime() - currentDate.getTime();
    const daysRemaining = timeDiff / (1000 * 60 * 60 * 24);

    if (done) {
      return '#6B6B6B'
    }

    if (daysRemaining <= 1) {
      return '#D3523C'; // 1 day or less
    } else if (daysRemaining <= 3) {
      return '#CA8A04'; // 3 days remaining
    } else {
      return '#485813'; // More than 3 days remaining
    }
  }
  const color = dateColor()

  const editItem = async (index: number) => {
    await form.trigger('temp_edit')
    if (!form.formState.errors.temp_edit) {
      fieldArray.remove(index)
      fieldArray.insert(getInsertIndex<ActionT>(fieldArray.fields, form.getValues('temp_edit').date), form.getValues('temp_edit'))
      form.resetField('temp_edit')
      setActionPopupOpen(false)
    }
  }

  return (
    <div className='first:bg-secondary/20 relative rounded-lg p-2'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-1 items-center'>
          <Checkbox checked={done} onCheckedChange={(e) => fieldArray.update(index, { ...action, done: e}) } />
          <h2 className={cn('text-base', done ? 'line-through' : '')}>
            {loading || collaborator === undefined ? <LoaderCircle className='text-primary size-5 animate-spin' /> : (collaborator.person as PersonT).label}
          </h2>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex flex-col text-xs items-end'>
            <span style={{ color: color }} className={done ? 'line-through' : ''}>
              {date}
            </span>
            <span style={{ color: color }} className={done ? 'line-through' : ''}>
              {hour}
            </span>
          </div>
          <span style={{ backgroundColor: color }} className={cn(`size-2 rounded-full relative`, firstIndex ? `before:animate-ping before:bg-inherit before:absolute before:inline-flex before:size-full before:rounded-full` : '')}/>
          <span style={{ display: lastIndex ? 'none' : 'block' }} className={`absolute h-[calc(100%-8px)] top-8 right-[11px] w-[2px] bg-primary`} />
        </div>
      </div>
      <div className='flex gap-1 relative mr-4'>
        <p onClick={() => setIsOpen(prev => !prev)} className={cn('cursor-pointer grow text-xs',isOpen ? '' : 'line-clamp-2', done ? 'line-through' : '')}>
          {action.description}
        </p>
        <ChevronDown onClick={() => setIsOpen(prev => !prev)} className={cn('cursor-pointer absolute bottom-0 right-12 text-tertiary size-4', isOpen || !action.description || action.description.length <= 40 ? 'hidden' : '')} />
        <div className='flex items-end'>
          <Button className='p-1 h-auto w-auto' variant='ghost'>
            <Trash onClick={() => fieldArray.remove(index)} className='size-4 text-primary' />
          </Button>
          <Popover open={actionPopupOpen} onOpenChange={() => { actionPopupOpen && form.resetField('temp'); setActionPopupOpen(prev => !prev) }}>
            <PopoverTrigger asChild>
              <Button onClick={() => form.setValue('temp_edit', fieldArray.fields[index])} className='p-1 h-auto w-auto' variant='ghost'>
                <SquarePen className='size-4 text-primary' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='flex flex-col p-4 w-[320px] border border-secondary bg-background justify-between'>
              <PopoverClose className='absolute top-4 right-4'>
                <X className="h-5 w-5 text-primary/60 hover:text-primary" />
              </PopoverClose>
              <ActionForm path={'temp_edit'} remove={() => fieldArray.remove(index)} edit={() => editItem(index)} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
