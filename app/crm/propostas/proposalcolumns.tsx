// @ts-nocheck
"use client"

import SortHeader from "@/components/SortHeader";
import { ProposalT } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ProposalT>[] = [
  {
    accessorKey: "num",
    header: ({ column }) => {
      return <SortHeader column={column} center header='ID' />
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('num')}</div>
    },
    size: 30,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return <SortHeader column={column} center header='PRIORIDADE' />
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('priority')}</div>
    },
    size: 105,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">STATUS</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('status')}</div>
    },
    size: 120,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortHeader column={column} header='NOME' />
    },
    size: 140,
  },
  {
    accessorKey: "client",
    header: ({ column }) => {
      return <SortHeader column={column} header='CLIENTE' />
    },
    cell: ({ row }) => {
      // @ts-ignore
      return <div>{row.getValue('client').person.info.name}</div>
    },
    size: 80,
  },
  {
    accessorKey: "client_type",
    header: () => <div className="text-center">TIPO DE CLIENTE</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('client_type')}</div>
    },
    size: 130,
  },
  {
    accessorKey: "collaborator",
    header: ({ column }) => {
      return <SortHeader column={column} header='COLABORADOR' />
    },
    cell: ({ row }) => {
      return <div>{row.getValue('collaborator').person.info.name}</div>
    },
    size: 120,
  },
  {
    accessorKey: "office",
    header: () => <div>ESCRITÓRIO</div>,
    cell: ({ row }) => {
      return <div>{row.getValue('office').person.info.company_name}</div>
    },
    size: 100,
  },
  {
    accessorKey: "actions",
    header: ({ column }) => {
      return <SortHeader column={column} header='PRÓX. CONT.' />
    },
    size: 100,
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return <SortHeader column={column} header='VALOR' />
    },
    size: 105,
  },
]
