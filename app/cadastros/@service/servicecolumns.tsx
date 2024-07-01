"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ServiceT } from "@/lib/types";
import SortHeader from "@/components/SortHeader";

export const columns: ColumnDef<ServiceT>[] = [
  {
    accessorKey: "service",
    header: ({ column }) => {
      return <SortHeader column={column} header='SERVIÇO' />
    },
    size: 200,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortHeader column={column} header='NOME' />
    },
    size: 200,
  },
  {
    accessorKey: "info_email",
    header: ({ column }) => {
      return <SortHeader column={column} header='EMAIL' />
    },
    size: 200,
  },
  {
    accessorKey: "phone",
    header: () => <div>CELULAR</div>,
    cell: ({ row }) => {
      const phone = row.getValue('phone');
      return phone ? phone : '-';
    },
    size: 150,
  },
  {
    accessorKey: "telephone",
    header: () => <div>TELEFONE</div>,
    cell: ({ row }) => {
      const telephone = row.getValue('telephone');
      return telephone ? telephone : '-';
    },
    size: 150,
  },
  {
    accessorKey: "pix",
    header: () => <div>PIX</div>,
    cell: ({ row }) => {
      const pix = row.getValue('pix');
      return pix ? pix : '-';
    },
    size: 200,
  },
]
