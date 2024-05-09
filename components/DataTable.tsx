"use client"

import { useState } from "react";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight } from 'lucide-react';
import { FactoryT } from "@/lib/types";
import AddFactory from '@/components/AddFactory';


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  fullData: FactoryT[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  fullData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  //const [expandedIndex, setExpandedIndex] = useState(null)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })
  
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            <TableHead style={{ width: 8 }} />
            {headerGroup.headers.map((header) => {
              return (
                <TableHead style={{ width: header.getSize() }} key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, index) => (
            <Collapsible key={row.id} asChild>
              <>
                <TableRow
                  className='relative hover:bg-secondary/10'
                  data-state={row.getIsSelected() && "selected"}
                >
                  <CollapsibleTrigger className='transition-transform cursor-pointer data-[state=open]:rotate-90' asChild>
                    <TableCell className='absolute top-1/2 transform -translate-y-1/2'>
                        <ChevronRight className='text-tertiary' />
                    </TableCell>
                  </CollapsibleTrigger>
                  {row.getVisibleCells().map((cell) => (
                    <CollapsibleTrigger key={cell.id} className='cursor-pointer' asChild>
                      <TableCell>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    </CollapsibleTrigger>
                  ))}
                </TableRow>
                <CollapsibleContent asChild>
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="p-0">
                      <AddFactory data={fullData[index]} show />
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </>
            </Collapsible>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length + 1} className="h-24 text-center">
              Sem resultados.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

