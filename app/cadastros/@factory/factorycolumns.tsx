"use client"

import { ColumnDef } from "@tanstack/react-table";
import { FactoryT } from "@/lib/types";
import Chip from "@/components/Chip";
import SortHeader from "@/components/SortHeader";
import Image from "next/image";
import Link from "next/link";
import { formatPercent } from '@/lib/utils';

export const columns: ColumnDef<FactoryT>[] = [
  {
    accessorKey: "company_name",
    header: ({ column }) => {
      return <SortHeader column={column} header='NOME'/>
    },
    size: 250,
  },
  {
    accessorKey: "pricing",
    header: ({ column }) => {
      return <SortHeader column={column} header='PADRÃO' center numeric />
    },
    cell: ({ row }) => {
      return <div className="text-center"><Chip label={row.getValue('pricing')} /></div>
    },
    size: 100,
  },
  {
    accessorKey: "style",
    header: () => <div className="text-center">ESTILO</div>,
    cell: ({ row }) => {
      return <div className="text-center"><Chip label={row.getValue('style')} /></div>
    },
    size: 150,
  },
  {
    accessorKey: "ambient",
    header: () => <div className="text-center">AMBIENTE</div>,
    cell: ({ row }) => {
      return <div className="text-center"><Chip label={row.getValue('ambient')} /></div>
    },
    size: 100,
  },
  {
    accessorKey: "representative",
    header: ({ column }) => {
      return <SortHeader column={column} header='REPRESENTANTE'/>
    },
    size: 250,
  },
  {
    accessorKey: "direct_sale",
    header: ({ column }) => {
      return <SortHeader column={column} header='V.DIR.' center numeric />
    },
    cell: ({ row }) => {
      return <div className="text-center">{formatPercent(row.getValue("direct_sale"))}</div>
    },
    size: 50,
  },
  {
    accessorKey: "discount",
    header: ({ column }) => {
      return <SortHeader column={column} header='DESC.' center numeric />
    },
    cell: ({ row }) => {
      return <div className="text-center">{formatPercent(row.getValue("discount"))}</div>
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
