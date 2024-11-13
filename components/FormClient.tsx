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
import { InputField, SearchField, ShowField, SelectField, ReferenceField, PersonTypeRadio } from "@/components/AllFields";
import { clientFisicalFields, clientJuridicalFields, fields, enumFields, contactFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { ConfirmAlert, DeleteAlert } from "@/components/AllPopups";
import FormButton from '@/components/FormButton';
import { fillCepFields, formatFields, createDefaultArray } from "@/lib/utils";
import useEntityFormActions from "@/hooks/useEntityFormActions";
import { OfficeT } from "@/lib/types";

const [fisicalDefaultValues, fisicalFieldValidations] = formatFields(clientFisicalFields);

const [juridicalDefaultValues, juridicalFieldValidations] = formatFields(clientJuridicalFields);

const defaultValues = {...juridicalDefaultValues, person: { ...juridicalDefaultValues.person, info: { ...juridicalDefaultValues.person.info, ...fisicalDefaultValues.person.info } } }

const tabs = ['CLIENTE', 'CONTATO','ENDEREÇO', 'OUTRAS INFORMAÇÕES'];

export default function FormClient({ data, show }: { data?: any, show?: boolean }) {
  const initialPersonType = data ? data.person.info.cnpj === undefined ? 'Física' : 'Jurídica' : 'Física'

  const [referenceInfo, setReferenceInfo] = useState<OfficeT | undefined>(undefined);
  const [sameAddress, setSameAddress] = useState<boolean>(false);
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

  const overrideFunction = () => {
    if (data.office) {
      setReferenceInfo(data.office);
      form.setValue('office', data.office.id)
    }
    setPersonType(initialPersonType)
  }

  const {
    addSubmit,
    editSubmit,
    deleteSubmit,
    isEditing,
    setIsEditing,
    popupOpen,
    setPopupOpen,
    conflicts,
  } = useEntityFormActions(form, data, 'client', checkPaths, 'office', overrideFunction);

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
                    <PersonTypeRadio defaultValue={personType} disabled={disabled} setPersonType={data ? (val) => { setPersonType(val); form.reset(data)} : (val) => {setPersonType(val); form.reset()}} />
                    {personType === 'Jurídica' ?
                    <>
                      <InputField path='person.info' obj={fields.company_name} disabled={disabled} />
                      <InputField path='person.info' obj={fields.fantasy_name} disabled={disabled} />
                    </> : 
                    <>
                      <InputField path='person.info' obj={fields.name} disabled={disabled} />
                      <InputField path='person.info' obj={fields.surname} disabled={disabled} />
                    </>}
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.info' obj={fields.info_email} disabled={disabled} />
                    {personType === 'Jurídica' ?
                    <>
                      <InputField path='person.info' obj={fields.cnpj} disabled={disabled} />
                    </> : 
                    <>
                      <InputField path='person.info' obj={fields.rg} disabled={disabled} customClass={'grow-0 min-w-40'}/>
                      <InputField path='person.info' obj={fields.cpf} disabled={disabled} customClass={'grow-0 min-w-44'}/>
                    </>}
                  </FieldDiv>
                  <FieldDiv>
                    {personType === 'Jurídica' &&
                    <>
                      <SelectField path='person.info' obj={enumFields.tax_payer} disabled={disabled} />
                      <InputField path='person.info' obj={fields.state_register} disabled={disabled} />
                      <InputField path='person.info' obj={fields.municipal_register} disabled={disabled} />
                    </>}
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
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
              {disabled ? <TinyTable title='' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} />
                : <EditTinyTable title='' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(createDefaultArray(contactFields))} remove={contactForm.remove} prefix='person.contact' order={["name", "detail", "phone", "telephone"]} />}
              <FormButton backValue={tabs[0]} nextValue={tabs[2]} {...formButtonProps} />
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[2]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <Label className='text-base'>ENDEREÇO FISCAL</Label>
                  <FieldDiv>
                    <InputField path='person.info.tax_address' obj={fields.cep} autofill={fillCepFields} customClass={'grow-0 min-w-36'} disabled={disabled} />
                    <InputField path='person.info.tax_address' obj={fields.address} customClass={'grow'} disabled={disabled} />
                    <InputField path='person.info.tax_address' obj={fields.number} customClass={'grow-0 min-w-36'} disabled={disabled} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.info.tax_address' obj={enumFields.state} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} state={'reset'} disabled={disabled} />
                    <SearchField path='person.info.tax_address' obj={enumFields.city} hint={'Ex. Brasília'} state={form.watch('person.info.tax_address.state')} customClass={'grow-0 min-w-44'} disabled={disabled} />
                    <InputField path='person.info.tax_address' obj={fields.complement} customClass={'grow'} disabled={disabled} />
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <div className='flex justify-between'>
                    <Label className='text-base'>ENDEREÇO DE ENTREGA</Label>
                    <RadioGroup className='items-center p-0 border-0' defaultValue="Não">
                      <Label className=''>IGUAL ENDEREÇO FISCAL?</Label>
                      <div className="flex items-center gap-1">
                        <RadioGroupItem value="Sim" label="Sim" disabled={disabled} onClick={() => {form.resetField('person.info.shipping_address'); setSameAddress(true)}}
                        className={`data-[state=unchecked]:disabled:hover:bg-secondary disabled:cursor-default disabled:opacity-100`} />
                        <RadioGroupItem value="Não" label="Não" disabled={disabled} onClick={() => setSameAddress(false)}
                        className={`data-[state=unchecked]:disabled:hover:bg-secondary disabled:cursor-default disabled:opacity-100`} />
                      </div>
                    </RadioGroup>
                  </div>
                  <FieldDiv>
                    <InputField path='person.info.shipping_address' obj={fields.cep} autofill={fillCepFields} customClass={'grow-0 min-w-36'} disabled={disabled || sameAddress} />
                    <InputField path='person.info.shipping_address' obj={fields.address} customClass={'grow'} disabled={disabled || sameAddress} />
                    <InputField path='person.info.shipping_address' obj={fields.number} customClass={'grow-0 min-w-36'} disabled={disabled || sameAddress} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.info.shipping_address' obj={enumFields.state} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} state={'reset'} disabled={disabled || sameAddress} />
                    <SearchField path='person.info.shipping_address' obj={enumFields.city} hint={'Ex. Brasília'} state={form.watch('person.info.shipping_address.state')} customClass={'grow-0 min-w-44'} disabled={disabled || sameAddress} />
                    <InputField path='person.info.shipping_address' obj={fields.complement} customClass={'grow'} disabled={disabled || sameAddress} />
                  </FieldDiv>
                  <FormButton backValue={tabs[1]} nextValue={tabs[3]} {...formButtonProps} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[3]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <FieldDiv>
                    <ReferenceField obj={fields.office} refPath='office' onSelect={(e: OfficeT) => setReferenceInfo(e)} hint={'Ex. Punto'} disabled={disabled} person />
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField path='person' obj={fields.observations} long disabled={disabled} />
                  </FieldDiv>
                  <FormButton backValue={tabs[2]} {...formButtonProps} submit={!show} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

