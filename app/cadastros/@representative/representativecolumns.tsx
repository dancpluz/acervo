"use client"

import { ColumnDef } from "@tanstack/react-table";
import { RepresentativeT } from "@/lib/types";
import SortHeader from "@/components/SortHeader";

export const columns: ColumnDef<RepresentativeT>[] = [
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
      const phones = row.getValue('phone') as Record<string,string>[];
      return phones.length > 0 ? phones[0].phone : '-';
    },
    size: 150,
  },
  {
    accessorKey: "telephone",
    header: () => <div>TELEFONE</div>,
    cell: ({ row }) => {
      const telephones = row.getValue('telephone') as Record<string, string>[];
      return telephones.length > 0 ? telephones[0].telephone : '-';
    },
    size: 150,
  },
  {
    accessorKey: "factories",
    header: () => <div>FÁBRICAS</div>,
    size: 200,
  },
]
