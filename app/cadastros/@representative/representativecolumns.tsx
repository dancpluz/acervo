"use client"

import { ColumnDef } from "@tanstack/react-table";
import { RepresentativeT } from "@/lib/types";
import SortHeader from "@/components/SortHeader";

export const columns: ColumnDef<RepresentativeT>[] = [
  {
    accessorKey: "company_name",
    header: ({ column }) => {
      return <SortHeader column={column} header='NOME' />
    },
    size: 150,
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
    accessorKey: "factories",
    header: () => <div>FÁBRICAS</div>,
    size: 200,
  },
]
