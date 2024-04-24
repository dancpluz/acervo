'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import cidades from '@/lib/cidades.json';
import { useState } from "react";
import TinyTable from "@/components/TinyTable";


type Fields = {
  [key: string]: {
    value: string;
    label: string;
    placeholder: string;
    validation: z.ZodType<any, any>;
    mask?: (string | RegExp)[];
    items?: (string[] | Record<string, string[]>);
  };
};

const fields: Fields = {
  name: {
    value: 'name',
    label: 'NOME OU RAZÃO SOCIAL*',
    placeholder: 'Ex. ACERVO MOBILIA COMERCIO VAREJISTA DE MOVEIS LTDA',
    validation: z.string().min(1, 'Campo não preenchido.').max(150, 'Máximo de 150 caracteres.'),
  },
  fantasy_name: {
    value: 'fantasy_name',
    label: 'NOME FANTASIA',
    placeholder: 'Ex. Acervo Mobilia',
    validation: z.string().max(150, 'Máximo de 150 caracteres.').optional().or(z.literal('')),
  },
  email: {
    value: 'email',
    label: 'E-MAIL*',
    placeholder: 'Ex. acervomobilia@gmail.com',
    validation: z.string().min(1, 'Campo não preenchido.').email('E-mail inválido.')
  },
  cnpj: {
    value: 'cnpj',
    label: 'CNPJ*',
    placeholder: 'Ex. 00.000.000/0000-00',
    validation: z.string().length(18, 'O CNPJ deve ter 14 números.').transform((e) => e.replace(/\D/g, "")),
    mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  },
  tax_payer: {
    value: 'tax_payer',
    label: 'CONTRIBUINTE*',
    placeholder: 'Selecione',
    validation: z.string().min(1, 'Selecione o tipo de contribuinte'),
    items: ["Não Informado","Contribuinte isento de inscrição no cadastro de contribuintes do ICMS", "Não Contribuinte, que pode ou não possuir inscrição estadual no cadastro ICMS"]
  },
  state_register: {
    value: 'state_register',
    label: 'INSCRIÇÃO ESTADUAL',
    placeholder: 'Ex. 149.679.601.869',
    validation: z.string().length(15, 'A inscrição estadual deve ter 12 números.').optional().or(z.literal('')).transform((e?: string) => (e || '').replace(/\D/g, "")),
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/],
  },
  municipal_register: {
    value: 'municipal_register',
    label: 'INSCRIÇÃO MUNICIPAL',
    placeholder: 'Ex. 149.679.601.869',
    validation: z.string().length(15, 'A inscrição municipal deve ter 12 números.').optional().or(z.literal('')).transform((e?: string) => (e || '').replace(/\D/g, "")),
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/],
  },
  pix: {
    value: 'pix',
    label: 'CHAVE PIX',
    placeholder: 'Ex. 6198765432',
    validation: z.optional(z.string()),
  },
  account: {
    value: 'account',
    label: 'CONTA',
    placeholder: 'Ex. 1751610-8',
    validation: z.string().length(9, 'A conta deve ter 7 números.').optional().or(z.literal('')).transform((e?: string) => (e || '').replace(/\D/g, "")),
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/],
  },
  agency: {
    value: 'agency',
    label: 'AGÊNCIA',
    placeholder: 'Ex. 1659',
    validation: z.coerce.number().optional().or(z.literal('')),
  },
  bank: {
    value: 'bank',
    label: 'BANCO',
    placeholder: 'Ex. Santander',
    validation: z.string().max(50, 'Máximo de 50 caracteres.').optional().or(z.literal('')),
  },
  cep: {
    value: 'cep',
    label: 'CEP',
    placeholder: 'Ex. 71234-567',
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
    validation: z.string().length(9, 'O CEP deve ter 8 números.').optional().or(z.literal('')).transform((e?: string) => (e || '').replace(/\D/g, "")),
  },
  address: {
    value: 'address',
    label: 'ENDEREÇO',
    placeholder: 'Ex. Quadra F Dois',
    validation: z.string().optional().or(z.literal('')),
  },
  number: {
    value: 'number',
    label: 'NÚMERO',
    placeholder: 'Ex. 123',
    validation: z.coerce.number().optional().or(z.literal('')),
  },
  state: {
    value: 'state',
    label: 'ESTADO',
    placeholder: 'Ex. DF',
    validation: z.string().optional().or(z.literal('')),
    items: Object.keys(cidades),
  },
  city: {
    value: 'city',
    label: 'CIDADE',
    placeholder: 'Ex. Brasília',
    validation: z.string().optional().or(z.literal('')),
    items: cidades,
  },
  complement: {
    value: 'complement',
    label: 'COMPLEMENTO',
    placeholder: ' Ex. Jardim Santos Dumont I',
    validation: z.string().optional().or(z.literal('')),
  },
}

const formSchema = z.object(Object.assign({}, ...Object.values(fields).map((e) => {
  const obj: { [key: string]: z.ZodType<any, any> } = {};
  obj[e.value] = e.validation;
  return obj;
})));

export default function FormFactory() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: Object.keys(fields).reduce((acc, key) => ({ ...acc, [key]: '' }), {}),
    shouldFocusError: false,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(cidades);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
  }

  const [selectedState, setSelectedState] = useState('');
  
  const divStyle = 'flex gap-2';
  
  return (
    <Tabs>
      <TabsList className='h-8'>
        <TabsTrigger className="text-sm" value="factory">FÁBRICAS</TabsTrigger>
        <TabsTrigger className="text-sm" value="representative">REPRESENTAÇÃO</TabsTrigger>
        <TabsTrigger className="text-sm"  value="other">OUTRAS INFORMAÇÕES</TabsTrigger>
      </TabsList>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TabsContent className='p-4 flex flex-col' value="factory">
            <div className='flex gap-8'>
              <div className='flex flex-1 flex-col gap-3'>
                <div className={divStyle}>
                  <FullField obj={fields.name} form={form}/>
                  <FullField obj={fields.fantasy_name} form={form} />
                </div>
                <div className={divStyle}>
                  <FullField obj={fields.email} form={form} />
                  <FullField obj={fields.cnpj} form={form} />
                </div>
                <div className={divStyle}>
                  <FullField obj={fields.tax_payer} form={form} select/>
                  <FullField obj={fields.state_register} form={form} />
                  <FullField obj={fields.municipal_register} form={form} />
                  </div>
                <div className={divStyle}>
                  <FullField obj={fields.pix} form={form} />
                  <FullField obj={fields.account} form={form} />
                </div>
                <div className={divStyle}>
                  <FullField obj={fields.agency} form={form} customClass={'grow-0 min-w-32'}/>
                  <FullField obj={fields.bank} form={form} customClass={'grow'}/>
                </div>
              </div>
              <div className='flex flex-1 flex-col gap-3'>
                <div className={divStyle}>
                  <FullField obj={fields.cep} form={form} customClass={'grow-0 min-w-36'}/>
                  <FullField obj={fields.address} form={form} customClass={'grow'}/>
                  <FullField obj={fields.number} form={form} customClass={'grow-0 min-w-36'} />
                </div>
                <div className={divStyle}>
                  <FullField obj={fields.state} form={form} search onSelect={setSelectedState} customClass={'grow-0 min-w-44'}/>
                  <FullField obj={fields.city} form={form} search unlock={selectedState} customClass={'grow-0 min-w-44'}/>
                  <FullField obj={fields.complement} form={form} customClass={'grow'}/>
                </div>
                <div>
                  <TinyTable />
                </div>
              </div>
            </div>
            <Button type="submit">Submit</Button>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}

export function FullField({ obj, form, customClass, select=false, search=false, onSelect, unlock }: { obj: typeof fields[keyof typeof fields], form: ReturnType<typeof useForm>, customClass?: string, select?: boolean, search?: boolean, onSelect?: (value: string) => void, unlock?: string }) {
  if (select && obj.items) {
    return (
      <FormField
        control={form.control}
        name={obj.value}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{obj.label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={obj.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {obj.items.map((item: string) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  if (search && obj.items) {
    const items = unlock===undefined ? obj.items : unlock==='' ? [] : obj.items[unlock];

    return (
      <FormField
        control={form.control}
        name={obj.value}
        render={({ field }) => (
          <FormItem className={customClass}>
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
                  <CommandEmpty>Não encontrado</CommandEmpty>
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
                              )}
                            />
                            {item}
                          </CommandItem>
                        )
                      )}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <FormField
      control={form.control}
      name={obj.value}
      render={({ field }) => (
        <FormItem className={customClass}>
          <FormLabel>{obj.label}</FormLabel>
          <FormControl>
            <Input mask={obj.mask} actions={{ isDirty: form.getFieldState(obj.value).isDirty, clear: () => form.resetField(obj.value, { keepError: false }) }} placeholder={obj.placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}