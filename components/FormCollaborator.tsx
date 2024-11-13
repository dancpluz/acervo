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
import { ConfirmAlert, DeleteAlert } from "@/components/AllPopups";
import FormButton from '@/components/FormButton';
import { fillCepFields, formatFields, createDefaultArray } from "@/lib/utils";
import useEntityFormActions from "@/hooks/useEntityFormActions";

const [defaultValues, fieldValidations] = formatFields(collaboratorFields);

const tabs = ['COLABORADOR', 'CONTATO E ENDEREÇO'];

export default function FormCollaborator({ data, show }: { data?: any, show?: boolean }) {

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
  } = useEntityFormActions(form, data, 'collaborator', checkPaths);
  
  const formButtonProps = {
    setIsEditing,
    isEditing: show ? isEditing : undefined,
    undoForm: data ? () => form.reset(data) : undefined,
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
                    <InputField path='person.info' obj={fields.name} form={form} disabled={disabled} />
                    <InputField path='person.info' obj={fields.surname} form={form} disabled={disabled} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.info' obj={fields.info_email} form={form} disabled={disabled} />
                    <InputField path='person.info' obj={fields.rg} form={form} disabled={disabled} customClass={'grow-0 min-w-40'}/>
                    <InputField path='person.info' obj={fields.cpf} form={form} disabled={disabled} customClass={'grow-0 min-w-44'}/>
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.payment' obj={enumFields.bank} form={form} hint={'Ex. Bradesco'} customClass={'overflow-hidden text-ellipsis'} disabled={disabled} />
                    <InputField path='person.payment' obj={fields.pix} form={form} disabled={disabled} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField path='person.payment' obj={fields.account} form={form} disabled={disabled} />
                    <InputField path='person.payment' obj={fields.agency} form={form} disabled={disabled} />
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <InputField obj={fields.role} form={form} disabled={disabled} />
                  <InputField path='person' obj={fields.observations} form={form} long disabled={disabled} />
                  <FormButton nextValue={tabs[1]} {...formButtonProps} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[1]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                {disabled ? <TinyTable title='' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} />
                  : <EditTinyTable title='' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(createDefaultArray(contactFields))} remove={contactForm.remove} prefix='person.contact' form={form} order={["name", "detail", "phone", "telephone"]} /> }
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField path='person.info.tax_address' obj={fields.cep} autofill={fillCepFields} form={form} customClass={'grow-0 min-w-36'} disabled={disabled} />
                    <InputField path='person.info.tax_address' obj={fields.address} form={form} customClass={'grow'} disabled={disabled} />
                    <InputField path='person.info.tax_address' obj={fields.number} form={form} customClass={'grow-0 min-w-36'} disabled={disabled} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.info.tax_address' obj={enumFields.state} form={form} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} state={'reset'} disabled={disabled} />
                    <SearchField path='person.info.tax_address' obj={enumFields.city} form={form} hint={'Ex. Brasília'} state={form.watch('person.info.tax_address.state')} customClass={'grow-0 min-w-44'} disabled={disabled} />
                    <InputField path='person.info.tax_address' obj={fields.complement} form={form} customClass={'grow'} disabled={disabled} />
                  </FieldDiv>
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

