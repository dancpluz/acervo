'use client'

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { finishFields, productFields } from "@/lib/fields";
import { formatFields, stringToSlug, unformatNumber, formatCurrency } from "@/lib/utils";
import useCRMFormActions from "@/hooks/useCRMFormActions";
import { ReferenceField, InputField, SelectOtherField, SelectField, ImageField } from "@/components/AllFields";
import { Form } from "@/components/ui/form";
import { FieldDiv } from "@/components/ui/div";
import { Button } from "@/components/ui/button";
import { CirclePlus } from 'lucide-react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import db from '@/lib/firebase';
import { format } from 'date-fns';
import { FactoryT, MarkupT, PersonT, ProductT } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import PriceBox from "@/components/PriceBox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { conformNumberToMask, costMask } from "@/lib/masks";

let [defaultValues, fieldValidations] = formatFields(productFields);
defaultValues['quantity'] = '1';
defaultValues['enabled'] = true;

export default function ProductForm({ data, setPopupOpen } : { data?: any, setPopupOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [shard, loading, error] = useDocumentData(doc(db, 'shard', 'product'));
  
  const [referenceInfo, setReferenceInfo] = useState<{ [key: string]: '' | FactoryT | MarkupT }>({ factory: '', markup: '' });
  
  if (data) {
    const values = Object.assign({},data)
    
    const { factory, freight, markup, quantity,  cost, finish } = values as ProductT;

    defaultValues = values;
    defaultValues.factory = factory?.id || '';
    defaultValues.freight = freight?.id || '';
    defaultValues.markup = markup?.id || '';
    defaultValues.cost = conformNumberToMask(cost.toString().replace('.', ','), costMask);
    
    const { depth, width, height } = finish
    defaultValues.finish.depth = depth.toString()
    defaultValues.finish.width = width.toString()
    defaultValues.finish.height = height.toString()
    defaultValues.quantity = quantity.toString()
  }
  
  const form = useForm<z.infer<typeof fieldValidations>>({
    resolver: zodResolver(fieldValidations),
    defaultValues,
    shouldFocusError: false,
  })

  const setFunctions = async () => {
    const { factory, markup, image } = data as ProductT;
    if (factory) {
      setReferenceInfo((prev) => ({...prev, factory: factory as FactoryT}));
    }
    if (markup) {
      setReferenceInfo((prev) => ({ ...prev, markup: markup as MarkupT}));
    }
    if (image) {
      const response = await fetch(image.path);
      const blob = await response.blob();

      // Extract name from URL or give it a default name
      const name = image.path.split('/').pop() || 'image.jpg';

      // Create a File object
      const fileObject = new File([blob], name, {
        type: blob.type,
        lastModified: Date.now(),
      });

      form.setValue('image', [fileObject])
    }
  }
  
  const selectedMarkup = referenceInfo.markup as MarkupT;
  const selectedFactory = referenceInfo.factory as FactoryT;
  
  const today = new Date();
  const id = data ? data.id : `${loading || !shard ? '' : shard.index + 1}${form.watch('category') ? '_' + stringToSlug(form.watch('category') || '') : ''}${form.watch('name') ? '_' + stringToSlug(form.watch('name') || '') : ''}${selectedFactory ? '_' + stringToSlug((selectedFactory.person as PersonT).label || '') : ''}_${format(today, "dd-MM-yyyy")}`;
  
  const markup12 = selectedMarkup && form.watch('cost') ? unformatNumber(selectedMarkup['12x'] as string) * unformatNumber(form.watch('cost')) : '';
  const markup6 = selectedMarkup && form.watch('cost') ? Number(markup12) * (1 - unformatNumber(selectedMarkup['6x'] as string, true)) : '';
  const markupCash = selectedMarkup && form.watch('cost') ? Number(markup12) * (1 - unformatNumber(selectedMarkup['cash'] as string, true)) : '';

  const {
    productSubmit,
    saveProduct,
    setSaveProduct,
  } = useCRMFormActions(id, setPopupOpen, data, setFunctions);

  // const checkPaths = [['person', 'info', 'fantasy_name'], ['person', 'info', 'company_name'], ['person', 'info', 'cnpj'], ['person', 'info', 'info_email']]

  useEffect(() => {
    if (!loading && shard && !data) {
      form.setValue('num', shard.index + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, shard, loading]);

  const submitLoading = form.formState.isSubmitting;

  return (
    <div className='flex flex-col bg-background gap-4 p-4 rounded-lg'>
      <Form {...form}>
        <form className='flex flex-col gap-4' onSubmit={form.handleSubmit(productSubmit)}>
          <span className='text-sm text-tertiary'>{id}</span>
          <div className='flex gap-4'>
            <div className='flex flex-col gap-4 w-[60%]'>
              <FieldDiv>
                <InputField path='' obj={productFields.name} />
                <SelectField path='' obj={productFields.ambient} />
              </FieldDiv>
              <InputField path='finish' obj={finishFields.frame} />
              <InputField path='finish' obj={finishFields.fabric} />
              <FieldDiv>
                <InputField path='finish' obj={finishFields.width} cm />
                <InputField path='finish' obj={finishFields.depth} cm />
                <InputField path='finish' obj={finishFields.height} cm />
              </FieldDiv>
              <InputField path='' obj={productFields.observations} long />
              <FieldDiv>
                <ReferenceField obj={productFields.factory} refPath='factory' onSelect={(e: FactoryT) => setReferenceInfo((prev) => ({...prev, factory: e}))} hint={'Ex. Punto'} person />
                <ReferenceField obj={productFields.freight} refPath='config, markup_freight, freight' hint={'Ex. Punto'} />
              </FieldDiv>
              <FieldDiv>
                <InputField path='' obj={productFields.cost} />
                <ReferenceField obj={productFields.markup} refPath='config, markup_freight, markup' onSelect={(e: MarkupT ) => setReferenceInfo((prev) => ({...prev, markup: e}))} hint={'Ex. Punto'} />
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
                <InputField path='' obj={productFields.quantity} />
                <SelectOtherField customClass='grow-0 min-w-52' path='' obj={productFields.category} />
              </FieldDiv>
              <InputField customClass='grow-0' path='finish' obj={finishFields.extra} />
              <InputField customClass='grow-0' path='finish' obj={finishFields.designer} />
              <FieldDiv>
                <InputField path='finish' obj={finishFields.link_finishes} />
                <InputField path='finish' obj={finishFields.link_3d} />
              </FieldDiv>
              <ImageField path='' obj={productFields.image} />
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
            <Button disabled={submitLoading || loading} type='submit'>
              <CirclePlus />{data ? 'EDITAR' : 'ADICIONAR'} PRODUTO
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
