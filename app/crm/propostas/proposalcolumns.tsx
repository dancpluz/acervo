"use client"

import SortHeader from "@/components/SortHeader";
import { ProposalT, ActionT } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, mapEnum, timestampToDate } from '@/lib/utils'
import { PriorityButtons } from "@/components/PriorityIndicator";
import { format } from 'date-fns';
import { Timestamp } from "firebase/firestore";


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
      return <div className='flex justify-center'><PriorityButtons priority={row.getValue('priority')} /></div>
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
      return <div>{action && action.length !== 0 ? format(timestampToDate(action[0].date as Timestamp), 'dd/MM/yyyy') : '-'}</div>;
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
