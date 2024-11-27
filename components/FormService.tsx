'use client'

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { EditTinyTable, TinyTable } from "@/components/TinyTable";
import { InputField, SearchField, SelectField, PersonTypeRadio } from "./AllFields";
import { serviceFisicalFields, serviceJuridicalFields, fields, enumFields, contactFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { ConfirmAlert, DeleteAlert } from "@/components/AllPopups";
import FormButton from '@/components/FormButton';
import { fillCepFields, formatFields, createDefaultArray } from "@/lib/utils";
import useEntityFormActions from "@/hooks/useEntityFormActions";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const [fisicalDefaultValues, fisicalFieldValidations] = formatFields(serviceFisicalFields, ['name', 'surname', 'info_email']);

const [juridicalDefaultValues, juridicalFieldValidations] = formatFields(serviceJuridicalFields, ['cnpj', 'company_name', 'info_email', 'tax_payer'])

let defaultValues = { ...juridicalDefaultValues, person: { ...juridicalDefaultValues.person, info: { ...juridicalDefaultValues.person.info, ...fisicalDefaultValues.person.info } } }

const tabs = ['PRESTADOR DE SERVIÇOS', 'CONTATO E ENDEREÇO'];

export default function FormService({ data, show }: { data?: any, show?: boolean }) {
  const initialPersonType = data ? data.person.info.cnpj === undefined ? 'Física' : 'Jurídica' : 'Física'

  if (data) {
    const values = Object.assign({}, data)
    defaultValues = values;
  }

  const [personType, setPersonType] = useState<'Física' | 'Jurídica'>(initialPersonType);

  const form = useForm<z.infer<typeof fisicalFieldValidations> | z.infer<typeof juridicalFieldValidations>>({
    resolver: zodResolver(personType === 'Física' ? fisicalFieldValidations : juridicalFieldValidations),
    defaultValues,
    shouldFocusError: false,
  })

  const contactForm = useFieldArray({
    control: form.control,
    name: 'person.contact',
  });

  const checkPaths = personType === 'Física' ? [['person', 'info', 'rg'], ['person', 'info', 'cpf'], ['person', 'info', 'info_email']] : [['person', 'info', 'fantasy_name'], ['person', 'info', 'company_name'], ['person', 'info', 'cnpj'], ['person', 'info', 'info_email']]

  const {
    addSubmit,
    editSubmit,
    deleteSubmit,
    isEditing,
    setIsEditing,
    popupOpen,
    setPopupOpen,
    conflicts,
  } = useEntityFormActions('service', checkPaths, data, undefined, () => setPersonType(initialPersonType));

  const formButtonProps = {
    setIsEditing,
    isEditing: show ? isEditing : undefined,
    undoForm: data ? () => { setPersonType(initialPersonType); form.reset() } : undefined,
    state: form.formState,
  }

  const disabled = show && !isEditing;

  return (
    <Tabs className='bg-secondary/20' defaultValue={tabs[0]}>
      <div className='flex'>
        <TabsList className={`${show ? 'h-8' : 'h-9'}`}>
          {tabs.map((tab) => 
            <TabsTrigger key={tab} className={`${show ? 'text-sm' : 'text-base'}`} value={tab}>{tab}</TabsTrigger>
          )}
        </TabsList>
        {show &&
          <DeleteAlert submit={deleteSubmit} >
            <Button variant='ghost' className='flex gap-2 items-center justify-center transition-opacity hover:bg-transparent hover:opacity-50 rounded-none h-9.5 border-0 border-b border-primary text-primary px-4'>
              <Trash2 className='w-4 h-4' />APAGAR
            </Button>
          </DeleteAlert>
        }
        <ConfirmAlert submit={form.handleSubmit(addSubmit)} popupOpen={popupOpen} setPopupOpen={setPopupOpen} conflicts={conflicts} resetForm={() => form.reset(undefined, { keepValues: true })} />
      </div>
      <Form {...form}>
        <form onSubmit={show ? form.handleSubmit(editSubmit) : form.handleSubmit(addSubmit)}>
          <TabsContent value={tabs[0]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.service} disabled={disabled} />
                    <PersonTypeRadio defaultValue={personType} disabled={disabled} setPersonType={data ? (val) => { setPersonType(val); form.reset(data) } : (val) => { setPersonType(val); form.reset()}} />
                  </FieldDiv>
                  <FieldDiv>
                  {personType === 'Jurídica' ?
                    <>
                      <InputField path='person.info' obj={{...fields.company_name, label: 'NOME OU RAZÃO SOCIAL'}} disabled={disabled} />
                      <InputField path='person.info' obj={fields.fantasy_name} disabled={disabled} />
                    </> :
                    <>
                      <InputField path='person.info' obj={{...fields.name, label: 'NOME'}} disabled={disabled} />
                      <InputField path='person.info' obj={{...fields.surname, label: 'SOBRENOME'}} disabled={disabled} />
                    </>}
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.info' obj={{...fields.info_email, label: 'EMAIL'}} disabled={disabled} />
                    {personType === 'Jurídica' ?
                    <>
                      <InputField path='person.info' obj={{...fields.cnpj, label: 'CNPJ'}} disabled={disabled} />
                    </> :
                    <>
                      <InputField path='person.info' obj={fields.rg} disabled={disabled} customClass={'grow-0 min-w-40'} />
                      <InputField path='person.info' obj={fields.cpf} disabled={disabled} customClass={'grow-0 min-w-44'} />
                    </>}
                  </FieldDiv>
                  <FieldDiv>
                    {personType === 'Jurídica' &&
                    <>
                      <SelectField path='person.info' obj={{...enumFields.tax_payer, label: 'CONTRIBUINTE'}} disabled={disabled} />
                      <InputField path='person.info' obj={fields.state_register} disabled={disabled} />
                      <InputField path='person.info' obj={fields.municipal_register} disabled={disabled} />
                    </>}
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <InputField path='person' obj={fields.observations} long disabled={disabled} />
                  <FieldDiv>
                    <SearchField path='person.payment' obj={enumFields.bank} hint={'Ex. Bradesco'} customClass={'overflow-hidden text-ellipsis'} disabled={disabled} />
                    <InputField path='person.payment' obj={fields.pix} disabled={disabled} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.payment' obj={fields.account} disabled={disabled} />
                    <InputField path='person.payment' obj={fields.agency} disabled={disabled}/>
                  </FieldDiv>
                  <FormButton nextValue={tabs[1]} {...formButtonProps} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[1]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <FieldDiv>
                    <InputField path='person.info.tax_address' obj={fields.cep} autofill={fillCepFields} customClass={'grow-0 min-w-36'} disabled={disabled} />
                    <InputField path='person.info.tax_address' obj={fields.address} customClass={'grow'} disabled={disabled} />
                    <InputField path='person.info.tax_address' obj={fields.number} customClass={'grow-0 min-w-36'} disabled={disabled} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.info.tax_address' obj={enumFields.state} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} state='reset' disabled={disabled} />
                    <SearchField path='person.info.tax_address' obj={enumFields.city} hint={'Ex. Brasília'} state={form.watch('person.info.tax_address.state')} customClass={'grow-0 min-w-44'} disabled={disabled} />
                    <InputField obj={fields.complement} customClass={'grow'} disabled={disabled} />
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                {disabled ? <TinyTable title='' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} />
                  : <EditTinyTable title='' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(createDefaultArray(contactFields))} remove={contactForm.remove} prefix='person.contact' order={["name", "detail", "phone", "telephone"]} />}
                  <FormButton backValue={tabs[0]} {...formButtonProps} submit={!show} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

