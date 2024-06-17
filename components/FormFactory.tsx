'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Trash2 } from 'lucide-react';
import { EditTinyTable, TinyTable } from "@/components/TinyTable";
import { InputField, SearchField, SelectField, ShowField, RadioField, ReferenceField } from "./AllFields";
import { fields, contactFields, enumFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { useEffect, useState } from 'react';
import FormButton from '@/components/FormButton';
import { documentExists } from '@/lib/dbRead';
import { addFactory, deleteDocs, updateFactory } from '@/lib/dbWrite';
import { fillCepFields, setFormValues, formatVerifications, createDefaultValues } from "@/lib/utils";
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
import { ReferenceT } from "@/lib/types";

// Default values for the fields

const defaultValues = createDefaultValues(fields);
defaultValues['bool_direct_sale'] = 'Não';
defaultValues['style'] = '';

// Add default values for contact table

const contactDefaultValues = createDefaultValues(contactFields)

// Get all of the validations from fields and assign them as "value":"validation"

const fieldsVerification = formatVerifications(fields, ['name', 'surname', 'role', 'service']);

const contactVerification = formatVerifications(contactFields);

const enumVerification = formatVerifications(enumFields);

// Join validations together to make the object of schema validation

const formSchema = z.object({ ...fieldsVerification, contact: z.array(z.object(contactVerification)), ...enumVerification});

export default function FormFactory({ data, show, representatives }: { data?: any, show?: boolean, representatives: ReferenceT[] }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<{ [x: string]: any } | undefined>(undefined);
  const tabs = ['FÁBRICAS', 'REPRESENTAÇÃO', 'OUTRAS INFORMAÇÕES'];
  
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
    console.log(form.getValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('representative')])

  useEffect(() => {
    if (data) {
      setFormValues(form, data);
      form.setValue('direct_sale', data.direct_sale !== '' ? (data.direct_sale * 100).toString() : '')
      form.setValue('discount', data.discount !== '' ? (data.discount * 100).toString() : '')
      form.setValue('pricing', data.pricing.toString());
      form.setValue('bool_direct_sale', data.direct_sale !== '' ? 'Sim' : 'Não');
      setInitialValues(form.getValues())
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
      try {
        await addFactory(values)
        toast({
          title: "Fábrica adicionada com sucesso!",
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
              <AlertDialogAction onClick={() => { deleteFactory(data.refs) }}>APAGAR</AlertDialogAction>
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
                    <InputField obj={fields.company_name} form={form} disabled={show && !isEditing} />
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
                    {show && !isEditing ? <TinyTable title='CONTATOS DA FÁBRICA' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} /> 
                      : <EditTinyTable title='CONTATOS DA FÁBRICA' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(contactDefaultValues)} remove={contactForm.remove} prefix='contact' form={form} order={["name", "detail", "phone", "telephone"]} />}
                  </div>
                  <FormButton nextValue={tabs[1]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined}/>
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[1]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <ReferenceField customClass={'grow-0'} obj={fields.representative} references={representatives} form={form} hint={'Ex. Punto'} disabled={show && !isEditing} />
                  <ShowField text={(show && !isEditing) ?? form.watch('representative.info_email') ?? ''} label={'EMAIL DA REPRESENTAÇÃO'} placeholder={'Selecione uma Representação'} />
                </FormDiv>
                <FormDiv>
                  <TinyTable title='CONTATOS DA REPRESENTAÇÃO' columns={contactFields} rows={form.watch('representative.contact')} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} /> 
                  <FormButton backValue={tabs[0]} state={form.formState} nextValue={tabs[2]} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined}/>
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[2]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <RadioField obj={enumFields.pricing} form={form} defaultValue={form.watch('pricing')} disabled={show && !isEditing}/>
                  <RadioField obj={enumFields.style} form={form} defaultValue={form.watch('style')} optional disabled={show && !isEditing}/>
                  <RadioField obj={enumFields.ambient} form={form} defaultValue={form.watch('ambient')} disabled={show && !isEditing}/>
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.discount} form={form} percent disabled={show && !isEditing} />
                    <RadioField obj={enumFields.bool_direct_sale} form={form} bool defaultValue={'Não'} disabled={show && !isEditing}/>
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
              <FormButton backValue={tabs[1]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined} submit={!show} />
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

