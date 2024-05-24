'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Trash2 } from 'lucide-react';
import { EditTinyTable, TinyTable } from "@/components/TinyTable";
import { InputField, SearchField, SelectField, RadioField } from "./AllFields";
import { fields, contactFields, enumFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { useEffect, useState } from 'react';
import FormButton from '@/components/FormButton';
import { documentExists } from '@/lib/dbRead';
import { addService, deleteDocs, updateService } from '@/lib/dbWrite';
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

// Default values for the fields

const defaultValues = createDefaultValues(fields);

// Add default values for contact table

const contactDefaultValues = createDefaultValues(contactFields)

// Get all of the validations from fields and assign them as "value":"validation"

const fieldsVerificationJuridical = formatVerifications(fields, ['role','name','surname']);
const fieldsVerificationFisical = formatVerifications(fields, ['cnpj','company_name','tax_payer','role']);

const contactVerification = formatVerifications(contactFields);

// Join validations together to make the object of schema validation

const formSchemaJuridical = z.object({ ...fieldsVerificationJuridical, contact: z.array(z.object(contactVerification))})

const formSchemaFisical = z.object({ ...fieldsVerificationFisical, contact: z.array(z.object(contactVerification))})

export default function FormService({ data, show }: { data?: any, show?: boolean }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<{ [x: string]: any } | undefined>(undefined);
  const [personType, setPersonType] = useState<string>('Física');
  const tabs = ['PRESTADOR DE SERVIÇOS', 'CONTATO E ENDEREÇO'];

  const form = useForm<z.infer<typeof formSchemaFisical> | z.infer<typeof formSchemaJuridical>>({
    resolver: zodResolver(personType === 'Física' ? formSchemaFisical : formSchemaJuridical),
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
      setPersonType(data.person.info.cnpj ? 'Jurídica' : 'Física')
      setInitialValues(form.getValues())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  async function addSubmit(values: z.infer<typeof formSchemaFisical> | z.infer<typeof formSchemaJuridical>) {
    // Check if values already exists
    console.log(values)

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
        title: "Este serviço já existe",
      })
      throw new Error("Document exists");
      
    } else {
      try {
        await addService(values, personType)
        toast({
          title: "Serviço adicionado com sucesso!",
        })
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: error.message,
        })
      }
    }
  }
  async function editSubmit(values: z.infer<typeof formSchemaFisical> | z.infer <typeof formSchemaJuridical>) {
    await updateService(data.refs, values, personType);
    setIsEditing(false);
    toast({
      title: "Serviço editado com sucesso!",
    })
  }
  
  async function deleteService(ids: { [key: string]: string }) {
    await deleteDocs(ids)
    toast({
      title: "Serviço apagado com sucesso!",
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
          <AlertDialogTrigger className='flex gap-2 items-center justify-center transition-opacity hover:opacity-50 rounded-none h-9.5 border-0 border-b border-primary text-primary px-4'><Trash2 className='w-4 h-4'/>APAGAR</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza que deseja apagar?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação eliminará removerá os dados dos nossos servidores. Essa ação é irreversível.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>CANCELAR</AlertDialogCancel>
                <AlertDialogAction onClick={() => { deleteService(data.refs)}}>APAGAR</AlertDialogAction>
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
                    <InputField obj={fields.service} form={form} disabled={show && !isEditing} />
                    <RadioField obj={enumFields.bool_person_type} form={form} bool disabled={show && !isEditing} setPersonType={setPersonType} defaultValue={personType}/>
                  </FieldDiv>
                  <FieldDiv>
                    {personType === 'Jurídica' ?
                    <>
                      <InputField obj={fields.company_name} form={form} disabled={show && !isEditing} />
                      <InputField obj={fields.fantasy_name} form={form} disabled={show && !isEditing} />
                    </> : 
                    <>
                      <InputField obj={fields.name} form={form} disabled={show && !isEditing} />
                      <InputField obj={fields.surname} form={form} disabled={show && !isEditing} />
                    </>}
                  </FieldDiv>
                  <FieldDiv>
                    <InputField obj={fields.info_email} form={form} disabled={show && !isEditing} />
                    {personType === 'Jurídica' ?
                    <>
                      <InputField obj={fields.cnpj} form={form} disabled={show && !isEditing} />
                    </> : 
                    <>
                      <InputField obj={fields.rg} form={form} disabled={show && !isEditing} customClass={'grow-0 min-w-40'}/>
                      <InputField obj={fields.cpf} form={form} disabled={show && !isEditing} customClass={'grow-0 min-w-44'}/>
                    </>}
                  </FieldDiv>
                  <FieldDiv>
                    {personType === 'Jurídica' &&
                    <>
                      <SelectField obj={fields.tax_payer} form={form} disabled={show && !isEditing} />
                      <InputField obj={fields.state_register} form={form} disabled={show && !isEditing} />
                      <InputField obj={fields.municipal_register} form={form} disabled={show && !isEditing} />
                    </>}
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <InputField obj={fields.observations} form={form} long disabled={show && !isEditing} />
                  <FieldDiv>
                    <SearchField obj={fields.bank} form={form} hint={'Ex. Bradesco'} customClass={'overflow-hidden text-ellipsis'} disabled={show && !isEditing} />
                    <InputField obj={fields.pix} form={form} disabled={show && !isEditing} />
                  </FieldDiv>
                  <FieldDiv>
                    <InputField obj={fields.account} form={form} disabled={show && !isEditing} />
                    <InputField obj={fields.agency} form={form} disabled={show && !isEditing}/>
                  </FieldDiv>
                  <FormButton nextValue={tabs[1]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined}/>
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[1]}>
            <TabDiv>
              <div className='flex gap-8'>
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
                </FormDiv>
                <FormDiv>
                {show && !isEditing ? <TinyTable title='' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} />
                    : <EditTinyTable title='' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(contactDefaultValues)} remove={contactForm.remove} prefix='contact' form={form} order={["name", "detail", "phone", "telephone"]} />}
                <FormButton backValue={tabs[0]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined} submit/>
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

