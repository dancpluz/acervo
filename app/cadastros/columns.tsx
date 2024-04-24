"use client"

import { Column, ColumnDef } from "@tanstack/react-table";
import { Factory } from "@/lib/types";
import Chip from "@/components/Chip";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpDown, ArrowUpAZ, ArrowDownZA, ArrowUp01, ArrowDown10 } from "lucide-react"

function formatPercent(float?: number) {
  if (!float) return "-";

  const decimals: number = float.toString().split(".")[1]?.length || 0;
  const minimumFractionDigits: number = decimals >= 3 ? 2 : 0;
  const formated = float.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits });
  
  return formated;
}

function SortHeader(column: Column<Factory>, header: string, center?: boolean, numeric?: boolean) {
  if (numeric) {
    return (
      <div className={`flex ${center ? 'justify-center' : ''}`}>
        <button
          className={`flex items-center gap-1 hover:outline outline-primary rounded outline-1 outline-offset-4`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {header}
          {column.getIsSorted() === "asc" ? <ArrowUp01 className="h-4 w-4" /> : column.getIsSorted() === "desc" ? <ArrowDown10 className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
        </button>
      </div>
    )
  }

  return (
    <div className={`flex ${center ? 'justify-center' : ''}`}>
      <button
        className={`flex items-center gap-1 hover:outline outline-primary rounded outline-1 outline-offset-4`}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {header}
        {column.getIsSorted() === "asc" ? <ArrowUpAZ className="h-4 w-4" /> : column.getIsSorted() === "desc" ? <ArrowDownZA className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
      </button>
    </div>
  )
}

export const columns: ColumnDef<Factory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return SortHeader(column, 'NOME')
    },
    size: 250,
  },
  {
    accessorKey: "pricing",
    header: ({ column }) => {
      return SortHeader(column, 'PADRÃO', true, true)
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
    accessorKey: "environment",
    header: () => <div className="text-center">AMBIENTE</div>,
    cell: ({ row }) => {
      return <div className="text-center"><Chip label={row.getValue('environment')} /></div>
    },
    size: 100,
  },
  {
    accessorKey: "representative",
    header: ({ column }) => {
      return SortHeader(column, 'REPRESENTANTE')
    },
    size: 250,
  },
  {
    accessorKey: "direct_sale",
    header: ({ column }) => {
      return SortHeader(column, 'V.DIR.', true, true)
    },
    cell: ({ row }) => {
      return <div className="text-center">{formatPercent(row.getValue("direct_sale"))}</div>
    },
    size: 50,
  },
  {
    accessorKey: "discount",
    header: ({ column }) => {
      return SortHeader(column, 'DESC.', true, true)
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
