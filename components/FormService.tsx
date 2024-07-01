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
import { InputField, SearchField, SelectField } from "./AllFields";
import { serviceFisicalFields, serviceJuridicalFields, fields, enumFields, contactFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { ConfirmAlert, DeleteAlert } from "@/components/AllAlerts";
import FormButton from '@/components/FormButton';
import { fillCepFields, formatFields, createDefaultArray } from "@/lib/utils";
import { useFormActions } from "@/lib/hooks";

const [fisicalDefaultValues, fisicalFieldValidations] = formatFields(serviceFisicalFields);

const [juridicalDefaultValues, juridicalFieldValidations] = formatFields(serviceJuridicalFields);

const defaultValues = { ...juridicalDefaultValues, person: { ...juridicalDefaultValues.person, info: { ...juridicalDefaultValues.person.info, ...fisicalDefaultValues.person.info } } }

export default function FormService({ data, show }: { data?: any, show?: boolean }) {
  const tabs = ['PRESTADOR DE SERVIÇOS', 'CONTATO E ENDEREÇO'];

  const [personType, setPersonType] = useState<'Física' | 'Jurídica'>('Física');

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
    conflicts
  } = useFormActions(form, data, 'service', checkPaths);

  return (
    <Tabs className='bg-secondary/20' defaultValue={tabs[0]}>
      <div className='flex'>
        <TabsList className={`${show ? 'h-8' : 'h-9'}`}>
          {tabs.map((tab) => 
            <TabsTrigger key={tab} className={`${show ? 'text-sm' : 'text-base'}`} value={tab}>{tab}</TabsTrigger>
          )}
        </TabsList>
        {show &&
          <div className='flex grow justify-end'>
            <DeleteAlert submit={() => deleteSubmit()} />
          </div>
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
                    <InputField obj={fields.service} form={form} disabled={show && !isEditing} />
                    <RadioGroup className='flex-col p-0 border-0 gap-1 grow items-stretch max-w-56' defaultValue={personType}>
                      <Label>TIPO DE PESSOA</Label>
                      <div className="flex gap-1 grow">
                        <RadioGroupItem label="Física" value="Física" disabled={show && !isEditing}
                          className={`data-[state=unchecked]:disabled:hover:bg-secondary transition-colors disabled:cursor-default disabled:opacity-100 w-full`}
                          onClick={() => { setPersonType('Física'); form.reset()} } />
                        <RadioGroupItem label="Jurídica" value="Jurídica" disabled={show && !isEditing}
                          className={`data-[state=unchecked]:disabled:hover:bg-secondary transition-colors disabled:cursor-default disabled:opacity-100 w-full`}
                          onClick={() => { setPersonType('Jurídica'); form.reset()} }  />
                      </div>
                    </RadioGroup>
                  </FieldDiv>
                  <FieldDiv>
                  {personType === 'Jurídica' ?
                    <>
                      <InputField path='person.info' obj={fields.company_name} form={form} disabled={show && !isEditing} />
                      <InputField path='person.info' obj={fields.fantasy_name} form={form} disabled={show && !isEditing} />
                    </> :
                    <>
                      <InputField path='person.info' obj={fields.name} form={form} disabled={show && !isEditing} />
                      <InputField path='person.info' obj={fields.surname} form={form} disabled={show && !isEditing} />
                    </>}
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.info' obj={fields.info_email} form={form} disabled={show && !isEditing} />
                    {personType === 'Jurídica' ?
                    <>
                      <InputField path='person.info' obj={fields.cnpj} form={form} disabled={show && !isEditing} />
                    </> :
                    <>
                      <InputField path='person.info' obj={fields.rg} form={form} disabled={show && !isEditing} customClass={'grow-0 min-w-40'} />
                      <InputField path='person.info' obj={fields.cpf} form={form} disabled={show && !isEditing} customClass={'grow-0 min-w-44'} />
                    </>}
                  </FieldDiv>
                  <FieldDiv>
                    {personType === 'Jurídica' &&
                    <>
                      <SelectField path='person.info' obj={enumFields.tax_payer} form={form} disabled={show && !isEditing} />
                      <InputField path='person.info' obj={fields.state_register} form={form} disabled={show && !isEditing} />
                      <InputField path='person.info' obj={fields.municipal_register} form={form} disabled={show && !isEditing} />
                    </>}
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <InputField path='person' obj={fields.observations} form={form} long disabled={show && !isEditing} />
                  <FieldDiv>
                    <SearchField path='person.payment' obj={enumFields.bank} form={form} hint={'Ex. Bradesco'} customClass={'overflow-hidden text-ellipsis'} disabled={show && !isEditing} />
                    <InputField path='person.payment' obj={fields.pix} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.payment' obj={fields.account} form={form} disabled={show && !isEditing} />
                    <InputField path='person.payment' obj={fields.agency} form={form} disabled={show && !isEditing}/>
                  </FieldDiv>
                  <FormButton nextValue={tabs[1]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={data ? () => form.reset(data) : undefined} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[1]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <FieldDiv>
                    <InputField path='person.info.tax_address' obj={fields.cep} autofill={fillCepFields} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing} />
                    <InputField path='person.info.tax_address' obj={fields.address} form={form} customClass={'grow'} disabled={show && !isEditing} />
                    <InputField path='person.info.tax_address' obj={fields.number} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.info.tax_address' obj={enumFields.state} form={form} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} state='reset' disabled={show && !isEditing} />
                    <SearchField path='person.info.tax_address' obj={enumFields.city} form={form} hint={'Ex. Brasília'} state={form.watch('person.info.tax_address.state')} customClass={'grow-0 min-w-44'} disabled={show && !isEditing} />
                    <InputField obj={fields.complement} form={form} customClass={'grow'} disabled={show && !isEditing} />
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                {show && !isEditing ? <TinyTable title='' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} />
                  : <EditTinyTable title='' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(createDefaultArray(contactFields))} remove={contactForm.remove} prefix='person.contact' form={form} order={["name", "detail", "phone", "telephone"]} />}
                  <FormButton backValue={tabs[0]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={data ? () => form.reset(data) : undefined} submit/>
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

