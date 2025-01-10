'use client'

import { useEffect, useState } from 'react';
import { BorderDiv } from "@/components/ui/div";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { formatPercent, calculateCostMarkup, unformatNumber, formatCurrency } from "@/lib/utils";
import { costMask } from "@/lib/masks";
import { Label } from "@/components/ui/label";
import { FactoryT, FreightT, MarkupT, ProspectionT, PersonT } from "@/lib/types";
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
import { Check, ChevronsUpDown, Copy } from 'lucide-react';
import SelectableChips from '@/components/SelectableChips';
import useGetEntities from '@/hooks/useGetEntities';
import { converters } from './../lib/converters';

export default function BudgetCalculator() {
  const [factories, factoriesLoading, factoriesError] = useGetEntities('factory', converters['factory']);
  const [markups, markupsLoading, markupsError] = useGetEntities('config, markup_freight, markup', converters['markup']);
  const [freights, freightsLoading, freightsError] = useGetEntities('config, markup_freight, freight', converters['freight']);
  const [prospections, prospectionsLoading, prospectionsError] = useGetEntities('config, markup_freight, prospection', converters['prospection']);
  const loading = factoriesLoading || markupsLoading || freightsLoading || prospectionsLoading;
  const error = factoriesError || markupsError || freightsError || prospectionsError;

  const [cost, setCost] = useState('');
  const [useDirectSale, setUseDirectSale] = useState<boolean>(false);

  const [referenceInfo, setReferenceInfo] = useState<{ [key: string]: '' | FactoryT | FreightT | MarkupT | ProspectionT }>({ factory: '',freight: '', markup: '', prospection: '' });

  const updateReferenceInfo = (key: string, value: '' | FreightT | MarkupT | ProspectionT) => {
    setReferenceInfo((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const selectedFactory = referenceInfo.factory as FactoryT;
  const selectedFreight = referenceInfo.freight as FreightT;
  const selectedMarkup = referenceInfo.markup as MarkupT;
  const selectedProspection = referenceInfo.prospection as ProspectionT;

  const discount = selectedFactory?.discount ? selectedFactory.discount : 0;
  const freight = selectedFreight?.fee ? unformatNumber(selectedFreight.fee as string, true) : 0;
  const prospection = selectedProspection?.tax ? unformatNumber(selectedProspection.tax as string, true) : 0;

  const result = calculateCostMarkup({ cost, selectedFactory, selectedFreight, selectedMarkup, selectedProspection, useDirectSale });

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
                  {selectedFactory ? (selectedFactory.person as PersonT).label : 'Selecione uma fábrica'}
                  <ChevronsUpDown className="absolute text-tertiary top-1/2 transform -translate-y-1/2 right-3 h-4 w-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput className='text-foreground' placeholder={'Ex. Punto'} />
                  <CommandEmpty>Não encontrado</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {factories && factories.map((factory) =>
                        <CommandItem
                          value={JSON.stringify(factory)}
                          key={factory.person.info.company_name}
                          onSelect={(value) => updateReferenceInfo('factory',JSON.parse(value))}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 opacity-0 ${selectedFactory && selectedFactory.id === factory.id ? 'opacity-100' : ''}`} />
                          {factory.person.label}
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
              <span className='text-base text-tertiary'>{selectedFactory ? selectedFactory.direct_sale ? `Venda Direta: ${formatPercent(selectedFactory.direct_sale)} ${cost `(+${formatCurrency(selectedFactory.direct_sale * unformatNumber(cost))})`}` : 'Essa fábrica não possui venda direta' : ''}</span>
            </div>
          </div>
        </BorderDiv>
        <BorderDiv>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl'>Marcação</h2>
            <p className='text-base text-tertiary whitespace-nowrap text-ellipsis'>{selectedMarkup.observation ? `Observação: ${selectedMarkup.observation}` : ''}</p>
          </div>
          <Select onValueChange={(markup) => updateReferenceInfo('markup', JSON.parse(markup))}>
            <SelectTrigger>
              <SelectValue placeholder='Selecione uma marcação' />
            </SelectTrigger>
            <SelectContent>
              {markups.map((markup) => <SelectItem key={markup.name} value={JSON.stringify(markup)}>{markup.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className='flex grow'>
            <div className='flex flex-col grow items-center'>
              <h3 className='text-base'>12x</h3>
              <p className='text-sm text-tertiary'>{selectedMarkup ? selectedMarkup['12x'] + 'x' : '-'}</p>
              <p className='text-sm text-tertiary'>{result['costBase'] ? formatCurrency(result['costBase']) : ''}</p>
            </div>
            <div className='flex flex-col grow items-center border-r border-l border-secondary'>
              <h3 className='text-base'>6x</h3>
              <p className='text-sm text-tertiary'>{selectedMarkup ? selectedMarkup['6x'] + '%' : '-'}</p>
              <p className='text-sm text-tertiary'>{selectedMarkup && cost ? '+' + formatCurrency(unformatNumber(cost) * (unformatNumber(selectedMarkup['6x'], true) + freight + prospection)) : ''}</p>
            </div>
            <div className='flex flex-col grow items-center'>
              <h3 className='text-base'>à vista</h3>
              <p className='text-sm text-tertiary'>{selectedMarkup ? selectedMarkup['cash'] + '%' : '-'}</p>
              <p className='text-sm text-tertiary'>{selectedMarkup && cost ? '+' + formatCurrency(unformatNumber(cost) * (unformatNumber(selectedMarkup['cash'], true) + freight + prospection)) : ''}</p>
            </div>
          </div>
        </BorderDiv>
        <BorderDiv>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl'>Frete</h2>
            <p className='text-base text-tertiary'>{selectedFreight && result['costBase'] && freight ? `(+${formatCurrency(result['costBase'] * freight)})` : ''}</p>
          </div>
          <SelectableChips chips={freights} chipText='region' chipNumber='fee' placeholder='Sem fretes cadastrados...' selectedChip={selectedFreight} setFunction={(value) => { updateReferenceInfo('freight', value)}} />
        </BorderDiv>
        <BorderDiv>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl'>Prospecção</h2>
            <p className='text-base text-tertiary'>{selectedProspection && result['costBase'] ? `(+${formatCurrency(result['costBase'] * prospection)})` : ''}</p>
          </div>
          <SelectableChips chips={prospections} chipText='title' chipNumber='tax' placeholder='Sem prospecções cadastradas...' selectedChip={selectedProspection} setFunction={(value) => { updateReferenceInfo('prospection', value) }} />
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