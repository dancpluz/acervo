'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { EditTinyTable, TinyTable } from "@/components/TinyTable";
import { InputField, SelectField, SearchField } from "./AllFields";
import { representativeFields, contactFields, teamFields, fields, enumFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { ConfirmAlert, DeleteAlert } from "@/components/AllPopups";
import FormButton from '@/components/FormButton';
import { fillCepFields, formatFields, createDefaultArray } from "@/lib/utils";
import useEntityFormActions from "@/hooks/useEntityFormActions";

const [defaultValues, fieldValidations] = formatFields(representativeFields);

const tabs = ['REPRESENTAÇÃO', 'CONTATO'];

export default function FormRepresentative({ data, show }: { data?: any, show?: boolean }) {

  const form = useForm<z.infer<typeof fieldValidations>>({
    resolver: zodResolver(fieldValidations),
    defaultValues,
    shouldFocusError: false,
  })

  const teamForm = useFieldArray({
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
  } = useEntityFormActions(form, data, 'representative', checkPaths);

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
                    <InputField path='person.info' obj={fields.company_name} disabled={disabled} />
                    <InputField path='person.info' obj={fields.fantasy_name} disabled={disabled} />
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
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField path='person.info.tax_address' obj={fields.cep} autofill={fillCepFields} customClass={'grow-0 min-w-36'} disabled={disabled} />
                    <InputField path='person.info.tax_address' obj={fields.address} customClass={'grow'} disabled={disabled} />
                    <InputField path='person.info.tax_address' obj={fields.number} customClass={'grow-0 min-w-36'} disabled={disabled} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField path='person.info.tax_address' obj={enumFields.state} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} state='reset' disabled={disabled} />
                    <SearchField path='person.info.tax_address' obj={enumFields.city} hint={'Ex. Brasília'} state={form.watch('person.info.tax_address.state')} customClass={'grow-0 min-w-44'} disabled={disabled} />
                    <InputField path='person.info.tax_address' obj={fields.complement} customClass={'grow'} disabled={disabled} />
                  </FieldDiv>
                  <FormButton nextValue={tabs[1]} {...formButtonProps} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[1]}>
            <TabDiv>
              {disabled ? <TinyTable title='' columns={teamFields} rows={teamForm.fields} placeholder={'Sem funcionários'} order={["name", "telephone", "phone", "email", "role", "detail"]} />
                : <EditTinyTable title='' columns={teamFields} rows={teamForm.fields} append={() => teamForm.append(createDefaultArray(teamFields))} remove={teamForm.remove} prefix='person.contact' order={["name", "telephone", "phone", "email", "role", "detail"]} />}
              <FormButton backValue={tabs[0]} {...formButtonProps} submit={!show} />
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

