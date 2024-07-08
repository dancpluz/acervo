'use client';

import cidades from '@/lib/cidades.json';
import { useEffect, useState, ChangeEvent } from 'react';
import { useForm } from "react-hook-form";
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
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldT, EnumFieldT } from "@/lib/fields";
import { ReferenceT } from "@/lib/types";
import { getEntitiesOptions } from "@/lib/dbRead";

export function SelectField({ path, form, obj, disabled }: { path?: string, form: ReturnType<typeof useForm>, obj: EnumFieldT, disabled?: boolean }) {
  const fieldPath = path ? path + '.' + obj.value : obj.value;
  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem>
          <FormMessage />
          <FormLabel>{obj.label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className={disabled ? 'disabled:cursor-default disabled:opacity-100' : ''} disabled={disabled}>
                <SelectValue placeholder={disabled ? '' : disabled ?? obj.placeholder} />
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

export function ReferenceField({ path, form, obj, customClass, hint, setReferenceInfo, disabled }: { path?: string, form: ReturnType<typeof useForm>, obj: FieldT, customClass?: string, hint: string, setReferenceInfo: React.Dispatch<React.SetStateAction<ReferenceT | undefined>>, disabled?: boolean }) {
  const [items, setItems] = useState<ReferenceT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    getEntitiesOptions(obj.value).then((data) => { setItems(data), setIsLoading(false) });
  }, [obj.value])

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
                  {isLoading ? <LoaderCircle className='text-primary h-5 w-5 animate-spin' /> : field.value
                    ? items.find((item) => item.ref === field.value)?.label
                    : disabled ?? obj.placeholder
                  }
                  <ChevronsUpDown className="absolute text-tertiary top-1/2 transform -translate-y-1/2 right-3 h-4 w-4 shrink-0" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder={hint} />
                <CommandEmpty>{isLoading ? 'Carregando...' : 'Não encontrado'}</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {items.map((item) => 
                        <CommandItem
                          value={item.label}
                          key={item.ref}
                          onSelect={item.ref === field.value ? () => {
                            form.setValue(fieldPath, ''); setReferenceInfo(undefined);
                          } : () => {
                            form.setValue(fieldPath, item.ref); setReferenceInfo(item);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.ref === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )} />
                          {item.label}
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

export function SearchField({ path, form, obj, customClass, hint, state, disabled }: { path?: string, form: ReturnType<typeof useForm>, obj: EnumFieldT, customClass?: string, hint: string, state?: string, disabled?: boolean }) {
  const fieldPath = path ? path + '.' + obj.value : obj.value;
  
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

export function InputField({ path, form, obj, autofill, customClass, percent, long, disabled, update }: { path?: string, form: ReturnType<typeof useForm>, obj: FieldT, autofill?: (...args: any[]) => void, customClass?: string, percent?: boolean, long?: boolean, disabled?: boolean, update?: any }) {
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
              <Input className={disabled ? 'disabled:cursor-default disabled:opacity-100' : ''} long={long} mask={obj.mask} actions={{ isDirty: form.getFieldState(fieldPath).isDirty, clear: () => form.resetField(fieldPath, { keepError: false, defaultValue: '' }), copy: () => navigator.clipboard.writeText(field.value) }} placeholder={disabled ? '' : obj.placeholder} {...field} onChange={(e) => {field.onChange(e); autofill ? autofill(e.target.value, form, path + '.') : ''; update ? update(fieldPath, e.target.value) : ''}} disabled={disabled} />
              {percent ? <span className='text-tertiary'>%</span> : ''}
            </div>
          </FormControl>
        </FormItem>
      )} />
  )
}

export function RadioField({ path, form, obj, optional, disabled, defaultValue }: { path?: string, form: ReturnType<typeof useForm>, obj: EnumFieldT, optional?: boolean, disabled?: boolean, defaultValue?: string }) {
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