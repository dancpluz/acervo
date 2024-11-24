'use client'

import { formatFields } from "@/lib/utils";
import { dayMask, symbolCostMask } from "@/lib/masks";
import { useForm } from "react-hook-form";
import { complementFields } from '@/lib/fields';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "./ui/form";
import { InputField, PriceField, SelectField } from "@/components/AllFields";
import { useCRMContext } from "@/hooks/useCRMContext";
import { Button } from "@/components/ui/button";
import { CircleCheckBig } from 'lucide-react'
import { conformNumberToMask } from "@/lib/masks";
import { ComplementT } from "@/lib/types";

let [defaultValues, fieldValidations] = formatFields(complementFields);

export default function ComplementForm() {
  const { proposal, versionNum, updateComplement } = useCRMContext();

  if (proposal) {
    const version = proposal.versions.find((version) => version.num === versionNum);

    const complement = Object.assign({},version?.complement);
    
    if (complement) {
      complement.discount = conformNumberToMask(complement.discount.toString().replace('.', ','), symbolCostMask('-'));
      complement.freight = conformNumberToMask(complement.freight.toString().replace('.', ','), symbolCostMask('+'));
      complement.expiration = conformNumberToMask(complement.expiration, dayMask);
      complement.deadline = conformNumberToMask(complement.deadline, dayMask);
      defaultValues = complement;
    }
  }

  const form = useForm<z.infer<typeof fieldValidations>>({
    resolver: zodResolver(fieldValidations),
    defaultValues,
  })

  const onSubmit = async (data: ComplementT) => {
    await updateComplement(data);
  };

  const submitLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form className='flex flex-col gap-4 pt-4 pb-12' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2'>
          <PriceField path='' obj={complementFields.discount} />
          <PriceField path='' obj={complementFields.freight} />
          <PriceField path='' obj={complementFields.expiration} />
          <PriceField path='' obj={complementFields.deadline} />
        </div>
        <SelectField path='' obj={complementFields.payment_method} />
        <InputField path='' obj={complementFields.general_info} long />
        <InputField path='' obj={complementFields.info} long />
        <Button disabled={submitLoading} className='absolute bottom-0' type='submit'>
          <CircleCheckBig className='size-5' />
          SALVAR
        </Button>
      </form>
    </Form>    
  )
}

