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
import { InputField, RadioField, SearchField, ShowField, SelectField, ReferenceField } from "./AllFields";
import { factoryFields, fields, enumFields, contactFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { ConfirmAlert, DeleteAlert } from "@/components/AllAlerts";
import FormButton from '@/components/FormButton';
import { fillCepFields, formatFields, createDefaultArray } from "@/lib/utils";
import { useFormActions } from "@/lib/hooks";
import { ReferenceT } from "@/lib/types";

const [defaultValues, fieldValidations] = formatFields(factoryFields);

export default function FormFactory({ data, show }: { data?: any, show?: boolean }) {
  const tabs = ['FÁBRICAS', 'REPRESENTAÇÃO', 'OUTRAS INFORMAÇÕES'];

  const [referenceInfo, setReferenceInfo] = useState<ReferenceT | undefined>(undefined);
  const [directSale, setDirectSale] = useState<boolean>(false);

  const form = useForm<z.infer<typeof fieldValidations>>({
    resolver: zodResolver(fieldValidations),
    defaultValues,
    shouldFocusError: false,
  })
  
  const contactForm = useFieldArray({
    control: form.control,
    name: 'person.contact',
  });

  const checkPaths = [['person', 'info', 'fantasy_name'], ['person', 'info', 'company_name'], ['person', 'info', 'cnpj'], ['person', 'info', 'info_email']]
  
  const {
    addSubmit,
    editSubmit,
    deleteSubmit,
    isEditing,
    setIsEditing,
    popupOpen,
    setPopupOpen,
    conflicts 
  } = useFormActions(form, data, 'factory', checkPaths, 'representative');

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
                    <InputField path='person.info' obj={fields.company_name} form={form} disabled={show && !isEditing} />
                    <InputField path='person.info' obj={fields.fantasy_name} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.info' obj={fields.info_email} form={form} disabled={show && !isEditing} />
                    <InputField path='person.info' obj={fields.cnpj} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <SelectField path='person.info' obj={enumFields.tax_payer} form={form} disabled={show && !isEditing} />
                    <InputField path='person.info' obj={fields.state_register} form={form} disabled={show && !isEditing} />
                    <InputField path='person.info' obj={fields.municipal_register} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.payment' obj={enumFields.bank} form={form} hint={'Ex. Bradesco'} customClass={'overflow-hidden text-ellipsis'} disabled={show && !isEditing} />
                    <InputField path='person.payment' obj={fields.pix} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.payment' obj={fields.account} form={form} disabled={show && !isEditing} />
                    <InputField path='person.payment' obj={fields.agency} form={form} disabled={show && !isEditing}/>
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField path='person.info.tax_address' obj={fields.cep} autofill={fillCepFields} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing}/>
                    <InputField path='person.info.tax_address' obj={fields.address} form={form} customClass={'grow'} disabled={show && !isEditing}/>
                    <InputField path='person.info.tax_address' obj={fields.number} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing}/>
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.info.tax_address' obj={enumFields.state} form={form} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} state={'reset'} disabled={show && !isEditing} />
                    <SearchField path='person.info.tax_address' obj={enumFields.city} form={form} hint={'Ex. Brasília'} state={form.watch('person.info.tax_address.state')} customClass={'grow-0 min-w-44'} disabled={show && !isEditing} />
                    <InputField path='person.info.tax_address' obj={fields.complement} form={form} customClass={'grow'} disabled={show && !isEditing}/>
                  </FieldDiv>
                  <div>
                    {show && !isEditing ? <TinyTable title='' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} />
                    : <EditTinyTable title='' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(createDefaultArray(contactFields))} remove={contactForm.remove} prefix='person.contact' form={form} order={["name", "detail", "phone", "telephone"]} /> }
                  </div>
                  <FormButton nextValue={tabs[1]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={data ? () => form.reset(data) : undefined} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[1]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <ReferenceField customClass={'grow-0'} obj={fields.representative} form={form} hint={'Ex. Punto'} setReferenceInfo={setReferenceInfo} disabled={show && !isEditing} />
                  <ShowField text={referenceInfo ? referenceInfo.info_email : ''} label={'EMAIL DA REPRESENTAÇÃO'} placeholder={'Selecione uma Representação'} />
                </FormDiv>
                <FormDiv>
                  <TinyTable title='CONTATOS DA REPRESENTAÇÃO' columns={contactFields} rows={referenceInfo ? referenceInfo.contact : []} placeholder={referenceInfo ? 'Sem contatos' : 'Selecione uma Representação'} order={["name", "detail", "phone", "telephone"]} /> 
                  <FormButton backValue={tabs[0]} state={form.formState} nextValue={tabs[2]} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={data ? () => form.reset(data) : undefined} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[2]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <RadioField obj={enumFields.pricing} form={form} defaultValue={form.watch('pricing')} disabled={show && !isEditing}/>
                  <RadioField obj={enumFields.style} form={form} defaultValue={form.watch('style')} optional disabled={show && !isEditing}/>
                  <RadioField obj={enumFields.ambient} form={form} defaultValue={form.watch('ambient')} disabled={show && !isEditing}/>
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.discount} form={form} percent disabled={show && !isEditing} />
                    <RadioGroup className='flex-col p-0 border-0 gap-1 grow items-stretch' defaultValue={directSale ? 'Sim' : 'Não'}>
                      <Label>VENDA DIRETA?</Label>
                      <div className="flex gap-1 grow">
                        <RadioGroupItem value='Sim' label='Sim' disabled={show && !isEditing}
                          className={`data-[state=unchecked]:disabled:hover:bg-secondary transition-colors disabled:cursor-default disabled:opacity-100 w-full`}
                          onClick={() => { setDirectSale(true) }} />
                        <RadioGroupItem value="Não" label="Não" disabled={show && !isEditing}
                          className={`data-[state=unchecked]:disabled:hover:bg-secondary transition-colors disabled:cursor-default disabled:opacity-100 w-full`}
                          onClick={() => { setDirectSale(false) }} />
                      </div>
                    </RadioGroup>
                    <InputField obj={fields.direct_sale} form={form} percent disabled={show && !isEditing || !directSale} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person' obj={fields.observations} form={form} long disabled={show && !isEditing}/>
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <InputField obj={fields.link_catalog} form={form} disabled={show && !isEditing} />
                  <InputField obj={fields.link_table} form={form} disabled={show && !isEditing} />
                  <InputField obj={fields.link_site} form={form} disabled={show && !isEditing} />
                </FormDiv>
              </div>
              <FormButton backValue={tabs[1]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={data ? () => form.reset(data) : undefined} submit={!show} />
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

