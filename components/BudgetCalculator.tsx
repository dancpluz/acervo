'use client'

import { useState, useEffect } from 'react';
import { BorderDiv } from "@/components/ui/div";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { formatPercent, unformatNumber, formatCurrency } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { FreightT, MarkupT } from "@/lib/types";
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
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { Copy } from 'lucide-react';

export default function BudgetCalculator({ factories, markups, freights }: { factories: any[], markups: MarkupT[], freights: FreightT[] }) {
  const [cost, setCost] = useState('');
  const [useDirectSale, setUseDirectSale] = useState<boolean>(false);
  const [selectedFactory, setSelectedFactory] = useState<{refs: { factory: string }, person: {info: {company_name: string, fantasy_name: string}}, direct_sale: number | '', discount: number | ''} | undefined>(undefined);
  const [selectedMarkup, setSelectedMarkup] = useState<MarkupT | undefined>(undefined);
  const [selectedFreight, setSelectedFreight] = useState<FreightT | undefined>(undefined);
  
  // useEffect(() => {
  //   console.log(selectedFreight)
  //   console.log(selectedMarkup)
  //   console.log(selectedFactory)
  // }, [selectedFreight, selectedFactory, selectedMarkup])
  
  const costMask = createNumberMask({
    prefix: 'R$ ',
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
  })

  function multiplyCost(value: number) {
    return unformatNumber(cost) * value;
  }

  const direct_sale = useDirectSale && selectedFactory?.direct_sale ? selectedFactory.direct_sale : 0;
  const discount = selectedFactory?.discount ? selectedFactory.discount : 0;
  const freight = selectedFreight?.fee ? selectedFreight.fee as number : 0;
  const costBase = cost && selectedMarkup ? (unformatNumber(cost) - multiplyCost(discount) + multiplyCost(direct_sale)) * Number(selectedMarkup['12x']) : 0
  const result = selectedMarkup ? {
    '12x': costBase * (1 + freight),
    '6x': (costBase * (1 + freight)) * (1 - Number(selectedMarkup['6x'])),
    'cash': (costBase * (1 + freight)) * (1 - Number(selectedMarkup['cash']))
  } : undefined

  return (
    <div className='flex gap-4'>
      <div className='flex flex-col gap-4 w-full'>
        <BorderDiv>
          <div className='flex flex-col gap-2 grow'>
            <h2 className='text-2xl'>Valor de Custo</h2>
            <Input id='cost' value={cost} mask={costMask} actions={{ clear: () => setCost(''), isDirty: true }} placeholder={'Preencha o valor de custo'} onChange={(e) => setCost(e.target.value) } />
          </div>
        </BorderDiv>
        <BorderDiv>
          <div className='flex flex-col gap-2 grow'>
            <div className='flex justify-between'>
              <h2 className='text-2xl'>Fábrica</h2>
              <span className='text-base text-tertiary'>{selectedFactory ? discount ? `Desconto de Fábrica: ${formatPercent(discount)} ${cost && `(-${formatCurrency(discount * unformatNumber(cost))})`}` : 'Essa fábrica não possui desconto' : ''}</span>
            </div>
            <Popover>
              <PopoverTrigger className={'cursor-default'} asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={`cursor-pointer justify-between pl-3 pr-3 relative overflow-hidden ${selectedFactory ?? 'text-tertiary'}`}
                >
                  {selectedFactory ? `${selectedFactory.person.info.company_name} ${selectedFactory.person.info.fantasy_name ? '- ' + selectedFactory.person.info.fantasy_name : ''}` : 'Selecione uma fábrica'}
                  <ChevronsUpDown className="absolute text-tertiary top-1/2 transform -translate-y-1/2 right-3 h-4 w-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput className='text-foreground' placeholder={'Ex. Punto'} />
                  <CommandEmpty>Não encontrado</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {factories.map((factory) =>
                        <CommandItem
                          value={JSON.stringify(factory)}
                          key={factory.person.info.company_name}
                          onSelect={(value) => setSelectedFactory(JSON.parse(value))}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 opacity-0 ${selectedFactory && selectedFactory.refs.factory === factory.refs.factory ? 'opacity-100' : ''}`} />
                          {`${factory.person.info.company_name} ${factory.person.info.fantasy_name ? '- ' + factory.person.info.fantasy_name : ''}`}
                        </CommandItem>
                      )
                      }
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <div className='flex justify-between items-center'>
              <RadioGroup disabled={selectedFactory ? selectedFactory.direct_sale === '' : undefined} className='flex p-0 border-0 gap-2 items-center' defaultValue={useDirectSale ? 'Sim' : 'Não'}>
                <Label>VENDA DIRETA?</Label>
                <div className="flex gap-1">
                  <RadioGroupItem value='Sim' label='Sim'
                    className={`data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-background data-[state=unchecked]:bg-background transition-colors disabled:cursor-default disabled:opacity-100 h-10 w-16`}
                    onClick={() => { setUseDirectSale(true) }} />
                  <RadioGroupItem value="Não" label="Não"
                    className={`data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-background data-[state=unchecked]:bg-background transition-colors disabled:cursor-default disabled:opacity-100 h-10 w-16`}
                    onClick={() => { setUseDirectSale(false) }} />
                </div>
              </RadioGroup>
              <span className='text-base text-tertiary'>{selectedFactory ? selectedFactory.direct_sale ? `Venda Direta: ${formatPercent(selectedFactory.direct_sale)} ${cost && `(+${formatCurrency(selectedFactory.direct_sale * unformatNumber(cost))})`}` : 'Essa fábrica não possui venda direta' : ''}</span>
            </div>
          </div>
        </BorderDiv>
        <BorderDiv>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl'>Marcação</h2>
            <p className='text-base text-tertiary whitespace-nowrap text-ellipsis'>{selectedMarkup?.observation ? `Observação: ${selectedMarkup.observation}` : ''}</p>
          </div>
          <Select onValueChange={(markup) => setSelectedMarkup(JSON.parse(markup))}>
            <SelectTrigger>
              <SelectValue placeholder='Selecione uma marcação' />
            </SelectTrigger>
            <SelectContent>
              {(markups).map((markup) => <SelectItem key={markup.name} value={JSON.stringify(markup)}>{markup.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className='flex grow'>
            <div className='flex flex-col grow items-center'>
              <h3 className='text-base'>12x</h3>
              <p className='text-sm text-tertiary'>{selectedMarkup ? selectedMarkup['12x'] + 'x' : '-'}</p>
              <p className='text-sm text-tertiary'>{costBase ? formatCurrency(costBase) : ''}</p>
            </div>
            <div className='flex flex-col grow items-center border-r border-l border-secondary'>
              <h3 className='text-base'>6x</h3>
              <p className='text-sm text-tertiary'>{selectedMarkup ? formatPercent(selectedMarkup['6x'] as number) : '-'}</p>
              <p className='text-sm text-tertiary'>{selectedMarkup && cost ? '-' + formatCurrency(unformatNumber(cost) * (selectedMarkup['6x'] as number + freight)) : ''}</p>
            </div>
            <div className='flex flex-col grow items-center'>
              <h3 className='text-base'>à vista</h3>
              <p className='text-sm text-tertiary'>{selectedMarkup ? formatPercent(selectedMarkup['cash'] as number) : '-'}</p>
              <p className='text-sm text-tertiary'>{selectedMarkup && cost ? '-' + formatCurrency(unformatNumber(cost) * (selectedMarkup['cash'] as number + freight)) : ''}</p>
            </div>
          </div>
        </BorderDiv>
        <BorderDiv>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl'>Frete</h2>
            <p className='text-base text-tertiary'>{selectedFreight && costBase ? `(+${formatCurrency(costBase * freight)})` : ''}</p>
          </div>
          <div className='flex w-full flex-wrap gap-2'>
            {freights.map((fre) => 
              <div key={fre.region} onClick={() => setSelectedFreight(fre)} className={`flex border transition-colors rounded-lg cursor-pointer h-10 border-secondary gap-1 items-center px-2 ${fre === selectedFreight ? 'bg-primary border-primary text-background [&>div]:text-foreground [&>div]:bg-background' : 'hover:bg-secondary/20'}`}>
                {fre.region}
                <div className='bg-secondary transition-colors rounded-sm px-1 text-sm'>
                  {fre.fee === 0 ? 'Grátis' : formatPercent(fre.fee as number)}
                </div>
              </div>
            )}
          </div>
        </BorderDiv>
      </div>
      <div className='flex flex-col gap-4 w-full'>
        <BorderDiv className='gap-2'>
          <div className='flex relative items-center justify-between'>
            <h2 className='text-2xl'>Resultado</h2>
            {result && <button type='button' onClick={() => navigator.clipboard.writeText(`${formatCurrency(result['12x'])} em 12x\n${formatCurrency(result['6x'])} em 6x\n${formatCurrency(result['cash'])} à vista`)} className='rounded -mx-2 p-2 hover:bg-alternate/20 absolute transform -translate-y-1/2 top-1/2 right-1'>
              <Copy className='text-primary' />
            </button>}
          </div>
          <div className='flex justify-between'>
            <div className='flex gap-3 items-center'>
              <p className='text-2xl'>12x</p>
              <p className='text-lg text-tertiary'>{result ? `(${formatCurrency(result['12x'] / 12)}/parcela)` : ''}</p>
            </div>
            <h3 className='text-3xl text-primary'>{result ? formatCurrency(result['12x']) : '-'}</h3>
          </div>
          <div className='flex justify-between'>
            <div className='flex gap-3 items-center'>
              <p className='text-2xl'>6x</p>
              <p className='text-lg text-tertiary'>{result ? `(${formatCurrency(result['12x'] / 6)}/parcela)` : ''}</p>
            </div>
            <h3 className='text-3xl text-primary'>{result ? formatCurrency(result['6x']) : '-'}</h3>
          </div>
          <div className='flex justify-between'>
            <div className='flex gap-3 items-center'>
              <p className='text-2xl'>à vista</p>
            </div>
            <h3 className='text-3xl text-primary'>{result ? formatCurrency(result['cash']) : '-'}</h3>
          </div>
        </BorderDiv>
      </div>
    </div>
  )
}