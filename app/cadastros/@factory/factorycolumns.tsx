"use client"

import { ColumnDef } from "@tanstack/react-table";
import { FactoryT } from "@/lib/types";
import Chip from "@/components/Chip";
import SortHeader from "@/components/SortHeader";
import Image from "next/image";
import Link from "next/link";
import { fieldItems } from '@/lib/fields';
import { formatPercent } from '@/lib/utils';

export const columns: ColumnDef<FactoryT>[] = [
  {
    accessorKey: "person.label",
    id: 'name',
    header: ({ column }) => {
      return <SortHeader column={column} header='NOME' />
    },
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    },
    size: 250,
  },
  {
    accessorKey: "pricing",
    header: ({ column }) => {
      return <SortHeader column={column} header='PADRÃO' center numeric />
    },
    cell: ({ row }) => {
      return <div className="text-center"><Chip label={fieldItems.pricing.find(({ value }) => value === row.getValue('pricing'))?.label} /></div>
    },
    size: 100,
  },
  {
    accessorKey: "style",
    header: () => <div className="text-center">ESTILO</div>,
    cell: ({ row }) => {
      return <div className="text-center"><Chip label={fieldItems.style.find(({ value }) => value === row.getValue('style'))?.label} /></div>
    },
    size: 150,
  },
  {
    accessorKey: "ambient",
    header: () => <div className="text-center">AMBIENTE</div>,
    cell: ({ row }) => {
      return <div className="text-center"><Chip label={fieldItems.ambient.find(({ value }) => value === row.getValue('ambient'))?.label} /></div>
    },
    size: 100,
  },
  {
    accessorKey: "representative.person.label",
    id: 'representative',
    header: ({ column }) => {
      return <SortHeader column={column} header='REPRESENTANTE'/>
    },
    cell: ({ row }) => {
      return row.getValue('representative') ? row.getValue('representative') : '-';
    },
    size: 250,
  },
  {
    accessorKey: "direct_sale",
    header: ({ column }) => {
      return <SortHeader column={column} header='V.DIR.' center numeric />
    },
    cell: ({ row }) => {
      return <div className="text-center">{formatPercent(row.getValue("direct_sale") as number/100)}</div>
    },
    size: 50,
  },
  {
    accessorKey: "discount",
    header: ({ column }) => {
      return <SortHeader column={column} header='DESC.' center numeric />
    },
    cell: ({ row }) => {
      return <div className="text-center">{formatPercent(row.getValue("discount") as number /100)}</div>
    },
    size: 50,
  },
  {
    accessorKey: "link_table",
    header: () => <div className="text-center">TABELA</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {
            row.getValue("link_table") ? 
            <Link className='hover:opacity-60' target="_blank" href={row.getValue("link_table")}>
              <Image alt={'Acessar Tabela'} src={'/icons/link.svg'} width={24} height={24} />
            </Link> : '-'
          }
        </div>
      )
    },
    size: 50,
  },
  {
    accessorKey: "link_catalog",
    header: () => <div className="text-center">ACABA.</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {
            row.getValue("link_catalog") ?
              <Link className='hover:opacity-60' target="_blank" href={row.getValue("link_catalog")}>
                <Image alt={'Acessar Catálogo de Acabamentos'} src={'/icons/link.svg'} width={24} height={24} />
              </Link> : '-'
          }
        </div>
      )
    },
    size: 50,
  },
]
