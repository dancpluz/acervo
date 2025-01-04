'use client'

import { StatusButton } from "@/components/StatusButtons";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { fields, proposalFields } from "@/lib/fields";
import { formatFields, stringToSlug, timestampToDate } from "@/lib/utils";
import useCRMFormActions from "@/hooks/useCRMFormActions";
import { ReferenceField, InputField, SelectField, TitleField } from "@/components/AllFields";
import { Form, FormLabel } from "@/components/ui/form";
import { FormDiv, FieldDiv } from "@/components/ui/div";
import { Button } from "@/components/ui/button";
import { CirclePlus, X } from 'lucide-react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, Timestamp } from 'firebase/firestore';
import db from '@/lib/firebase';
import FormFactory from "@/components/FormFactory";
import FormOffice from "@/components/FormOffice";
import FormClient from "@/components/FormClient";
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose
} from "@/components/ui/popover"
import ActionForm from "@/components/ActionForm";
import { ClientT, CollaboratorT, OfficeT, ProposalT } from "@/lib/types";
import { PriorityField } from "@/components/PriorityIndicator";
import { CRMPopup } from "./AllPopups";

let [defaultValues, fieldValidations] = formatFields({...proposalFields, temp: proposalFields.actions, temp_edit: proposalFields.actions }, ['actions', 'products'])
defaultValues['status'] = '1';
defaultValues['priority'] = '1';
defaultValues['temp'] = '';
defaultValues['temp_edit'] = '';

export default function ProposalForm({ data, setPopupOpen }: { data?: ProposalT, setPopupOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [shard, loading, error] = useDocumentData(doc(db, 'shard', 'proposal'));

  const [referenceInfo, setReferenceInfo] = useState<{ [key: string] : '' | CollaboratorT | ClientT | OfficeT }>({ client: '', collaborator: '', office: '' });
  const [actionPopupOpen, setActionPopupOpen] = useState(false);

  const setFunctions = async () => {
    const { collaborator, client, office } = data as ProposalT;
    if (collaborator) {
      setReferenceInfo((prev) => ({...prev, collaborator: collaborator as CollaboratorT}));
    }
    if (client) {
      setReferenceInfo((prev) => ({...prev, client: client as ClientT}));
    }
    if (office) {
      setReferenceInfo((prev) => ({...prev, office: office as OfficeT}));
    }
  }

  if (data) {
    const values = Object.assign({},data)

    const { collaborator, client, office, actions } = values as ProposalT;
    defaultValues = values;
    defaultValues.collaborator = collaborator?.id || '';
    defaultValues.client = client?.id || '';
    defaultValues.office = office?.id || '';
    
    if (actions && actions.length > 0) {
      const newActions = actions.map((action) => {
        const date = action.date instanceof Date ? action.date : timestampToDate(action.date as Timestamp)
        return { ...action, date }
      })
      defaultValues.actions = newActions;
    }
  }

  const form = useForm<z.infer<typeof fieldValidations>>({
    resolver: zodResolver(z.object({ ...fieldValidations.shape, temp: fieldValidations.shape.temp.optional().or(z.literal('')), temp_edit: fieldValidations.shape.temp_edit.optional().or(z.literal('')) })),
    defaultValues,
    shouldFocusError: false,
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'actions',
  });

  const today = new Date();
  const id = data ? data.id : `${loading ? '' : shard.index + 1}${form.watch('name') ? '_' + stringToSlug(form.watch('name')) : ''}${referenceInfo.client ? '_' + stringToSlug(referenceInfo.client.person.label) : ''}${referenceInfo.office ? '_' + stringToSlug(referenceInfo.office.person.label) : ''}${referenceInfo.collaborator ? '_' + stringToSlug(referenceInfo.collaborator.person.label) : ''}_${format(today, "dd-MM-yyyy")}`
  
  const {
    proposalSubmit,
  } = useCRMFormActions(id, setPopupOpen, data, setFunctions);

  useEffect(() => {
    if (!data && !loading && shard) {
      form.setValue('num', shard.index + 1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, shard, loading]);

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
  
  return (
    <div className='flex flex-col bg-background gap-4 p-4 rounded-lg'>
      <Form {...form}>
        <form className='flex flex-col gap-4' onSubmit={form.handleSubmit(proposalSubmit)}>
          <span className='text-sm text-tertiary'>{id}</span>
          <div className='flex justify-between w-full'>
            <TitleField path='' obj={proposalFields.name} />
            <div className='flex flex-col gap-1'>
              <PriorityField obj={proposalFields.priority} priority={form.watch('priority')} />
            </div>
          </div>
          <div className='flex gap-2 py-3'>
            <StatusButton type='front' text='Solicitado' statusNum={Number(form.watch('status'))} num={1} onClick={() => form.setValue('status','1')} />
            <StatusButton type='both' text='Enviado' statusNum={Number(form.watch('status'))} num={2} onClick={() => form.setValue('status','2')} />
            <StatusButton type='both' text='Revisão' statusNum={Number(form.watch('status'))} num={3} onClick={() => form.setValue('status','3')} />
            <StatusButton type='both' text='Esperando' statusNum={Number(form.watch('status'))} num={4} onClick={() => form.setValue('status','4')} />
            <StatusButton type='both' text='Negociação' statusNum={Number(form.watch('status'))} num={5} onClick={() => form.setValue('status','5')} />
            <StatusButton type='back' text='Fechado' statusNum={Number(form.watch('status'))} num={6} onClick={() => form.setValue('status','6')} />
            <StatusButton type='lost' text='Perdido' statusNum={Number(form.watch('status'))} num={0} onClick={() => form.setValue('status','0')} />
          </div>
          <FormDiv className='flex-row gap-4 w-full'>
            <FieldDiv className='flex-col gap-4 w-full'>
              <ReferenceField customClass={'grow-0'} obj={proposalFields.collaborator} refPath='collaborator' onSelect={(e: CollaboratorT) => setReferenceInfo((prev) => ({...prev, collaborator: e}))} addForm={<FormFactory />} hint={'Ex. Punto'} person />
              <ReferenceField customClass={'grow-0'} obj={proposalFields.client} refPath='client' onSelect={(e: ClientT) => setReferenceInfo((prev) => ({...prev, client: e}))} addForm={<FormClient />} hint={'Ex. Punto'} person />
              <InputField customClass={'grow-0'} path='' obj={fields.observations} long />
            </FieldDiv>
            <FieldDiv className='flex-col gap-4 w-full grow-0'>
              <ReferenceField customClass={'grow-0'} obj={proposalFields.office} refPath='office' onSelect={(e: OfficeT) => setReferenceInfo((prev) => ({...prev, office: e}))} addForm={<FormOffice />} hint={'Ex. Punto'} person />
              <div className='flex gap-2'>
                <SelectField path='' obj={proposalFields.client_type} />
                <SelectField path='' obj={proposalFields.project_type} />
              </div>
              <SelectField customClass={'grow-0'} path='' obj={proposalFields.origin} />
              <div className='flex gap-1 flex-col'>
                <FormLabel>AÇÕES</FormLabel>
                <div className='flex gap-1 flex-wrap'>
                  {fieldArray.fields.sort((a,b) => a.date - b.date).map((action) => 
                    {
                      const index = fieldArray.fields.indexOf(action)

                      return (
                      <Popover key={action.id}>
                        <PopoverTrigger asChild>
                          <Button onClick={() => form.setValue('temp_edit', fieldArray.fields[index])} type='button' className='border text-sm border-primary rounded-full text-foreground bg-background hover:bg-secondary/20 h-auto py-1 px-2'>
                            {format(action.date, 'dd/MM/yyyy (HH:mm)')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='flex flex-col p-4 w-[320px] border border-secondary bg-background justify-between'>
                          <PopoverClose className='absolute top-4 right-4'>
                            <X className="h-5 w-5 text-primary/60 hover:text-primary" />
                          </PopoverClose>
                          {index}
                          <ActionForm path={'temp_edit'} remove={() => fieldArray.remove(index)} edit={() => editItem(index)} />
                        </PopoverContent>
                      </Popover>
                      )
                    }
                  )}
                  <Popover open={actionPopupOpen} onOpenChange={() => { actionPopupOpen && form.resetField('temp');setActionPopupOpen(prev => !prev) }}>
                    <PopoverTrigger asChild>
                      <Button onClick={() => form.setValue('temp', { date: '', description: '', collaborator: '' })} type='button' className='gap-1 rounded-full text-sm border border-primary text-foreground bg-background hover:bg-secondary/20 h-auto py-1 px-2 pl-1'>
                        <CirclePlus className='h-5 w-5 text-primary' />Nova ação
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent onInteractOutside={(e) => e.preventDefault()} className='flex flex-col p-4 w-[320px] border border-secondary bg-background justify-between'>
                      <PopoverClose className='absolute top-4 right-4'>
                        <X className="h-5 w-5 text-primary/60 hover:text-primary" />
                      </PopoverClose>
                      <ActionForm path={'temp'} append={appendItem} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </FieldDiv>
          </FormDiv>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-tertiary'>Data de criação: {today.toLocaleDateString('pt-BR')}</span>
            <Button disabled={submitLoading || loading} type='submit'>
              <CirclePlus />{data ? 'EDITAR' : 'ADICIONAR'} PROPOSTA
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export function ProposalDialog() {
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <CRMPopup
      button={
        <Button>
          <CirclePlus /> NOVA PROPOSTA
        </Button >
      }
      popupOpen={popupOpen}
      setPopupOpen={setPopupOpen}
    >
      <ProposalForm setPopupOpen={setPopupOpen} />
    </CRMPopup>
  )
}
