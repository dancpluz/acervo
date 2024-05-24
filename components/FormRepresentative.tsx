'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Trash2 } from 'lucide-react';
import { EditTinyTable, TinyTable } from "@/components/TinyTable";
import { InputField, SearchField, SelectField } from "./AllFields";
import { fields, contactFields, teamFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { useEffect, useState } from 'react';
import FormButton from '@/components/FormButton';
import { documentExists } from '@/lib/dbRead';
import { addRepresentative, deleteDocs, updateRepresentative } from '@/lib/dbWrite';
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

// Add default values for team table

const teamDefaultValues = createDefaultValues(teamFields)

// Get all of the validations from fields and assign them as "value":"validation"

const fieldsVerification = formatVerifications(fields,['name', 'surname', 'role', 'service']);

const contactVerification = formatVerifications(contactFields);

const teamVerification = formatVerifications(teamFields);

// Join validations together to make the object of schema validation

const formSchema = z.object({ ...fieldsVerification, contact: z.array(z.object(contactVerification)), team: z.array(z.object(teamVerification)),});

export default function FormRepresentative({ data, show }: { data?: any, show?: boolean }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<{ [x: string]: any } | undefined>(undefined);
  const tabs = ['REPRESENTAÇÃO', 'EQUIPE','ENDEREÇO E CONTATO'];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    shouldFocusError: false,
  })
  const contactForm = useFieldArray({
    control: form.control,
    name: 'contact',
  });
  const teamForm = useFieldArray({
    control: form.control,
    name: 'team',
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
          query: 'info.cnpj',
          value: values.cnpj
        },
      ],
    }

    if (await documentExists(check)) {
      toast({
        variant: 'destructive',
        title: "Esta representação já existe",
      })
      throw new Error("Document exists");
      
    } else {
      try {
        await addRepresentative(values)
        toast({
          title: "Representação adicionada com sucesso!",
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
    await updateRepresentative(data.refs, values);
    setIsEditing(false);
    toast({
      title: "Representação editada com sucesso!",
    })
  }
  
  async function deleteRepresentative(ids: { [key: string]: string }) {
    await deleteDocs(ids)
    toast({
      title: "Representação apagada com sucesso!",
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
                <AlertDialogAction onClick={() => { deleteRepresentative(data.refs)}}>APAGAR</AlertDialogAction>
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
                </FormDiv>
                <FormDiv>
                  <InputField obj={fields.observations} form={form} long disabled={show && !isEditing} />
                  <FormButton nextValue={tabs[1]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined}/>
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[1]}>
            <TabDiv>
              {show && !isEditing ? <TinyTable title='' columns={teamFields} rows={teamForm.fields} placeholder={'Sem funcionários'} order={["name", "telephone", "phone", "email", "role", "detail"]} />
                : <EditTinyTable title='' columns={teamFields} rows={teamForm.fields} append={() => teamForm.append(teamDefaultValues)} remove={teamForm.remove} prefix='team' form={form} order={["name", "telephone", "phone", "email", "role", "detail"]} />}
              <FormButton backValue={tabs[0]} state={form.formState} nextValue={tabs[2]} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined}/>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[2]}>
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
                  {show && !isEditing ? <TinyTable title='CONTATOS DA REPRESENTAÇÃO' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} />
                    : <EditTinyTable title='CONTATOS DA REPRESENTAÇÃO' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(contactDefaultValues)} remove={contactForm.remove} prefix='contact' form={form} order={["name", "detail", "phone", "telephone"]} />}
                  <FormButton backValue={tabs[1]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined} submit={!show} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

