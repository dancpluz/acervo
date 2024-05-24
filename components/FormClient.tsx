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
import { fields, contactFields, orderFields, enumFields } from "@/lib/fields";
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useEffect, useState } from 'react';
import FormButton from '@/components/FormButton';
import { documentExists } from '@/lib/dbRead';
import { addClient, deleteDocs, updateClient } from '@/lib/dbWrite';
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
import OrderFields from "@/components/OrderFields";

// Default values for the fields

const defaultValues = createDefaultValues(fields);
defaultValues['shipping'] = {cep: '', address: '', number: '', state: '', city: '', complement: ''}

// Add default values for contact table

const contactDefaultValues = createDefaultValues(contactFields)

// Add default values for order table

const orderDefaultValues = createDefaultValues(orderFields)

// Get all of the validations from fields and assign them as "value":"validation"

const fieldsVerificationJuridical = formatVerifications(fields, ['role','name','surname','role','service']);
const fieldsVerificationFisical = formatVerifications(fields, ['cnpj','company_name','tax_payer','role','service']);

const shippingVerification = {cep: fieldsVerificationJuridical.cep, address: fieldsVerificationJuridical.address, number: fieldsVerificationJuridical.number, state: fieldsVerificationJuridical.state, city: fieldsVerificationJuridical.city, complement: fieldsVerificationJuridical.complement}

const contactVerification = formatVerifications(contactFields);

const orderVerification = formatVerifications(orderFields);

// Join validations together to make the object of schema validation

const formSchemaJuridical = z.object({ ...fieldsVerificationJuridical, contact: z.array(z.object(contactVerification)), order: z.array(z.object(orderVerification)), shipping: z.object(shippingVerification) })

const formSchemaFisical = z.object({ ...fieldsVerificationFisical, contact: z.array(z.object(contactVerification)), order: z.array(z.object(orderVerification)), shipping: z.object(shippingVerification) })

export default function FormClient({ data, show }: { data?: any, show?: boolean }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<{ [x: string]: any } | undefined>(undefined);
  const [sameAddress, setSameAddress] = useState<boolean>(false);
  const [personType, setPersonType] = useState<string>('Física');
  const tabs = ['CLIENTE', 'CONTATO','ENDEREÇO', 'PEDIDOS', 'OUTRAS INFORMAÇÕES'];

  const form = useForm<z.infer<typeof formSchemaFisical> | z.infer<typeof formSchemaJuridical>>({
    resolver: zodResolver(personType === 'Física' ? formSchemaFisical : formSchemaJuridical),
    defaultValues,
    shouldFocusError: false,
  })
  const contactForm = useFieldArray({
    control: form.control,
    name: 'contact',
  });
  const orderForm = useFieldArray({
    control: form.control,
    name: 'order',
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
        title: "Este cliente já existe",
      })
      throw new Error("Document exists");
      
    } else {
      try {
        let newValues = values;
        if (sameAddress) {
          newValues.shipping = {cep: values.cep, state: values.state, city: values.city, address: values.address, number: values.number, complement: values.complement}
        }
        await addClient(newValues, personType)
        toast({
          title: "Cliente adicionado com sucesso!",
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
    let newValues = values;
    if (sameAddress) {
      newValues.shipping = {cep: values.cep, state: values.state, city: values.city, address: values.address, number: values.number, complement: values.complement}
    }
    await updateClient(data.refs, newValues, personType);
    setIsEditing(false);
    toast({
      title: "Cliente editado com sucesso!",
    })
  }
  
  async function deleteClient(ids: { [key: string]: string }) {
    await deleteDocs(ids)
    toast({
      title: "Cliente apagado com sucesso!",
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
                <AlertDialogAction onClick={() => { deleteClient(data.refs)}}>APAGAR</AlertDialogAction>
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
                    <RadioField obj={enumFields.bool_person_type} form={form} bool disabled={show && !isEditing} setPersonType={setPersonType} defaultValue={personType}/>
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
              {show && !isEditing ? <TinyTable title='' columns={contactFields} rows={contactForm.fields} placeholder={'Sem contatos'} order={["name", "detail", "phone", "telephone"]} />
                : <EditTinyTable title='' columns={contactFields} rows={contactForm.fields} append={() => contactForm.append(contactDefaultValues)} remove={contactForm.remove} prefix='contact' form={form} order={["name", "detail", "phone", "telephone"]} />}
              <FormButton backValue={tabs[0]} state={form.formState} nextValue={tabs[2]} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined}/>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[2]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <Label className='text-base'>ENDEREÇO FISCAL</Label>
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
                  <div className='flex justify-between'>
                    <Label className='text-base'>ENDEREÇO DE ENTREGA</Label>
                    <RadioGroup className='items-center p-0 border-0' defaultValue="Não">
                      <Label className=''>IGUAL ENDEREÇO FISCAL?</Label>
                      <div className="flex items-center gap-1">
                        <RadioGroupItem value="Sim" disabled={show && !isEditing} onClick={() => {form.resetField('shipping'); setSameAddress(true)}}
                        className={`data-[state=unchecked]:disabled:hover:bg-secondary disabled:cursor-default disabled:opacity-100`} />
                        <RadioGroupItem value="Não" disabled={show && !isEditing} onClick={() => setSameAddress(false)}
                        className={`data-[state=unchecked]:disabled:hover:bg-secondary disabled:cursor-default disabled:opacity-100`} />
                      </div>
                    </RadioGroup>
                  </div>
                  <FieldDiv>
                    <InputField obj={{...fields.cep, value: sameAddress ? fields.cep.value : "shipping." + fields.cep.value}} autofill={fillCepFields} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing || sameAddress} />
                    <InputField obj={{...fields.address, value: sameAddress ? fields.address.value : "shipping." + fields.address.value}} form={form} customClass={'grow'} disabled={show && !isEditing || sameAddress} />
                    <InputField obj={{...fields.number, value: sameAddress ? fields.number.value : "shipping." + fields.number.value}} form={form} customClass={'grow-0 min-w-36'} disabled={show && !isEditing || sameAddress} />
                  </FieldDiv>
                  <FieldDiv>
                    <SearchField obj={{...fields.state, value: sameAddress ? fields.state.value : "shipping." + fields.state.value}} form={form} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} disabled={show && !isEditing || sameAddress} />
                    <SearchField obj={{...fields.city, value: sameAddress ? fields.city.value : "shipping." + fields.city.value}} form={form} hint={'Ex. Brasília'} unlock={sameAddress ? form.watch('state') : form.watch('shipping.state')} customClass={'grow-0 min-w-44'} disabled={show && !isEditing || sameAddress} />
                    <InputField obj={{...fields.complement, value: sameAddress ? fields.complement.value : "shipping." + fields.complement.value}} form={form} customClass={'grow'} disabled={show && !isEditing || sameAddress} />
                  </FieldDiv>
                  <FormButton backValue={tabs[1]} state={form.formState} nextValue={tabs[3]} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined}/>
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[3]}>
            <TabDiv>
              <OrderFields title='' form={form} rows={orderForm.fields} append={() => orderForm.append(orderDefaultValues)} remove={orderForm.remove} update={orderForm.update} prefix={'order'} disabled={show && !isEditing} />
              <FormButton backValue={tabs[2]} state={form.formState} nextValue={tabs[4]} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined}/>
            </TabDiv>
          </TabsContent>
          <TabsContent value={tabs[4]}>
            <TabDiv>
              <div className='flex gap-8'>
                <FormDiv>
                  <FieldDiv>
                    <SearchField obj={fields.office} form={form} hint={'Ex. Quintal'} disabled={show && !isEditing} />
                    {/* <ShowField text={''} label={'ARQUITETO RESPONSÁVEL'} placeholder={'Selecione uma Representação'} /> */}
                  </FieldDiv>
                </FormDiv>
                <FormDiv>
                  <FieldDiv>
                    <InputField obj={fields.observations} form={form} long disabled={show && !isEditing} />
                  </FieldDiv>
                  <FormButton backValue={tabs[3]} state={form.formState} setIsEditing={setIsEditing} isEditing={show ? isEditing : undefined} undoForm={initialValues ? () => form.reset(initialValues) : undefined} submit={!show} />
                </FormDiv>
              </div>
            </TabDiv>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

