import { Label } from "./ui/label"
import { CirclePlus, CircleX } from 'lucide-react';
import { FormDiv, FieldDiv } from "@/components/ui/div";
import { InputField, SearchField } from "./AllFields";
import { fillCepFields } from "@/lib/utils";
import { useState } from 'react';
import { UseFormReturn, UseFieldArrayRemove } from "react-hook-form";
import { FieldT, orderFields } from '@/lib/fields';

type Props = {
  title?: string;
  rows: Record<string, any>;
  prefix: string;
  disabled?: boolean;
  form: UseFormReturn;
  update: any;
  append: () => void;
  remove: UseFieldArrayRemove;
}

export default function OrderFields({ title, rows, form, append, remove, update, prefix, disabled }: Props) {

  const [selected, setSelected] = useState<Record<string, any> | null>(null);
  function formatOrderField(field : string) {if (selected) {return {...orderFields[field], value: `${prefix}.${selected.index}.${orderFields[field].value}` }}}

  return (
    <div className='flex gap-8'>
      <FormDiv>
        <Label className='text-base'>{title}</Label>
        <div className='flex flex-col'>
        {rows.length > 0 ? rows.map((row: Record<string, any>, index: number) => 
          <div key={row.id} className={`flex justify-between items-center px-2 py-1 outline-1 outline-secondary rounded-lg ${selected && selected.id === row.id ? 'outline' : 'cursor-pointer hover:outline'}`} onClick={() => setSelected({...row, index})}>
            <Label className='text-base'>{row.id_order === '' ? 'ID' : row.id_order}</Label>
            <div className='flex items-center gap-2'>
              <p className='text-sm text-tertiary'>{row.date === '' ? 'Data' : row.date}</p>
              {!disabled && <CircleX className='w-4 h-4 text-destructive cursor-pointer hover:opacity-70' onClick={(e) => { e.stopPropagation(); setSelected(null); remove(index)}} />}
            </div>
          </div>
        ) : 
          <div className={`flex justify-center px-2 py-1`}>
            <p className='text-base text-tertiary'>Sem pedidos...</p>
          </div>}
        </div>
        {disabled ?
          <div className='flex bg-transparent border-t border-secondary font-normal justify-center gap-2 items-center py-2'>
            <CirclePlus className='text-primary w-5 h-5' />
            Edite para Adicionar Pedidos
          </div> : 
        <div className='flex bg-transparent hover:bg-secondary/20 border-t border-secondary font-normal justify-center gap-2 cursor-pointer items-center py-2' onClick={() => append()}>
          <CirclePlus className='text-primary w-5 h-5' />
          Adicionar Pedido
        </div>}
      </FormDiv>
      <FormDiv>
        <Label className='text-base'>{selected ? selected.id_order ? `PEDIDO - ${selected.id_order}` : 'PREENCHA OS CAMPOS' : 'SELECIONE UM PEDIDO'}</Label>
        {selected && 
        <>
          <FieldDiv>
            <InputField obj={formatOrderField('id_order') as FieldT} form={form} disabled={disabled} update={update}/>
            <InputField obj={formatOrderField('date') as FieldT} form={form} disabled={disabled} update={update}/>
          </FieldDiv>
          <FieldDiv>
            <InputField obj={formatOrderField('cep') as FieldT} autofill={fillCepFields} form={form} customClass={'grow-0 min-w-36'} disabled={disabled} />
            <InputField obj={formatOrderField('address') as FieldT} form={form} customClass={'grow'} disabled={disabled} />
            <InputField obj={formatOrderField('number') as FieldT} form={form} customClass={'grow-0 min-w-36'} disabled={disabled} />
          </FieldDiv>
          <FieldDiv>
            <SearchField obj={formatOrderField('state') as FieldT} form={form} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} disabled={disabled} />
            <SearchField obj={formatOrderField('city') as FieldT} form={form} hint={'Ex. Brasília'} unlock={form.watch('state')} customClass={'grow-0 min-w-44'} disabled={disabled} />
            <InputField obj={formatOrderField('complement') as FieldT} form={form} customClass={'grow'} disabled={disabled} />
          </FieldDiv>
        </>}
      </FormDiv>
    </div>  
  )
}