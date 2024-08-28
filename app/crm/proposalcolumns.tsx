"use client"

import SortHeader from "@/components/SortHeader";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <SortHeader column={column} center header='ID' />
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('id')}</div>
    },
    size: 30,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return <SortHeader column={column} center header='PRIORIDADE' />
    },
    size: 105,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">STATUS</div>,
    size: 120,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return <SortHeader column={column} header='TÍTULO' />
    },
    size: 140,
  },
  {
    accessorKey: "client",
    header: ({ column }) => {
      return <SortHeader column={column} header='CLIENTE' />
    },
    size: 80,
  },
  {
    accessorKey: "client_type",
    header: () => <div className="text-center">TIPO DE CLIENTE</div>,
    size: 130,
  },
  {
    accessorKey: "collaborator",
    header: ({ column }) => {
      return <SortHeader column={column} header='COLABORADOR' />
    },
    size: 120,
  },
  {
    accessorKey: "office",
    header: () => <div className="text-center">ESCRITÓRIO</div>,
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
