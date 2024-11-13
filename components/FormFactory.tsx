'use client'

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { EditTinyTable, TinyTable } from "@/components/TinyTable";
import { InputField, RadioField, SearchField, ShowField, SelectField, ReferenceField } from "./AllFields";
import { factoryFields, fields, enumFields, contactFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { ConfirmAlert, DeleteAlert } from "@/components/AllPopups";
import FormButton from '@/components/FormButton';
import { fillCepFields, formatFields, createDefaultArray } from "@/lib/utils";
import useEntityFormActions from "@/hooks/useEntityFormActions";
import { RepresentativeT } from "@/lib/types";

const [defaultValues, fieldValidations] = formatFields(factoryFields);

const tabs = ['FÁBRICAS', 'REPRESENTAÇÃO', 'OUTRAS INFORMAÇÕES'];

export default function FormFactory({ data, show }: { data?: any, show?: boolean }) {

  const [referenceInfo, setReferenceInfo] = useState<RepresentativeT | undefined>(undefined);
  const [directSale, setDirectSale] = useState<boolean>(data ? typeof data.direct_sale === 'number' ? true : false : false);

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
  
  const overrideFunction = () => {
    if (data.representative) {
      setReferenceInfo(data.representative);
      form.setValue('representative', data.representative.id)
    }
    if (data.discount) {
      form.setValue('discount', (data.discount * 100).toString())
    }
    if (data.direct_sale) {
      form.setValue('direct_sale', (data.direct_sale * 100).toString())
    }
  }

  const {
    addSubmit,
    editSubmit,
    deleteSubmit,
    isEditing,
    setIsEditing,
    popupOpen,
    setPopupOpen,
    conflicts 
  } = useEntityFormActions(form, data, 'factory', checkPaths, 'representative', overrideFunction);

  const formButtonProps = {
    setIsEditing,
    isEditing: show ? isEditing : undefined,
    undoForm: data ? () => {overrideFunction(); form.reset(data)} : undefined,
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
                    <InputField path='person.info' obj={fields.company_name}  disabled={disabled} />
                    <InputField path='person.info' obj={fields.fantasy_name}  disabled={disabled} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.info' obj={fields.info_email} disabled={disabled} />
                    <InputField path='person.info' obj={fields.cnpj} disabled={disabled} />
                  </FieldDiv>
                  <FieldDiv>
                    <SelectField path='person.info' obj={enumFields.tax_payer} disabled={disabled} />
                    <InputField path='person.info' obj={fields.state_register} disabled={disabled} />
                    <InputField path='person.info' obj={fields.municipal_register} disabled={disabled} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.payment' obj={enumFields.bank} hint={'Ex. Bradesco'} customClass={'overflow-hidden text-ellipsis'} disabled={disabled} />
                    <InputField path='person.payment' obj={fields.pix} disabled={disabled} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.payment' obj={fields.account} disabled={disabled} />
                    <InputField path='person.payment' obj={fields.agency} disabled={disabled}/>
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField path='person.info.tax_address' obj={fields.cep} autofill={fillCepFields} customClass={'grow-0 min-w-36'} disabled={disabled}/>
                    <InputField path='person.info.tax_address' obj={fields.address} customClass={'grow'} disabled={disabled}/>
                    <InputField path='person.info.tax_address' obj={fields.number} customClass={'grow-0 min-w-36'} disabled={disabled}/>
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.info.tax_address' obj={enumFields.state} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} state={'reset'} disabled={disabled} />
                    <SearchField path='person.info.tax_address' obj={enumFields.city} hint={'Ex. Brasília'} state={form.watch('person.info.tax_address.state')} customClass={'grow-0 min-w-44'} disabled={disabled} />
                    <InputField path='person.info.tax_address' obj={fields.complement} customClass={'grow'} disabled={disabled}/>
                  </FieldDiv>
                  <div>
                    {disabled ? <TinyTable title='' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} />
                    : <EditTinyTable title='' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(createDefaultArray(contactFields))} remove={contactForm.remove} prefix='person.contact' order={["name", "detail", "phone", "telephone"]} /> }
                  </div>
                  <FormButton nextValue={tabs[1]} {...formButtonProps} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[1]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <ReferenceField customClass={'grow-0'} obj={fields.representative} refPath='representative' onSelect={(e: RepresentativeT) => setReferenceInfo(e)} hint={'Ex. Punto'} disabled={disabled} person />
                  <ShowField text={referenceInfo ? referenceInfo.person.info.info_email : ''} label={'EMAIL DA REPRESENTAÇÃO'} placeholder={'Selecione uma Representação'} />
                </FormDiv>
                <FormDiv>
                  <TinyTable title='CONTATOS DA REPRESENTAÇÃO' columns={contactFields} rows={referenceInfo ? referenceInfo.person.contact : []} placeholder={referenceInfo ? 'Sem contatos' : 'Selecione uma Representação'} order={["name", "detail", "phone", "telephone"]} /> 
                  <FormButton backValue={tabs[0]} nextValue={tabs[2]} {...formButtonProps} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[2]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <RadioField obj={enumFields.pricing} defaultValue={form.watch('pricing')} disabled={disabled}/>
                  <RadioField obj={enumFields.style} defaultValue={form.watch('style')} optional disabled={disabled}/>
                  <RadioField obj={enumFields.ambient} defaultValue={form.watch('ambient')} disabled={disabled}/>
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.discount} percent disabled={disabled} />
                    <RadioGroup className='flex-col p-0 border-0 gap-1 grow items-stretch' defaultValue={directSale ? 'Sim' : 'Não'}>
                      <Label>VENDA DIRETA?</Label>
                      <div className="flex gap-1 grow">
                        <RadioGroupItem value='Sim' label='Sim' disabled={disabled}
                          className={`data-[state=unchecked]:disabled:hover:bg-secondary transition-colors disabled:cursor-default disabled:opacity-100 w-full`}
                          onClick={() => { setDirectSale(true); form.setValue('direct_sale','0') }} />
                        <RadioGroupItem value="Não" label="Não" disabled={disabled}
                          className={`data-[state=unchecked]:disabled:hover:bg-secondary transition-colors disabled:cursor-default disabled:opacity-100 w-full`}
                          onClick={() => { setDirectSale(false); form.setValue('direct_sale','') }} />
                      </div>
                    </RadioGroup>
                    <InputField obj={fields.direct_sale} percent disabled={disabled || !directSale} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person' obj={fields.observations} long disabled={disabled}/>
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <InputField obj={fields.link_catalog} disabled={disabled} />
                  <InputField obj={fields.link_table} disabled={disabled} />
                  <InputField obj={fields.link_site} disabled={disabled} />
                </FormDiv>
              </div>
              <FormButton backValue={tabs[1]} {...formButtonProps} submit={!show} />
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

