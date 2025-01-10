import { parseAsStringLiteral, type inferParserType } from "nuqs";
import { fieldItems, FieldItemT } from "./items";

export type FilterT = {
  placeholder: string;
  param: string;
  options: FieldItemT[];
  parser: ReturnType<typeof parseAsStringLiteral>;
}

export type FilterKeys = keyof typeof filters;

const { style, pricing, ambient, status_proposal, priority, project_type, client_type } = fieldItems;

export const filters: { [key: string] : FilterT } = {
  style: {
    placeholder: 'Estilo',
    param: 'estilo',
    options: style,
    parser: parseAsStringLiteral(style.map(({ value }) => value)).withDefault(''),
  },
  ambient: {
    placeholder: 'Ambiente',
    param: 'ambiente',
    options: ambient,
    parser: parseAsStringLiteral(ambient.map(({ value }) => value)).withDefault(''),
  },
  pricing: {
    placeholder: 'Padrão',
    param: 'padrao',
    options: pricing,
    parser: parseAsStringLiteral(pricing.map(({ value }) => value)).withDefault(''),
  },
  status: {
    placeholder: '',
    param: 'status',
    options: status_proposal,
    parser: parseAsStringLiteral(status_proposal.map(({ value }) => value)).withDefault(''),
  },
  priority: {
    placeholder: 'Prioridade',
    param: 'prioridade',
    options: priority,
    parser: parseAsStringLiteral(priority.map(({ value }) => value)).withDefault(''),
  },
  project_type: {
    placeholder: 'Tipo de Projeto',
    param: 'project_type',
    options: project_type,
    parser: parseAsStringLiteral(project_type.map(({ value }) => value)).withDefault(''),
  },
  client_type: {
    placeholder: 'Tipo de Cliente',
    param: 'client_type',
    options: client_type,
    parser: parseAsStringLiteral(client_type.map(({ value }) => value)).withDefault(''),
  }
};

export function getFilterParsers(filterKeys: FilterKeys[]) {
  return Object.keys(filters).reduce((parsers, key) => {
    if (filterKeys.includes(key as FilterKeys)) {
      parsers[key] = filters[key].parser;
    }
    return parsers;
  }, {} as { [key: string]: ReturnType<typeof parseAsStringLiteral> });
}



