import { Label } from "./ui/label"
import { CirclePlus, CircleX } from 'lucide-react';
import { FormDiv, FieldDiv, TabDiv } from "@/components/ui/div";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useState } from 'react';
import { UseFormReturn, UseFieldArrayRemove } from "react-hook-form";
import { TableFieldT } from '@/lib/fields';

type Props = {
  title?: string;
  fields: TableFieldT[];
  rows: Record<string, any>;
  prefix: string;
  disabled?: boolean;
  form: UseFormReturn;
  update: any;
  append: () => void;
  remove: UseFieldArrayRemove;
}

export default function TeamFields({ title, fields, rows, form, append, remove, update, prefix, disabled }: Props) {
  
  const [selected, setSelected] = useState<Record<string, any> | null>(null);

  return (
    <div className='flex gap-8'>
      <FormDiv>
        <Label className='text-base'>{title}</Label>
        <div className='flex flex-col'>
        {rows.map((row: Record<string, any>, index: number) => 
          <div key={row.id} className={`flex justify-between items-center px-2 py-1 outline-1 outline-secondary rounded-lg ${selected && selected.id === row.id ? 'outline' : 'cursor-pointer hover:outline'}`} onClick={() => setSelected({...row, index})}>
            <Label className='text-base'>{row.name === '' ? 'Nome' : row.name}</Label>
            <div className='flex items-center gap-2'>
              <p className='text-sm text-tertiary'>{row.role === '' ? 'Cargo' : row.role}</p>
              <CircleX className='w-4 h-4 text-destructive cursor-pointer hover:opacity-70' onClick={(e) => { e.stopPropagation(); setSelected(null); remove(index)}} />
            </div>
          </div>
        )}
        </div>
        <div className='flex bg-transparent hover:bg-secondary/20 border-t border-secondary font-normal justify-center gap-2 cursor-pointer items-center py-2' onClick={() => append()}>
          <CirclePlus className='text-primary w-5 h-5' />
          Incluir funcionário
        </div>
      </FormDiv>
      <FormDiv>
        <Label className='text-base'>{selected ? selected.name ? selected.name.toUpperCase() : 'PREENCHA OS CAMPOS' : 'SELECIONE UM FUNCIONÁRIO'}</Label>
        <FieldDiv className='grid grid-cols-2'>
        {selected && fields.map((obj) => 
          <FormField
            key={`${prefix}.${selected.index}.${obj.value}`}
            control={form.control}
            name={`${prefix}.${selected.index}.${obj.value}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{obj.label}</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input className={disabled ? 'disabled:cursor-default disabled:opacity-100' : ''} mask={obj.mask} actions={{ isDirty: form.getFieldState(obj.value).isDirty, clear: () => form.resetField(obj.value, { keepError: false }), copy: () => navigator.clipboard.writeText(field.value) }} placeholder={disabled ? '' : obj.placeholder} {...field} onChange={(e) => { field.onChange(e); update(`${prefix}.${selected.index}.${obj.value}`, e.target.value)}} disabled={disabled} />
                </FormControl>
              </FormItem>
            )} />
          )}
        </FieldDiv>
      </FormDiv>
    </div>  
  )
}