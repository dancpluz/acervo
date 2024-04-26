'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { EditTinyTable, TinyTable } from "@/components/TinyTable";
import { FullField } from "./FullField";
import { fields, tableFields } from "@/lib/fields";
import { FormDiv, TabDiv } from "@/components/ui/div";

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

// Join validations together to make the object of schema validation

const formSchema = z.object({...fieldsVerification, contact: z.array(z.object(tableFieldsVerification))});

// Define the contact default values

// const defaultContact = Object.assign({}, ...tableFields.map((e) => {
//     const obj: { [key: string]: string } = {};
//     obj[e.value] = '';
//     return obj;
//   }))

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
  }

  const [selectedState, setSelectedState] = useState('');


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
                <div className='flex flex-1 flex-col gap-3'>
                  <FormDiv>
                    <FullField obj={fields.name} form={form}/>
                    <FullField obj={fields.fantasy_name} form={form} />
                  </FormDiv>
                  <FormDiv>
                    <FullField obj={fields.email} form={form} />
                    <FullField obj={fields.cnpj} form={form} />
                  </FormDiv>
                  <FormDiv>
                    <FullField obj={fields.tax_payer} form={form} select/>
                    <FullField obj={fields.state_register} form={form} />
                    <FullField obj={fields.municipal_register} form={form} />
                  </FormDiv>
                  <FormDiv>
                    <FullField obj={fields.pix} form={form} />
                    <FullField obj={fields.account} form={form} />
                  </FormDiv>
                  <FormDiv>
                    <FullField obj={fields.agency} form={form} customClass={'grow-0 min-w-32'}/>
                    <FullField obj={fields.bank} form={form} customClass={'grow'}/>
                  </FormDiv>
                </div>
                <div className='flex flex-1 flex-col gap-3'>
                  <FormDiv>
                    <FullField obj={fields.cep} form={form} customClass={'grow-0 min-w-36'}/>
                    <FullField obj={fields.address} form={form} customClass={'grow'}/>
                    <FullField obj={fields.number} form={form} customClass={'grow-0 min-w-36'} />
                  </FormDiv>
                  <FormDiv>
                    <FullField obj={fields.state} form={form} search onSelect={setSelectedState} customClass={'grow-0 min-w-44'}/>
                    <FullField obj={fields.city} form={form} search unlock={selectedState} customClass={'grow-0 min-w-44'}/>
                    <FullField obj={fields.complement} form={form} customClass={'grow'}/>
                  </FormDiv>
                  <div>
                    <EditTinyTable title='CONTATOS DA FÁBRICA' columns={tableFields} rows={tableForm.fields} append={() => tableForm.append(tableDefaultValues)} remove={tableForm.remove} edit='contact' form={form}/>
                  </div>
                </div>
              </div>
              <Button type="submit">Submit</Button>
            </TabDiv>
          </TabsContent>
          <TabsContent value="representative">
            <TabDiv>
              <div className='flex gap-8'>
                <div className='flex flex-1 flex-col gap-3'>
                  <FullField obj={fields.representative} form={form} search />
                  <FullField obj={fields.fantasy_name} form={form} />
                </div>
                <div className='flex flex-1'>
                  <TinyTable title='CONTATOS DA REPRESENTAÇÃO' columns={tableFields} placeholder='Selecione uma Representação' />
                </div>
              </div>
              <Button type="submit">Submit</Button>
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

