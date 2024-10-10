'use client'

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { finishFields, productFields } from "@/lib/fields";
import { formatFields, stringToSlug, unformatNumber, formatCurrency } from "@/lib/utils";
import useCRMFormActions from "@/hooks/useCRMFormActions";
import { ReferenceField, InputField, SelectField, ImageField } from "@/components/AllFields";
import { Form } from "@/components/ui/form";
import { FieldDiv } from "@/components/ui/div";
import { Button } from "@/components/ui/button";
import { CirclePlus, X } from 'lucide-react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import db from '@/lib/firebase';
import { format } from 'date-fns';
import { FactoryT, MarkupT, PersonT } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import PriceBox from "@/components/PriceBox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const [defaultValues, fieldValidations] = formatFields(productFields);
defaultValues['quantity'] = '1';
defaultValues['enabled'] = true;

export default function ProductForm() {
  const [shard, loading, error] = useDocumentData(doc(db, 'shard', 'product'));

  const form = useForm<z.infer<typeof fieldValidations>>({
    resolver: zodResolver(fieldValidations),
    defaultValues,
    shouldFocusError: false,
  })

  const [referenceInfo, setReferenceInfo] = useState<{ [key: string]: '' | FactoryT | MarkupT }>({ factory: '', markup: '' });
  const [popoverOpen, setPopoverOpen] = useState(false);

  const selectedMarkup = referenceInfo.markup as MarkupT;
  const selectedFactory = referenceInfo.factory as FactoryT;

  const today = new Date();
  const id = `${loading || !shard ? '' : shard.index + 1}${form.watch('category') ? '_' + stringToSlug(form.watch('category') || '') : ''}${form.watch('name') ? '_' + stringToSlug(form.watch('name') || '') : ''}${selectedFactory ? '_' + stringToSlug((selectedFactory.person as PersonT).label || '') : ''}_${format(today, "dd-MM-yyyy")}`


  const markup12 = selectedMarkup && form.watch('cost') ? unformatNumber(selectedMarkup['12x'] as string) * unformatNumber(form.watch('cost')) : '';
  const markup6 = selectedMarkup && form.watch('cost') ? Number(markup12) * (1 - unformatNumber(selectedMarkup['6x'] as string, true)) : '';
  const markupCash = selectedMarkup && form.watch('cost') ? Number(markup12) * (1 - unformatNumber(selectedMarkup['cash'] as string, true)) : '';

  const {
    productSubmit,
    saveProduct,
    setSaveProduct,
  } = useCRMFormActions(form, undefined, id);

  // const checkPaths = [['person', 'info', 'fantasy_name'], ['person', 'info', 'company_name'], ['person', 'info', 'cnpj'], ['person', 'info', 'info_email']]

  useEffect(() => {
    if (!loading && shard) {
      form.setValue('num', shard.index + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shard, loading]);

  const updateReferenceInfo = (key: string, value: '' | FactoryT | MarkupT) => {
    setReferenceInfo((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <div className='flex flex-col bg-background gap-4 p-4 rounded-lg'>
      <Form {...form}>
        <form className='flex flex-col gap-4' onSubmit={form.handleSubmit(productSubmit)}>
          <span className='text-sm text-tertiary'>{id}</span>
          <div className='flex gap-4'>
            <div className='flex flex-col gap-4 w-[60%]'>
              <FieldDiv>
                <InputField path='' obj={productFields.name} form={form} />
                <SelectField path='' obj={productFields.ambient} form={form} />
              </FieldDiv>
              <InputField path='finish' obj={finishFields.frame} form={form} />
              <InputField path='finish' obj={finishFields.fabric} form={form} />
              <FieldDiv>
                <InputField path='finish' obj={finishFields.width} cm form={form} />
                <InputField path='finish' obj={finishFields.depth} cm form={form} />
                <InputField path='finish' obj={finishFields.height} cm form={form} />
              </FieldDiv>
              <InputField path='' obj={productFields.observations} form={form} long />
              <FieldDiv>
                <ReferenceField obj={productFields.factory} form={form} refPath='factory' onSelect={(e: FactoryT | MarkupT) => updateReferenceInfo('factory', e)} hint={'Ex. Punto'} person />
                <ReferenceField obj={productFields.freight} form={form} refPath='config, markup_freight, freight' hint={'Ex. Punto'} />
              </FieldDiv>
              <FieldDiv>
                <InputField path='' obj={productFields.cost} form={form} />
                <ReferenceField obj={productFields.markup} form={form} refPath='config, markup_freight, markup' onSelect={(e: FactoryT | MarkupT ) => updateReferenceInfo('markup', e)} hint={'Ex. Punto'} />
              </FieldDiv>
              <Separator className='bg-alternate' orientation="horizontal" />
              <FieldDiv className='justify-between'>
                <PriceBox className='text-xs p-[4px]' title='12x' text={formatCurrency(markup12 as number)} />
                <PriceBox className='text-xs p-[4px]' title='6x' text={formatCurrency(markup6 as number)} />
                <PriceBox className='text-xs p-[4px]' title='à vista' text={formatCurrency(markupCash as number)} />
              </FieldDiv>
            </div>
            <div className='flex flex-col gap-4 w-[40%]'>
              <FieldDiv>
                <InputField path='' obj={productFields.quantity} form={form} />
                <SelectField customClass='grow-0 min-w-52' path='' obj={productFields.category} form={form} />
              </FieldDiv>
              <InputField customClass='grow-0' path='finish' obj={finishFields.extra} form={form} />
              <InputField customClass='grow-0' path='finish' obj={finishFields.designer} form={form} />
              <FieldDiv>
                <InputField path='finish' obj={finishFields.link_finishes} form={form} />
                <InputField path='finish' obj={finishFields.link_3d} form={form} />
              </FieldDiv>
              <ImageField path='finish' obj={finishFields.link_3d} form={form} />
            </div>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-tertiary'>Data de criação: {today.toLocaleDateString('pt-BR')}</span>
            <RadioGroup className='flex p-0 border-0 gap-2 items-center' defaultValue={saveProduct ? 'Sim' : 'Não'}>
              <Label className='text-xs'>SALVAR NO CATÁLOGO?</Label>
              <div className="flex gap-1">
                <RadioGroupItem onSelect={() => setSaveProduct(true)} value='Sim' label='Sim'
                  className={`data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-background data-[state=unchecked]:bg-background transition-colors disabled:cursor-default disabled:opacity-100 rounded-sm text-xs h-8 w-12`}
                />
                <RadioGroupItem onSelect={() => setSaveProduct(false)} value="Não" label="Não"
                  className={`data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-background data-[state=unchecked]:bg-background transition-colors disabled:cursor-default disabled:opacity-100 rounded-sm text-xs h-8 w-12`}
                />
              </div>
            </RadioGroup>
            <Button type='submit'>
              <CirclePlus />ADICIONAR PRODUTO
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
