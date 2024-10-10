'use client'

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from 'react';
import OrderFields from "@/components/OrderFields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { EditTinyTable, TinyTable } from "@/components/TinyTable";
import { InputField, SearchField, ShowField, SelectField, ReferenceField } from "@/components/AllFields";
import { clientFisicalFields, clientJuridicalFields, fields, enumFields, contactFields, orderFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { ConfirmAlert, DeleteAlert } from "@/components/AllPopups";
import FormButton from '@/components/FormButton';
import { fillCepFields, formatFields, createDefaultArray } from "@/lib/utils";
import useEntityFormActions from "@/hooks/useEntityFormActions";
import { OfficeT } from "@/lib/types";

const [fisicalDefaultValues, fisicalFieldValidations] = formatFields(clientFisicalFields);

const [juridicalDefaultValues, juridicalFieldValidations] = formatFields(clientJuridicalFields);

const defaultValues = {...juridicalDefaultValues, person: { ...juridicalDefaultValues.person, info: { ...juridicalDefaultValues.person.info, ...fisicalDefaultValues.person.info } } }

export default function FormClient({ data, show }: { data?: any, show?: boolean }) {
  const tabs = ['CLIENTE', 'CONTATO','ENDEREÇO', 'PEDIDOS', 'OUTRAS INFORMAÇÕES'];

  const [referenceInfo, setReferenceInfo] = useState<ReferenceT | undefined>(undefined);
  const [sameAddress, setSameAddress] = useState<boolean>(false);
  const [personType, setPersonType] = useState<'Física' | 'Jurídica'>(() => data ? data.person.info.cnpj === undefined ? 'Física' : 'Jurídica' : 'Física' );

  const form = useForm<z.infer<typeof fisicalFieldValidations> | z.infer<typeof juridicalFieldValidations>>({
    resolver: zodResolver(personType === 'Física' ? fisicalFieldValidations : juridicalFieldValidations),
    defaultValues,
    shouldFocusError: false,
  })

  const contactForm = useFieldArray({
    control: form.control,
    name: 'person.contact',
  });

  const orderForm = useFieldArray({
    control: form.control,
    name: 'order',
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
  } = useEntityFormActions(form, data, 'client', checkPaths, 'office');

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
                      <InputField path='person.info' obj={fields.rg} form={form} disabled={show && !isEditing} customClass={'grow-0 min-w-40'}/>
                      <InputField path='person.info' obj={fields.cpf} form={form} disabled={show && !isEditing} customClass={'grow-0 min-w-44'}/>
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
              {show && !isEditing ? <TinyTable title='' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} />
                : <EditTinyTable title='' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(createDefaultArray(contactFields))} remove={contactForm.remove} prefix='person.contact' form={form} order={["name", "detail", "phone", "telephone"]} />}
              <FormButton backValue={tabs[0]} state={form.formState} nextValue={tabs[2]} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={data ? () => form.reset(data) : undefined} />
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[2]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <Label className='text-base'>ENDEREÇO FISCAL</Label>
                  <FieldDiv>
                    <InputField path='person.info.tax_address' obj={fields.cep} autofill={fillCepFields} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing} />
                    <InputField path='person.info.tax_address' obj={fields.address} form={form} customClass={'grow'} disabled={show && !isEditing} />
                    <InputField path='person.info.tax_address' obj={fields.number} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.info.tax_address' obj={enumFields.state} form={form} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} state={'reset'} disabled={show && !isEditing} />
                    <SearchField path='person.info.tax_address' obj={enumFields.city} form={form} hint={'Ex. Brasília'} state={form.watch('person.info.tax_address.state')} customClass={'grow-0 min-w-44'} disabled={show && !isEditing} />
                    <InputField path='person.info.tax_address' obj={fields.complement} form={form} customClass={'grow'} disabled={show && !isEditing} />
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <div className='flex justify-between'>
                    <Label className='text-base'>ENDEREÇO DE ENTREGA</Label>
                    <RadioGroup className='items-center p-0 border-0' defaultValue="Não">
                      <Label className=''>IGUAL ENDEREÇO FISCAL?</Label>
                      <div className="flex items-center gap-1">
                        <RadioGroupItem value="Sim" label="Sim" disabled={show && !isEditing} onClick={() => {form.resetField('person.info.shipping_address'); setSameAddress(true)}}
                        className={`data-[state=unchecked]:disabled:hover:bg-secondary disabled:cursor-default disabled:opacity-100`} />
                        <RadioGroupItem value="Não" label="Não" disabled={show && !isEditing} onClick={() => setSameAddress(false)}
                        className={`data-[state=unchecked]:disabled:hover:bg-secondary disabled:cursor-default disabled:opacity-100`} />
                      </div>
                    </RadioGroup>
                  </div>
                  <FieldDiv>
                    <InputField path='person.info.shipping_address' obj={fields.cep} autofill={fillCepFields} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing || sameAddress} />
                    <InputField path='person.info.shipping_address' obj={fields.address} form={form} customClass={'grow'} disabled={show && !isEditing || sameAddress} />
                    <InputField path='person.info.shipping_address' obj={fields.number} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing || sameAddress} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.info.shipping_address' obj={enumFields.state} form={form} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} state={'reset'} disabled={show && !isEditing || sameAddress} />
                    <SearchField path='person.info.shipping_address' obj={enumFields.city} form={form} hint={'Ex. Brasília'} state={form.watch('person.info.shipping_address.state')} customClass={'grow-0 min-w-44'} disabled={show && !isEditing || sameAddress} />
                    <InputField path='person.info.shipping_address' obj={fields.complement} form={form} customClass={'grow'} disabled={show && !isEditing || sameAddress} />
                  </FieldDiv>
                  <FormButton backValue={tabs[1]} state={form.formState} nextValue={tabs[3]} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={data ? () => form.reset(data) : undefined} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[3]}>
            <TabDiv>
              <OrderFields title='' form={form} rows={orderForm.fields} append={() => orderForm.append(createDefaultArray(orderFields))} remove={orderForm.remove} update={orderForm.update} prefix={'order'} disabled={show && !isEditing} />
              <FormButton backValue={tabs[2]} state={form.formState} nextValue={tabs[4]} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={data ? () => form.reset(data) : undefined} />
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[4]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <FieldDiv>
                    <ReferenceField obj={fields.office} refPath='office' onSelect={(e: OfficeT) => setReferenceInfo(e)} form={form} hint={'Ex. Punto'} disabled={show && !isEditing} person />
                    <ShowField text={referenceInfo ? referenceInfo.ref : ''} label={'TEST'} placeholder={'Selecione um Escritório'} />
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField path='person' obj={fields.observations} form={form} long disabled={show && !isEditing} />
                  </FieldDiv>
                  <FormButton backValue={tabs[3]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={data ? () => form.reset(data) : undefined} submit={!show} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

