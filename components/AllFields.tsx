'use client';

import cidades from '@/lib/cidades.json';
import { ChangeEvent } from 'react';
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageUp, Check, ChevronsUpDown, LoaderCircle, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldT, EnumFieldT } from "@/lib/fields";
import useGetEntities from '@/hooks/useGetEntities';
import { converters } from '@/lib/converters';
import { useState } from 'react';
import { Label } from './ui/label';
import Image from "next/image";
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from "@/components/ui/file-upload";
import { DateTimePicker } from './ui/datetime-picker';

export function SelectField({ path, customClass, obj, disabled }: { path?: string, customClass?: string, obj: EnumFieldT, disabled?: boolean }) {
  const fieldPath = path ? path + '.' + obj.value : obj.value;
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem className={customClass}>
          <FormMessage />
          <FormLabel>{obj.label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
            <FormControl>
              <SelectTrigger className={disabled ? 'disabled:cursor-default disabled:opacity-100' : ''} disabled={disabled}>
                <SelectValue placeholder={disabled ? '' : disabled ?? obj.placeholder}/>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {(obj.items).map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormItem>
      )} />
  );
}

export function ReferenceField<EntityT>({ path, refPath, obj, customClass, person, hint, onSelect, disabled }: { path?: string, refPath: string, obj: FieldT, customClass?: string, person?: boolean, hint: string, onSelect?: any, disabled?: boolean }) {
  
  const [data, loading, error] = useGetEntities<EntityT>(refPath, converters[obj.value]);

  const form = useFormContext();
  const fieldPath = path ? path + '.' + obj.value : obj.value;

  
  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem className={customClass}>
          <FormMessage />
          <FormLabel>{obj.label}</FormLabel>
          <Popover open={disabled ? false : undefined}>
            <PopoverTrigger className={disabled ? 'cursor-default' : ''} asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between pl-3 pr-3 relative overflow-hidden",
                    !field.value && "text-tertiary"
                  )}
                >
                  {loading ? <LoaderCircle className='text-primary h-5 w-5 animate-spin' /> : field.value
                    ? person ? data.find((item) => item.id === field.value)?.person?.label
                    :
                      data.find((item) => item.id === field.value)?.label
                    : disabled ?? obj.placeholder
                  }
                  <ChevronsUpDown className="absolute text-tertiary top-1/2 transform -translate-y-1/2 right-3 h-4 w-4 shrink-0" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder={hint} />
                <CommandEmpty>{loading ? 'Carregando...' : 'Não encontrado'}</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {data && data.map((item) => 
                        <CommandItem
                          value={item.id}
                          key={item.id}
                          onSelect={item.id === field.value ? () => {
                            form.setValue(fieldPath, ''); onSelect ? onSelect(undefined) : '';
                          } : () => {
                            form.setValue(fieldPath, item.id); onSelect ? onSelect(item) : '';
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )} />
                          {person ? item.person.label : item.label}
                        </CommandItem>
                      )
                    }
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )} />
  );
}

export function SearchField({ path, obj, customClass, hint, state, disabled }: { path?: string, obj: EnumFieldT, customClass?: string, hint: string, state?: string, disabled?: boolean }) {
  const fieldPath = path ? path + '.' + obj.value : obj.value;
  const form = useFormContext();
  
  if (state && state !== 'reset') {
    obj.items = (cidades as { [key: string] : string[] })[state].map((e: string) => ({ label: e, value: e }));
  }

  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem className={customClass}>
          <FormMessage />
          <FormLabel>{obj.label}</FormLabel>
          <Popover open={disabled ? false : undefined}>
            <PopoverTrigger className={disabled ? 'cursor-default' : ''} asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between pl-3 pr-3 relative overflow-hidden",
                    !field.value && "text-tertiary"
                  )}
                >
                  {field.value
                    ? obj.items.find(
                        ({ value }) => value === field.value
                      )?.label
                    : disabled ?? obj.placeholder}
                  <ChevronsUpDown className="absolute text-tertiary top-1/2 transform -translate-y-1/2 right-3 h-4 w-4 shrink-0" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder={hint} />
                <CommandEmpty>{obj.items.length === 0 && state !== undefined ? 'Selecione o campo anterior' : 'Não encontrado'}</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {obj.items.map(({ value, label }) => (
                      <CommandItem
                        value={value}
                        key={value}
                        onSelect={() => {
                          form.setValue(fieldPath, value);
                          state === 'reset' && form.resetField(path ? path + '.' + 'city' : 'city');
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )} />
                        {label}
                      </CommandItem>
                      )
                    )}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )} />
  );
}

export function ShowField({ text, placeholder, label }: {  text?: string, placeholder: string, label: string }) {
  return (
    <div className='flex flex-col gap-1'>
      <FormLabel>{label}</FormLabel>
      <span className={`${ text ? '' : 'text-tertiary' } flex h-10 w-full rounded-md border text-ellipsis border-alternate bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}>{text ? text : placeholder }</span>
    </div>
  )
}

export function InputField({ path, obj, autofill, customClass, percent, long, cm, disabled, update, onChange }: { path?: string, obj: FieldT, autofill?: (...args: any[]) => void, customClass?: string, percent?: boolean, long?: boolean, cm?: boolean, disabled?: boolean, update?: any, onChange?: ChangeEvent }) {
  const form = useFormContext();
  const fieldPath = path ? path + '.' + obj.value : obj.value;
  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem className={customClass}>
          <FormMessage />
          <FormLabel>{obj.label}</FormLabel>
          <FormControl>
            <div className='flex items-center gap-1'>
              <Input
              className={disabled ? 'disabled:cursor-default disabled:opacity-100' : ''} long={long} mask={obj.mask} actions={{ isDirty: form.getFieldState(fieldPath).isDirty, clear: () => form.resetField(fieldPath, { keepError: false, defaultValue: '' }), copy: () => navigator.clipboard.writeText(field.value) }} placeholder={disabled ? '' : obj.placeholder} {...field} onChange={(e) => {onChange ? onChange : field.onChange(e); autofill ? autofill(e.target.value, form, path + '.') : ''; update ? update(fieldPath, e.target.value) : ''}} disabled={disabled} />
              {percent ? <span className='text-tertiary'>%</span> : ''}
              {cm ? <span className='text-tertiary text-sm'>cm</span> : ''}
            </div>
          </FormControl>
        </FormItem>
      )} />
  )
}

export function TitleField({ path, obj, customClass, disabled }: { path?: string, obj: FieldT, autofill?: (...args: any[]) => void, customClass?: string, percent?: boolean, long?: boolean, disabled?: boolean, update?: any }) {
  const fieldPath = path ? path + '.' + obj.value : obj.value;
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem className={customClass + ' grow-0'}>
          <FormMessage className='-top-3' />
          <FormControl>
            <Input id='title' containerClassName='grow-0 items-center border-b border-secondary gap-2' className={'border-0 px-1 w-52 text-xl'} placeholder={disabled ? '' : obj.placeholder} {...field} disabled={disabled} icon={<Pencil className='cursor-pointer text-primary' onClick={() => document.getElementById("title")?.focus()} />} />
          </FormControl>
        </FormItem>
      )} />
  )
}

export function PersonTypeRadio({ defaultValue, setPersonType, disabled }: { defaultValue: string, setPersonType: (value: 'Física' | 'Jurídica') => void, disabled?: boolean }) {
  return (
    <RadioGroup className='flex-col p-0 border-0 gap-1 grow items-stretch max-w-56' onValueChange={setPersonType} defaultValue={defaultValue}>
      <Label>TIPO DE PESSOA</Label>
      <div className="flex gap-1 grow">
        <RadioGroupItem label="Física" value="Física" disabled={disabled} className={`data-[state=unchecked]:disabled:hover:bg-secondary transition-colors disabled:cursor-default disabled:opacity-100 w-full`}
          />
        <RadioGroupItem label="Jurídica" value="Jurídica" disabled={disabled} className={`data-[state=unchecked]:disabled:hover:bg-secondary transition-colors disabled:cursor-default disabled:opacity-100 w-full`}
          />
      </div>
    </RadioGroup>
  )
}

export function RadioField({ path, obj, optional, disabled, defaultValue }: { path?: string, obj: EnumFieldT, optional?: boolean, disabled?: boolean, defaultValue?: string }) {
  const form = useFormContext();
  const fieldPath = path ? path + '.' + obj.value : obj.value;
  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem>
          <FormMessage />
          <FormLabel>{obj.label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={defaultValue}
            >
              {(obj.items).map(({ value, label }) => {
                return (
                  <FormItem key={value} className={'flex-initial'}>
                    <FormControl>
                      <RadioGroupItem
                        disabled={disabled}
                        className={`data-[state=unchecked]:disabled:hover:bg-secondary transition-colors disabled:cursor-default disabled:opacity-100`}
                        value={value}
                        label={label}
                        clear={optional ? ((e: ChangeEvent<HTMLInputElement>) => {
                          if (e.target.dataset.state === 'checked') {
                            form.resetField(fieldPath, { keepError: false });
                            e.target.setAttribute('data-state', 'unchecked');
                          } else {
                            form.setValue(fieldPath, value);
                            e.target.setAttribute('data-state', 'checked');
                          }
                        }): undefined}
                      />
                    </FormControl>
                  </FormItem>
                );
              })}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export function DateTimeField({ path, obj }: { path?: string, obj: FieldT }) {
  const form = useFormContext();
  const fieldPath = path ? path + '.' + obj.value : obj.value;
  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{obj.label}</FormLabel>
          <FormControl>
            <DateTimePicker value={field.value} placeholder={obj.placeholder} onChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function ImageField({ obj, path }: { obj: FieldT, path: string }) {
  const form = useFormContext();

  const dropzone = {
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', ]
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  }

  const fieldPath = path ? path + '.' + obj.value : obj.value;
  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem>
          <FileUploader
            value={field.value}
            onValueChange={field.onChange}
            dropzoneOptions={dropzone}
            reSelect={true}
            className='hover:border-dashed relative overflow-hidden aspect-square border rounded-md border-secondary'
          >
            <FileInput className='absolute flex static justify-center items-center size-full'>
              <ImageUp className="size-8 text-primary" />
              <span className="sr-only">Envie uma imagem</span>
            </FileInput>
            {field.value && field.value.length > 0 && (
              <FileUploaderContent className="absolute size-full top-1/2 p-2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {field.value.length > 0 && 
                  <FileUploaderItem
                      index={0}
                      aria-roledescription={`Imagem contendo ${
                        field.value[0].name
                      }`}
                      className="p-0 size-full aspect-square"
                    >
                      <Image
                        src={URL.createObjectURL(field.value[0])}
                        alt={field.value[0].name}
                        className="object-cover rounded-md h-full w-full"
                        width={300}
                        height={300}
                      />
                    </FileUploaderItem>
                  }
              </FileUploaderContent>
            )}
          </FileUploader>
          <FormMessage className='top-2 right-auto left-2' />
        </FormItem>
      )}
    />
  )
}

export function SelectOtherField({ path, customClass, obj, disabled }: { path?: string, customClass?: string, obj: EnumFieldT, disabled?: boolean }) {
  const fieldPath = path ? path + '.' + obj.value : obj.value;
  const form = useFormContext();
  const [isOther, setIsOther] = useState(false)

  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem className={customClass}>
          <FormMessage />
          <FormLabel>{obj.label}</FormLabel>
          {isOther ?
            <Input className={disabled ? 'disabled:cursor-default disabled:opacity-100' : ''} actions={{ isDirty: true, clear: () => {form.resetField(fieldPath, { keepError: false, defaultValue: '' }); setIsOther(false)}, copy: () => navigator.clipboard.writeText(field.value) }} placeholder='Escreva outro' {...field}  disabled={disabled} />
          :
            <Select onValueChange={(val) => val === 'Outro' ? setIsOther(true) : field.onChange(val)} defaultValue={field.value} value={field.value}>
              <FormControl>
                <SelectTrigger className={disabled ? 'disabled:cursor-default disabled:opacity-100' : ''} disabled={disabled}>
                  <SelectValue placeholder={disabled ? '' : disabled ?? obj.placeholder}/>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(obj.items).map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                <SelectItem onClick={() => setIsOther(true)} value={'Outro'}>Outro</SelectItem>
              </SelectContent>
            </Select>
          }
        </FormItem>
      )} />
  );
}

export function PriceField({ path, obj, onChange }: { path?: string, obj: FieldT, onChange: () => void }) {
  const fieldPath = path ? path + '.' + obj.value : obj.value;
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem>
          <FormMessage className='z-10 right-2 top-1/2 -translate-y-1/2' />
          <FormControl>
            <div className='flex rounded-md border border-primary'>
              <FormLabel className='py-1 px-2 flex items-center text-tertiary text-base text-center border-r border-primary'>
                {obj.label}
              </FormLabel>
              <Input className={'h-auto py-1 px-2 text-base min-w-16 border-0'} mask={obj.mask} placeholder={obj.placeholder} {...field} onChange={(e) => { onChange ? onChange : field.onChange(e)}} />
            </div>
          </FormControl>
        </FormItem>
      )} />
  )
}