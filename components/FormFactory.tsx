'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { EditTinyTable, TinyTable } from "@/components/TinyTable";
import { InputField, SearchField, SelectField, ShowField, RadioField } from "./AllFields";
import { fields, tableFields, enumFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { useEffect } from 'react';
import FormButton from '@/components/FormButton';
import { documentExists } from '@/lib/dbRead';
import { addFactory } from '@/lib/dbWrite';

// Default values for the fields

const defaultValues: {[key: string] : (string | {[key: string] : string}[])} = Object.values(fields).map((field) => { return field.value }).reduce((acc, key) => ({ ...acc, [key]: '' }), {});

// Add default values for contact table

const tableDefaultValues = Object.values(tableFields).map((field) => { return field.value }).reduce((acc, key) => ({ ...acc, [key]: undefined }), {});

// Get all of the validations from fields and assign them as "value":"validation"

const fieldsVerification = Object.assign({}, ...Object.values(fields).map((e) => {
  const obj: { [key: string]: z.ZodType<any, any> } = {};
  obj[e.value] = e.validation;
  return obj;
}));

const tableFieldsVerification = Object.assign({}, ...tableFields.map((e) => {
  const obj: { [key: string]: z.ZodType<any, any> } = {};
  obj[e.value] = e.validation;
  return obj;
}));

const enumFieldsVerification = Object.assign({}, ...Object.values(enumFields).map((e) => {
  const obj: { [key: string]: z.ZodType<any, any> } = {};
  obj[e.value] = e.validation;
  return obj;
}));

// Join validations together to make the object of schema validation

const formSchema = z.object({ ...fieldsVerification, contact: z.array(z.object(tableFieldsVerification)), ...enumFieldsVerification});

export default function FormFactory() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    shouldFocusError: false,
  })
  const tableForm = useFieldArray({
    control: form.control,
    name: 'contact',
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if values already exists
    const check = {
      person: [
        {
          query: 'info.email',
          value: values.info_email
        },
      ],
    }

    if (await documentExists(check)) {
      toast({
        variant: 'destructive',
        title: "Esta fábrica já existe",
      })
      throw new Error("Document exists");
      
    } else {
      toast({
        title: "Fábrica adicionada com sucesso!",
      })
      console.log(values);
      await addFactory(values)
    }
  }

  const [selectedState, setSelectedState] = useState('');

  // useEffect(() => {
  //   console.log(`submited: ${form.formState.isLoading}, submitsuccess: ${form.formState.isSubmitSuccessful}, submitting: ${form.formState.isSubmitting}`)
  // })

  return (
    <Tabs>
      <TabsList className='h-9'>
        <TabsTrigger className="text-base" value="factory">FÁBRICAS</TabsTrigger>
        <TabsTrigger className="text-base" value="representative">REPRESENTAÇÃO</TabsTrigger>
        <TabsTrigger className="text-base"  value="other">OUTRAS INFORMAÇÕES</TabsTrigger>
      </TabsList>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TabsContent value="factory">
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.name} form={form}/>
                    <InputField obj={fields.fantasy_name} form={form} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField obj={fields.info_email} form={form} />
                    <InputField obj={fields.cnpj} form={form} />
                  </FieldDiv>
                  <FieldDiv>
                    <SelectField obj={fields.tax_payer} form={form} />
                    <InputField obj={fields.state_register} form={form} />
                    <InputField obj={fields.municipal_register} form={form} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField obj={fields.pix} form={form} />
                    <InputField obj={fields.account} form={form} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField obj={fields.agency} form={form} customClass={'grow-0 min-w-32'}/>
                    <InputField obj={fields.bank} form={form} customClass={'grow'}/>
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.cep} form={form} customClass={'grow-0 min-w-36'}/>
                    <InputField obj={fields.address} form={form} customClass={'grow'}/>
                    <InputField obj={fields.number} form={form} customClass={'grow-0 min-w-36'} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField obj={fields.state} form={form} hint={'Ex. DF'} onSelect={setSelectedState} customClass={'grow-0 min-w-44'}/>
                    <SearchField obj={fields.city} form={form} hint={'Ex. Brasília'} unlock={selectedState} customClass={'grow-0 min-w-44'}/>
                    <InputField obj={fields.complement} form={form} customClass={'grow'}/>
                  </FieldDiv>
                  <div>
                    <EditTinyTable title='CONTATOS DA FÁBRICA' columns={tableFields} rows={tableForm.fields} append={() => tableForm.append(tableDefaultValues)} remove={tableForm.remove} edit='contact' form={form}/>
                  </div>
                  <FormButton nextValue='representative'/>
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value="representative">
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <SearchField customClass={'grow-0'} obj={fields.representative} form={form} hint={'Ex. Punto'} />
                  <ShowField text={''} label={'EMAIL DA REPRESENTAÇÃO'} placeholder={'Selecione uma Representação'} />
                </FormDiv>
                <FormDiv>
                  <TinyTable title='CONTATOS DA REPRESENTAÇÃO' columns={tableFields} placeholder='Selecione uma Representação' />
                  <FormButton backValue='factory' nextValue='other'/>
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value="other">
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <RadioField obj={enumFields.pricing} form={form} />
                  <RadioField obj={enumFields.style} form={form} />
                  <RadioField obj={enumFields.ambient} form={form} />
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.discount} form={form} percent />
                    <InputField obj={fields.direct_sale} form={form} percent />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField obj={fields.observations} form={form} />
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <InputField obj={fields.link_catalog} form={form} />
                  <InputField obj={fields.link_table} form={form} />
                  <InputField obj={fields.link_site} form={form} />
                </FormDiv>
              </div>
              <FormButton backValue='representative' state={form.formState} submit />
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

