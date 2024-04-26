'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast";
import cidades from '@/lib/cidades.json';
import { useState } from "react";
import { EditTinyTable } from "@/components/TinyTable";
import { FullField } from "./FullField";


type Field = {
  [key: string]: {
    value: string;
    label: string;
    placeholder: string;
    validation: z.ZodType<any, any>;
    mask?: (string | RegExp)[];
    items?: string[] | { [key: string]: string[] };
  };
};

const fields: Field = {
  name: {
    value: 'name',
    label: 'NOME OU RAZÃO SOCIAL*',
    placeholder: 'Ex. ACERVO MOBILIA COMERCIO VAREJISTA DE MOVEIS LTDA',
    validation: z.string().min(1, 'Campo não preenchido.').max(150, 'Máximo de 150 caracteres.'),
  },
  fantasy_name: {
    value: 'fantasy_name',
    label: 'NOME FANTASIA',
    placeholder: 'Ex. Acervo Mobilia',
    validation: z.string().max(150, 'Máximo de 150 caracteres.').optional().or(z.literal('')),
  },
  email: {
    value: 'email',
    label: 'E-MAIL*',
    placeholder: 'Ex. acervomobilia@gmail.com',
    validation: z.string().min(1, 'Campo não preenchido.').email('E-mail inválido.')
  },
  cnpj: {
    value: 'cnpj',
    label: 'CNPJ*',
    placeholder: 'Ex. 00.000.000/0000-00',
    validation: z.string().length(18, 'O CNPJ deve ter 14 números.'),
    mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  },
  tax_payer: {
    value: 'tax_payer',
    label: 'CONTRIBUINTE*',
    placeholder: 'Selecione',
    validation: z.string().min(1, 'Selecione o tipo de contribuinte'),
    items: ["Não Informado","Contribuinte isento de inscrição no cadastro de contribuintes do ICMS", "Não Contribuinte, que pode ou não possuir inscrição estadual no cadastro ICMS"]
  },
  state_register: {
    value: 'state_register',
    label: 'INSCRIÇÃO ESTADUAL',
    placeholder: 'Ex. 149.679.601.869',
    validation: z.string().refine((e: string) => (e).replace(/\D/g, "").length == 12, 'A inscrição estadual deve ter 12 números.').or(z.literal('')),
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/],
  },
  municipal_register: {
    value: 'municipal_register',
    label: 'INSCRIÇÃO MUNICIPAL',
    placeholder: 'Ex. 149.679.601.869',
    validation: z.string().refine((e: string) => (e).replace(/\D/g, "").length == 12, 'A inscrição municipal deve ter 12 números.').or(z.literal('')),
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/],
  },
  pix: {
    value: 'pix',
    label: 'CHAVE PIX',
    placeholder: 'Ex. 6198765432',
    validation: z.string().max(150, 'Máximo de 150 caracteres.').optional().or(z.literal('')),
  },
  account: {
    value: 'account',
    label: 'CONTA',
    placeholder: 'Ex. 1751610-8',
    validation: z.string().refine((e: string) => (e).replace(/\D/g, "").length == 7, 'A conta deve ter 7 números.').or(z.literal('')),
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/],
  },
  agency: {
    value: 'agency',
    label: 'AGÊNCIA',
    placeholder: 'Ex. 1659',
    validation: z.coerce.number().optional().or(z.literal('')),
  },
  bank: {
    value: 'bank',
    label: 'BANCO',
    placeholder: 'Ex. Santander',
    validation: z.string().max(50, 'Máximo de 50 caracteres.').optional().or(z.literal('')),
  },
  cep: {
    value: 'cep',
    label: 'CEP',
    placeholder: 'Ex. 71234-567',
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
    validation: z.string().refine((e: string) => (e).replace(/\D/g, "").length == 8, 'O CEP deve ter 8 números.').or(z.literal('')),
  },
  address: {
    value: 'address',
    label: 'ENDEREÇO',
    placeholder: 'Ex. Quadra F Dois',
    validation: z.string().max(50, 'Máximo de 50 caracteres.').optional().or(z.literal('')),
  },
  number: {
    value: 'number',
    label: 'NÚMERO',
    placeholder: 'Ex. 123',
    validation: z.coerce.number().optional().or(z.literal('')),
  },
  state: {
    value: 'state',
    label: 'ESTADO',
    placeholder: 'Ex. DF',
    validation: z.string().optional().or(z.literal('')),
    items: Object.keys(cidades),
  },
  city: {
    value: 'city',
    label: 'CIDADE',
    placeholder: 'Ex. Brasília',
    validation: z.string().optional().or(z.literal('')),
    items: cidades,
  },
  complement: {
    value: 'complement',
    label: 'COMPLEMENTO',
    placeholder: ' Ex. Jardim Santos Dumont I',
    validation: z.string().max(50, 'Máximo de 50 caracteres.').optional().or(z.literal('')),
  },
}

const tableFields = [
  {
    value: 'name',
    label: 'NOME',
    validation: z.string().optional().or(z.literal('')),
  },
  {
    value: 'detail',
    label: 'DETALHE',
    validation: z.string().optional().or(z.literal('')),
  },
  {
    value: 'phone',
    label: 'CELULAR',
    validation: z.string().refine((e: string) => (e).replace(/\D/g, "").length == 10 || (e).replace(/\D/g, "").length == 11, 'O celular deve ter 10-11 números.').optional().or(z.literal('')),
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  },
  {
    value: 'telephone',
    label: 'TELEFONE',
    validation: z.string().refine((e: string) => (e).replace(/\D/g, "").length == 10, 'O telefone deve ter 10-11 números.').optional().or(z.literal('')),
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  }
]

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
    console.log(cidades);
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
  const divStyle = 'flex gap-2';

  // useEffect(() => {
  //   if (tableForm.fields.length === 0) {
  //     tableForm.append(tableDefaultValues);
  //   }
    
  // }, [tableForm])

  return (
    <Tabs>
      <TabsList className='h-9'>
        <TabsTrigger className="text-base" value="factory">FÁBRICAS</TabsTrigger>
        <TabsTrigger className="text-base" value="representative">REPRESENTAÇÃO</TabsTrigger>
        <TabsTrigger className="text-base"  value="other">OUTRAS INFORMAÇÕES</TabsTrigger>
      </TabsList>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TabsContent className='p-4 flex flex-col' value="factory">
            <div className='flex gap-8'>
              <div className='flex flex-1 flex-col gap-3'>
                <div className={divStyle}>
                  <FullField obj={fields.name} form={form}/>
                  <FullField obj={fields.fantasy_name} form={form} />
                </div>
                <div className={divStyle}>
                  <FullField obj={fields.email} form={form} />
                  <FullField obj={fields.cnpj} form={form} />
                </div>
                <div className={divStyle}>
                  <FullField obj={fields.tax_payer} form={form} select/>
                  <FullField obj={fields.state_register} form={form} />
                  <FullField obj={fields.municipal_register} form={form} />
                  </div>
                <div className={divStyle}>
                  <FullField obj={fields.pix} form={form} />
                  <FullField obj={fields.account} form={form} />
                </div>
                <div className={divStyle}>
                  <FullField obj={fields.agency} form={form} customClass={'grow-0 min-w-32'}/>
                  <FullField obj={fields.bank} form={form} customClass={'grow'}/>
                </div>
              </div>
              <div className='flex flex-1 flex-col gap-3'>
                <div className={divStyle}>
                  <FullField obj={fields.cep} form={form} customClass={'grow-0 min-w-36'}/>
                  <FullField obj={fields.address} form={form} customClass={'grow'}/>
                  <FullField obj={fields.number} form={form} customClass={'grow-0 min-w-36'} />
                </div>
                <div className={divStyle}>
                  <FullField obj={fields.state} form={form} search onSelect={setSelectedState} customClass={'grow-0 min-w-44'}/>
                  <FullField obj={fields.city} form={form} search unlock={selectedState} customClass={'grow-0 min-w-44'}/>
                  <FullField obj={fields.complement} form={form} customClass={'grow'}/>
                </div>
                <div>
                  <EditTinyTable title='CONTATOS DA FÁBRICA' columns={tableFields} rows={tableForm.fields} append={() => tableForm.append(tableDefaultValues)} remove={tableForm.remove} edit='contact' form={form}/>
                </div>
              </div>
            </div>
            <Button type="submit">Submit</Button>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

