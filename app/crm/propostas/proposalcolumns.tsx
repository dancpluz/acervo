"use client"

import SortHeader from "@/components/SortHeader";
import { ProposalT, ActionT } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, mapEnum } from '@/lib/utils'


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
      const priority = row.getValue('priority')
      return <div className="flex gap-0.5 justify-center">
        {Array(3).fill(null).map((_, i) => (
          <div key={i} className={`w-5 h-5 p-0 bg-background transition-colors border border-primary rounded-full ${i < Number(priority) ? 'bg-primary' : ''}`} />
        )
      )}</div>
    },
    size: 105,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">STATUS</div>,
    cell: ({ row }) => {
      const status = row.getValue('status') as keyof typeof mapEnum;
      return <div className="text-center">{mapEnum[status]}</div>
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
    accessorKey: "client.person.label",
    id: 'client',
    header: ({ column }) => {
      return <SortHeader column={column} header='CLIENTE' />
    },
    cell: ({ row }) => {
      return row.getValue('client') ? row.getValue('client') : '-';
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
    accessorKey: "collaborator.person.label",
    id: 'collaborator',
    header: ({ column }) => {
      return <SortHeader column={column} header='COLABORADOR' />
    },
    cell: ({ row }) => {
      return row.getValue('collaborator') ? row.getValue('collaborator') : '-';
    },
    size: 120,
  },
  {
    accessorKey: "office.person.label",
    id: 'office',
    header: ({ column }) => {
      return <SortHeader column={column} header='ESCRITÓRIO' />
    },
    cell: ({ row }) => {
      return row.getValue('office') ? row.getValue('office') : '-';
    },
    size: 100,
  },
  {
    accessorKey: "actions",
    header: ({ column }) => {
      return <SortHeader column={column} header='PRÓX. CONT.' />
    },
    cell: ({ row }) => {
      const action = row.getValue('actions') as ActionT[];
      return <div>{action && action.length !== 0 ? action[0].date.toString() : '-'}</div>;
    },
    size: 100,
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return <SortHeader column={column} header='VALOR' />
    },
    cell: ({ row }) => {
      return row.getValue('total') ? formatCurrency(row.getValue('total')) : '-';
    },
    size: 105,
  },
]