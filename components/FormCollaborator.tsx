'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { EditTinyTable, TinyTable } from "@/components/TinyTable";
import { InputField, SearchField } from "./AllFields";
import { collaboratorFields, contactFields, fields, enumFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { ConfirmAlert, DeleteAlert } from "@/components/AllAlerts";
import FormButton from '@/components/FormButton';
import { fillCepFields, formatFields, createDefaultArray } from "@/lib/utils";
import { useFormActions } from "@/lib/hooks";

const [defaultValues, fieldValidations] = formatFields(collaboratorFields);

export default function FormCollaborator({ data, show }: { data?: any, show?: boolean }) {
  const tabs = ['COLABORADOR', 'CONTATO E ENDEREÇO'];

  const form = useForm<z.infer<typeof fieldValidations>>({
    resolver: zodResolver(fieldValidations),
    defaultValues,
    shouldFocusError: false,
  })
  
  const contactForm = useFieldArray({
    control: form.control,
    name: 'person.contact',
  });

  const checkPaths = [['person', 'info', 'rg'], ['person', 'info', 'cpf'], ['person', 'info', 'info_email']]
  
  const {
    addSubmit,
    editSubmit,
    deleteSubmit,
    isEditing,
    setIsEditing,
    popupOpen,
    setPopupOpen,
    conflicts 
  } = useFormActions(form, data, 'collaborator', checkPaths);

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
                    <InputField path='person.info' obj={fields.name} form={form} disabled={show && !isEditing} />
                    <InputField path='person.info' obj={fields.surname} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.info' obj={fields.info_email} form={form} disabled={show && !isEditing} />
                    <InputField path='person.info' obj={fields.rg} form={form} disabled={show && !isEditing} customClass={'grow-0 min-w-40'}/>
                    <InputField path='person.info' obj={fields.cpf} form={form} disabled={show && !isEditing} customClass={'grow-0 min-w-44'}/>
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.payment' obj={enumFields.bank} form={form} hint={'Ex. Bradesco'} customClass={'overflow-hidden text-ellipsis'} disabled={show && !isEditing} />
                    <InputField path='person.payment' obj={fields.pix} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.payment' obj={fields.account} form={form} disabled={show && !isEditing} />
                    <InputField path='person.payment' obj={fields.agency} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <InputField obj={fields.role} form={form} disabled={show && !isEditing} />
                  <InputField path='person' obj={fields.observations} form={form} long disabled={show && !isEditing} />
                  <FormButton nextValue={tabs[1]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={data ? () => form.reset(data) : undefined} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[1]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                {show && !isEditing ? <TinyTable title='' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} />
                  : <EditTinyTable title='' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(createDefaultArray(contactFields))} remove={contactForm.remove} prefix='person.contact' form={form} order={["name", "detail", "phone", "telephone"]} /> }
                </FormDiv>
                <FormDiv>
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
                  <FormButton backValue={tabs[0]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={data ? () => form.reset(data) : undefined} submit={!show} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

