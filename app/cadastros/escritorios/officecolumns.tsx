"use client"

import { ColumnDef } from "@tanstack/react-table";
import { OfficeT } from "@/lib/types";
import SortHeader from "@/components/SortHeader";

export const columns: ColumnDef<OfficeT>[] = [
  {
    accessorKey: "person.label",
    id: 'name',
    header: ({ column }) => {
      return <SortHeader column={column} header='NOME' />
    },
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    },
    size: 200,
  },
  {
    accessorKey: "person.info.info_email",
    id: 'info_email',
    header: ({ column }) => {
      return <SortHeader column={column} header='EMAIL' />
    },
    cell: ({ row }) => {
      return <div>{row.getValue('info_email')}</div>;
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
]
