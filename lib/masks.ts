import { conformToMask, Mask } from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export const conformNumberToMask = (value: number | string, mask: Mask): string => {
  const stringValue = typeof value === 'number' ? value.toString() : value;

  const { conformedValue } = conformToMask(stringValue, mask, { guide: true });

  return conformedValue;
};

export const dayMask = createNumberMask({
  prefix: '',
  allowDecimal: false,
  thousandsSeparatorSymbol: '.',
  suffix: ' DIAS',
})

export const symbolCostMask = (symbol: string) => createNumberMask({
  prefix: symbol + 'R$ ',
  thousandsSeparatorSymbol: '.',
  allowDecimal: true,
  decimalSymbol: ',',
})

export const costMask = createNumberMask({
  prefix: 'R$ ',
  thousandsSeparatorSymbol: '.',
  allowDecimal: true,
  decimalSymbol: ',',
})

