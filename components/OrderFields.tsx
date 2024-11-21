import { Label } from "./ui/label"
import { CirclePlus, CircleX } from 'lucide-react';
import { FormDiv, FieldDiv } from "@/components/ui/div";
import { InputField, SearchField } from "./AllFields";
import { fillCepFields } from "@/lib/utils";
import { useState, useEffect } from 'react';
import { UseFormReturn, UseFieldArrayRemove } from "react-hook-form";
import { EnumFieldT, FieldT, orderFields } from '@/lib/fields';

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
  const [selected, setSelected] = useState<{ [key:string]: string | number } | null>(null);
  const path = selected ? `${prefix}.${selected.index}` : ''
  
  useEffect(() => {
    const setSelectedValue = (name: string) => form.setValue(path + '.' + name, form.getValues(path + '.' + name), { shouldDirty: true })

    if (selected) {
      Object.keys(orderFields).forEach((key) => setSelectedValue(key))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  return (
    <div className='flex gap-8'>
      <FormDiv>
        <Label className='text-base'>{title}</Label>
        <div className='flex flex-col'>
        {rows.length > 0 ? rows.map((row: { [key:string]: string }, index: number) => 
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
        <div className='flex bg-transparent transition-colors hover:bg-secondary/20 border-t border-secondary font-normal justify-center gap-2 cursor-pointer items-center py-2' onClick={append}>
          <CirclePlus className='text-primary w-5 h-5' />
          Adicionar Pedido
        </div>}
      </FormDiv>
      <FormDiv>
        <Label className='text-base'>{selected ? selected.id_order ? `PEDIDO - ${selected.id_order}` : 'PREENCHA OS CAMPOS' : 'SELECIONE UM PEDIDO'}</Label>
        {selected && 
        <>
          <FieldDiv>
            <InputField path={path} obj={orderFields.id_order as FieldT} disabled={disabled} update={update}/>
            <InputField path={path} obj={orderFields.date as FieldT} disabled={disabled} update={update}/>
          </FieldDiv>
          <FieldDiv>
            <InputField path={path} obj={orderFields.cep as FieldT} autofill={fillCepFields} customClass={'grow-0 min-w-36'} disabled={disabled} />
            <InputField path={path} obj={orderFields.address as FieldT} customClass={'grow'} disabled={disabled} />
            <InputField path={path} obj={orderFields.number as FieldT} customClass={'grow-0 min-w-36'} disabled={disabled} />
          </FieldDiv>
          <FieldDiv>
            <SearchField path={path} obj={orderFields.state as EnumFieldT} hint={'Ex. DF'} customClass={'grow-0 min-w-44'} state='reset' disabled={disabled} />
            <SearchField path={path} obj={orderFields.city as EnumFieldT} hint={'Ex. Brasília'} state={form.watch(path + '.state')} customClass={'grow-0 min-w-44'} disabled={disabled} />
            <InputField path={path} obj={orderFields.complement as FieldT} customClass={'grow'} disabled={disabled} />
          </FieldDiv>
        </>}
      </FormDiv>
    </div>  
  )
}