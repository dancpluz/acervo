'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Trash2 } from 'lucide-react';
import { EditTinyTable, TinyTable } from "@/components/TinyTable";
import { InputField, SearchField, SelectField, ShowField, RadioField } from "./AllFields";
import { fields, tableFields, enumFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { useEffect, useState } from 'react';
import FormButton from '@/components/FormButton';
import { documentExists } from '@/lib/dbRead';
import { addFactory, deleteDocs, updateFactory } from '@/lib/dbWrite';
import { fillCepFields, setFormValues } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

export default function FormFactory({ data, show }: { data?: any, show?: boolean }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    shouldFocusError: false,
  })
  const tableForm = useFieldArray({
    control: form.control,
    name: 'contact',
  });
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setFormValues(form, tableForm, data);
      form.setValue('pricing', form.getValues('pricing').toString());
      form.setValue('bool_direct_sale', data.direct_sale !== '' ? 'Sim' : 'Não');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  
  async function addSubmit(values: z.infer<typeof formSchema>) {
    // Check if values already exists
    const check = {
      person: [
        {
          query: 'info.cnpj',
          value: values.cnpj
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
      await addFactory(values)
      toast({
        title: "Fábrica adicionada com sucesso!",
      })
    }
  }
  
  async function editSubmit(values: z.infer<typeof formSchema>) {
    await updateFactory(data.refs, values);
    setIsEditing(false);
    toast({
      title: "Fábrica editada com sucesso!",
    })
  }
  
  async function deleteFactory(ids: { [key: string]: string }) {
    await deleteDocs(ids)
    toast({
      title: "Fábrica apagada com sucesso!",
    })
    router.refresh()
  }

  return (
    <Tabs className='bg-secondary/20' defaultValue="factory">
      <div className='flex'>
      <TabsList className={`${show ? 'h-8' : 'h-9'}`}>
        <TabsTrigger className={`${show ? 'text-sm' : 'text-base'}`} value="factory">FÁBRICAS</TabsTrigger>
        <TabsTrigger className={`${show ? 'text-sm' : 'text-base'}`} value="representative">REPRESENTAÇÃO</TabsTrigger>
        <TabsTrigger className={`${show ? 'text-sm' : 'text-base'}`}  value="other">OUTRAS INFORMAÇÕES</TabsTrigger>
      </TabsList>
      {show && <div className='flex grow justify-end'>
        <AlertDialog>
          <AlertDialogTrigger className='flex gap-2 items-center justify-center transition-opacity hover:opacity-50 rounded-none h-9.5 border-0 border-b border-primary text-primary px-4'><Trash2 className='w-4 h-4' />APAGAR</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza que deseja apagar?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação eliminará removerá os dados dos nossos servidores. Essa ação é irreversível.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>CANCELAR</AlertDialogCancel>
              <AlertDialogAction onClick={() => {deleteFactory(data.refs)}}>APAGAR</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>}
      </div>
      <Form {...form}>
        <form onSubmit={show ? form.handleSubmit(editSubmit) : form.handleSubmit(addSubmit)}>
          <TabsContent value="factory">
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.name} form={form} disabled={show && !isEditing} />
                    <InputField obj={fields.fantasy_name} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField obj={fields.info_email} form={form} disabled={show && !isEditing} />
                    <InputField obj={fields.cnpj} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <SelectField obj={fields.tax_payer} form={form} disabled={show && !isEditing} />
                    <InputField obj={fields.state_register} form={form} disabled={show && !isEditing} />
                    <InputField obj={fields.municipal_register} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField obj={fields.bank} form={form} hint={'Ex. Bradesco'} customClass={'overflow-hidden text-ellipsis'} disabled={show && !isEditing} />
                    <InputField obj={fields.pix} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField obj={fields.account} form={form} disabled={show && !isEditing} />
                    <InputField obj={fields.agency} form={form} disabled={show && !isEditing}/>
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.cep} autofill={fillCepFields} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing}/>
                    <InputField obj={fields.address} form={form} customClass={'grow'} disabled={show && !isEditing}/>
                    <InputField obj={fields.number} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing}/>
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField obj={fields.state} form={form} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} disabled={show && !isEditing} />
                    <SearchField obj={fields.city} form={form} hint={'Ex. Brasília'} unlock={form.watch('state')} customClass={'grow-0 min-w-44'} disabled={show && !isEditing} />
                    <InputField obj={fields.complement} form={form} customClass={'grow'} disabled={show && !isEditing}/>
                  </FieldDiv>
                  <div>
                    {show && !isEditing ? <TinyTable title='CONTATOS DA FÁBRICA' columns={tableFields} rows={tableForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} /> 
                    : <EditTinyTable title='CONTATOS DA FÁBRICA' columns={tableFields} rows={tableForm.fields} append={() => tableForm.append(tableDefaultValues)} remove={tableForm.remove} edit='contact' form={form}/>}
                  </div>
                  <FormButton nextValue='representative' state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined}/>
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value="representative">
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <SearchField customClass={'grow-0'} obj={fields.representative} form={form} hint={'Ex. Punto'} disabled={show && !isEditing} />
                  <ShowField text={''} label={'EMAIL DA REPRESENTAÇÃO'} placeholder={'Selecione uma Representação'} />
                </FormDiv>
                <FormDiv>
                  <TinyTable title='CONTATOS DA REPRESENTAÇÃO' columns={tableFields} placeholder='Selecione uma Representação' order={[]} />
                  <FormButton backValue='factory' state={form.formState} nextValue='other' setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined}/>
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value="other">
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <RadioField obj={enumFields.pricing} form={form} disabled={show && !isEditing}/>
                  <RadioField obj={enumFields.style} form={form} optional disabled={show && !isEditing}/>
                  <RadioField obj={enumFields.ambient} form={form} disabled={show && !isEditing}/>
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.discount} form={form} percent disabled={show && !isEditing} />
                    <RadioField obj={enumFields.bool_direct_sale} form={form} bool disabled={show && !isEditing}/>
                    <InputField obj={fields.direct_sale} form={form} percent disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField obj={fields.observations} form={form} long disabled={show && !isEditing}/>
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <InputField obj={fields.link_catalog} form={form} disabled={show && !isEditing} />
                  <InputField obj={fields.link_table} form={form} disabled={show && !isEditing} />
                  <InputField obj={fields.link_site} form={form} disabled={show && !isEditing} />
                </FormDiv>
              </div>
              <FormButton backValue='representative' state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} submit={!show} />
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

