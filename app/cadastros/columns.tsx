"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Factory } from "@/lib/types";

export const columns: ColumnDef<Factory>[] = [
  {
    accessorKey: "name",
    header: "NOME",
  },
  {
    accessorKey: "pricing",
    header: () => <div className="text-center">PADRÃO</div>,
    cell: ({ row }) => {

      return <div className="text-center">{row.getValue("pricing")}</div>
    }
  },
  {
    accessorKey: "style",
    header: () => <div className="text-center">ESTILO</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("style")}</div>
    }
  },
  {
    accessorKey: "environment",
    header: () => <div className="text-center">AMBIENTE</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("environment")}</div>
    }
  },
  {
    accessorKey: "representative",
    header: "REPRESENTANTE",
  },
  {
    accessorKey: "direct_sale",
    header: () => <div className="text-center">V.DIR</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("direct_sale")}</div>
    }
  },
  {
    accessorKey: "discount",
    header: () => <div className="text-center">DESC.</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("discount")}</div>
    }
  },
  {
    accessorKey: "link_table",
    header: () => <div className="text-center">TABELA</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("link_table")}</div>
    }
  },
  {
    accessorKey: "link_catalog",
    header: () => <div className="text-center">ACAB.</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("link_catalog")}</div>
    }
  },
]