"use client"

import { ColumnDef } from "@tanstack/react-table";
import { CollaboratorT, ContactT } from "@/lib/types";
import SortHeader from "@/components/SortHeader";

export const columns: ColumnDef<CollaboratorT>[] = [
  {
    accessorKey: "person.label",
    id: 'name',
    header: ({ column }) => {
      return <SortHeader column={column} header='NOME' />
    },
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    },
    size: 150,
  },
  {
    accessorKey: "role",
    header: () => <div>CARGO</div>,
    size: 150,
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
    accessorKey: "person.contact",
    id: 'phone',
    header: () => <div>CELULAR</div>,
    cell: ({ row }) => {
      const contact = row.getValue('phone') as ContactT[];
      return <div>{contact && contact.length !== 0 ? contact[0].phone : '-'}</div>;
    },
    size: 150,
  },
  {
    accessorKey: "person.contact",
    id: 'telephone',
    header: () => <div>TELEFONE</div>,
    cell: ({ row }) => {
      const contact = row.getValue('telephone') as ContactT[];
      return <div>{contact && contact.length !== 0 ? contact[0].phone : '-'}</div>;
    },
    size: 150,
  },
  {
    accessorKey: "person.payment.pix",
    id: 'pix',
    header: () => <div>PIX</div>,
    cell: ({ row }) => {
      return <div>{row.getValue('pix') ? row.getValue('pix') : '-'}</div>;
    },
    size: 200,
  },
]