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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  obj: any;
  form: ReturnType<typeof useForm>;
  customClass?: string;
  select?: boolean;
  search?: boolean;
  onSelect?: (value: string) => void;
  unlock?: any;
}

export function FullField({ obj, form, customClass, select = false, search = false, onSelect, unlock }: Props) {
  if (select && obj.items) {
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

  if (search && obj.items) {
    let items: any[] = [];
    if (unlock === undefined) {
      items = obj.items as string[];
    } else {
      if (obj.items) {
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
                      "justify-between",
                      !field.value && "text-tertiary"
                    )}
                  >
                    {field.value
                      ? items.find(
                        (item: string) => item === field.value
                      )
                      : `Selecione ${obj.label.toLowerCase()}`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0 max-w-44">
                <Command>
                  <CommandInput placeholder={obj.placeholder} />
                  <CommandEmpty>{items ? 'Selecione o campo anterior' : 'Não encontrado'}</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {items.map((item: string) => (
                        <CommandItem
                          value={item}
                          key={item}
                          onSelect={() => {
                            form.setValue(obj.value, item);
                            onSelect ? onSelect(item) : '';
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

  return (
    <FormField
      control={form.control}
      name={obj.value}
      render={({ field }) => (
        <FormItem className={customClass}>
          <FormMessage />
          <FormLabel>{obj.label}</FormLabel>
          <FormControl>
            <Input mask={obj.mask} actions={{ isDirty: form.getFieldState(obj.value).isDirty, clear: () => form.resetField(obj.value, { keepError: false }) }} placeholder={obj.placeholder} {...field} />
          </FormControl>
        </FormItem>
      )} />
  );
}
