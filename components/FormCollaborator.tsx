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
import { fields, contactFields, enumFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { useEffect, useState } from 'react';
import FormButton from '@/components/FormButton';
import { documentExists } from '@/lib/dbRead';
import { addCollaborator, deleteDocs, updateCollaborator } from '@/lib/dbWrite';
import { fillCepFields, setFormValues, formatVerifications, createDefaultValues } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
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

const defaultValues = createDefaultValues(fields);

// Add default values for contact table

const contactDefaultValues = createDefaultValues(contactFields)

// Get all of the validations from fields and assign them as "value":"validation"

const fieldsVerification = formatVerifications(fields,['company_name', 'tax_payer', 'cnpj', 'service']);

const contactVerification = formatVerifications(contactFields);

// Join validations together to make the object of schema validation

const formSchema = z.object({ ...fieldsVerification, contact: z.array(z.object(contactVerification)) });

export default function FormCollaborator({ data, show }: { data?: any, show?: boolean }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<{ [x: string]: any } | undefined>(undefined);
  const tabs = ['COLABORADOR', 'CONTATO E ENDEREÇO'];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    shouldFocusError: false,
  })
  const contactForm = useFieldArray({
    control: form.control,
    name: 'contact',
  });

  useEffect(() => {
    if (data) {
      setFormValues(form, data);
      setInitialValues(form.getValues())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  async function addSubmit(values: z.infer<typeof formSchema>) {
    // Check if values already exists
    const check = {
      person: [
        {
          query: 'info.info_email',
          value: values.info_email
        },
      ],
    }

    if (await documentExists(check)) {
      toast({
        variant: 'destructive',
        title: "Este colaborador já existe",
      })
      throw new Error("Document exists");

    } else {
      try {
        await addCollaborator(values)
        toast({
          title: "Colaborador adicionado com sucesso!",
        })
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: error.message,
        })
      }
    }
  }

  async function editSubmit(values: z.infer<typeof formSchema>) {
    await updateCollaborator(data.refs, values);
    setIsEditing(false);
    toast({
      title: "Colaborador editado com sucesso!",
    })
  }

  async function deleteCollaborator(ids: { [key: string]: string }) {
    await deleteDocs(ids)
    toast({
      title: "Colaborador apagado com sucesso!",
    })
    router.refresh()
  }

  return (
    <Tabs className='bg-secondary/20' defaultValue={tabs[0]}>
      <div className='flex'>
        <TabsList className={`${show ? 'h-8' : 'h-9'}`}>
          {tabs.map((tab) =>
            <TabsTrigger key={tab} className={`${show ? 'text-sm' : 'text-base'}`} value={tab}>{tab}</TabsTrigger>
          )}
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
                <AlertDialogAction onClick={() => { deleteCollaborator(data.refs) }}>APAGAR</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>}
      </div>
      <Form {...form}>
        <form onSubmit={show ? form.handleSubmit(editSubmit) : form.handleSubmit(addSubmit)}>
          <TabsContent value={tabs[0]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.name} form={form} disabled={show && !isEditing} />
                    <InputField obj={fields.surname} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField obj={fields.info_email} form={form} disabled={show && !isEditing} />
                    <InputField obj={fields.rg} form={form} disabled={show && !isEditing} customClass={'grow-0 min-w-40'}/>
                    <InputField obj={fields.cpf} form={form} disabled={show && !isEditing} customClass={'grow-0 min-w-44'}/>
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField obj={fields.bank} form={form} hint={'Ex. Bradesco'} customClass={'overflow-hidden text-ellipsis'} disabled={show && !isEditing} />
                    <InputField obj={fields.pix} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField obj={fields.account} form={form} disabled={show && !isEditing} />
                    <InputField obj={fields.agency} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <InputField obj={fields.role} form={form} disabled={show && !isEditing} />
                  <InputField obj={fields.observations} form={form} long disabled={show && !isEditing} />
                  <FormButton nextValue={tabs[1]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[1]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  {show && !isEditing ? <TinyTable title='' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} />
                    : <EditTinyTable title='' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(contactDefaultValues)} remove={contactForm.remove} prefix='contact' form={form} order={["name", "detail", "phone", "telephone"]} /> }
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.cep} autofill={fillCepFields} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing} />
                    <InputField obj={fields.address} form={form} customClass={'grow'} disabled={show && !isEditing} />
                    <InputField obj={fields.number} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField obj={fields.state} form={form} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} disabled={show && !isEditing} />
                    <SearchField obj={fields.city} form={form} hint={'Ex. Brasília'} unlock={form.watch('state')} customClass={'grow-0 min-w-44'} disabled={show && !isEditing} />
                    <InputField obj={fields.complement} form={form} customClass={'grow'} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FormButton backValue={tabs[0]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined} submit={!show} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[2]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <RadioField obj={enumFields.pricing} form={form} disabled={show && !isEditing} />
                  <RadioField obj={enumFields.style} form={form} optional disabled={show && !isEditing} />
                  <RadioField obj={enumFields.ambient} form={form} disabled={show && !isEditing} />
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.discount} form={form} percent disabled={show && !isEditing} />
                    <RadioField obj={enumFields.bool_direct_sale} form={form} bool defaultValue={'Não'} disabled={show && !isEditing} />
                    <InputField obj={fields.direct_sale} form={form} percent disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField obj={fields.observations} form={form} long disabled={show && !isEditing} />
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <InputField obj={fields.link_catalog} form={form} disabled={show && !isEditing} />
                  <InputField obj={fields.link_table} form={form} disabled={show && !isEditing} />
                  <InputField obj={fields.link_site} form={form} disabled={show && !isEditing} />
                </FormDiv>
              </div>
              <FormButton backValue={tabs[1]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined} submit={!show} />
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

