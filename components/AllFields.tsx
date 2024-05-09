'use client';
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldT, EnumFieldT } from "@/lib/fields";
import { Dispatch, ChangeEvent } from "react";

export function SelectField({ form, obj }: { form: ReturnType<typeof useForm>, obj: FieldT }) {
  return (
    <FormField
      control={form.control}
      name={obj.value}
      render={({ field }) => (
        <FormItem>
          <FormMessage />
          <FormLabel>{obj.label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={obj.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {(obj.items as string[]).map((item: string) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormItem>
      )} />
  );
}

export function SearchField({ form, obj, customClass, hint, unlock }: { form: ReturnType<typeof useForm>, obj: FieldT, customClass?: string, hint: string, unlock?: string }) {
  let items: any[] = [];
  if (unlock === undefined) {
    // Search with items defined, no Unlock
    items = obj.items as string[];
  } else {
    // If there is an unlock, check if the values are there
    if (obj.items) {
      // If there is unlock set the icons as Objects
      if (unlock !== '') {
        items = (obj.items as { [key: string]: string[]; })[unlock];
      }
    }
  }

  return (
    <FormField
      control={form.control}
      name={obj.value}
      render={({ field }) => (
        <FormItem className={customClass}>
          <FormMessage />
          <FormLabel>{obj.label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between pl-3",
                    !field.value && "text-tertiary"
                  )}
                >
                  {field.value
                    ? items.find(
                      (item: string) => item === field.value
                    )
                    : obj.placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder={hint} />
                <CommandEmpty>{items.length === 0 && unlock !== undefined ? 'Selecione o campo anterior' : 'Não encontrado'}</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {items ? items.map((item: string) => (
                      <CommandItem
                        value={item}
                        key={item}
                        onSelect={() => {
                          form.setValue(obj.value, item);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )} />
                        {item}
                      </CommandItem>
                    )
                    ) : ''}
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

export function InputField({ form, obj, autofill, setSelectedState=()=>console.log('t'), customClass, percent, long, disabled }: { form: ReturnType<typeof useForm>, obj: FieldT, autofill?: (...args: any[]) => void, setSelectedState?: Dispatch<React.SetStateAction<string>>, customClass?: string, percent?: boolean, long?: boolean, disabled?: boolean }) {
  return (
    <FormField
      control={form.control}
      name={obj.value}
      render={({ field }) => (
        <FormItem className={customClass}>
          <FormMessage />
          <FormLabel>{obj.label}</FormLabel>
          <FormControl>
            <div className='flex items-center gap-1'>
              <Input long={long} mask={obj.mask} actions={{ isDirty: form.getFieldState(obj.value).isDirty, clear: () => form.resetField(obj.value, { keepError: false }), copy: () => navigator.clipboard.writeText(field.value) }} placeholder={obj.placeholder} {...field} onChange={(e) => {field.onChange(e); autofill ? autofill(e.target.value, setSelectedState,form) : ''}} disabled={disabled} />
              {percent ? <span className='text-tertiary'>%</span> : ''}
            </div>
          </FormControl>
        </FormItem>
      )} />
  )
}

export function RadioField({ form, obj, optional }: { form: ReturnType<typeof useForm>, obj: EnumFieldT, optional?: boolean }) {
  return (
    <FormField
      control={form.control}
      name={obj.value}
      render={({ field }) => (
        <FormItem>
          <FormMessage />
          <FormLabel>{obj.label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              {obj.items && (obj.items).map((item) => {
                return (
                  <FormItem key={item} className="flex-initial">
                    <FormControl>
                      <RadioGroupItem
                        value={item}
                        clear={optional ? ((e: ChangeEvent<HTMLInputElement>) => {
                          if (e.target.dataset.state === 'checked') {
                            form.resetField(obj.value, { keepError: false });
                            e.target.setAttribute('data-state', 'unchecked');
                          } else {
                            form.setValue(obj.value, item);
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