"use client"

import { useState, ReactElement, cloneElement } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
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
import { ChevronRight, Search } from 'lucide-react';
import { FactoryT, RepresentativeT } from "@/lib/types";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  fullData: FactoryT[] | RepresentativeT[]
  search: string
  children: ReactElement
}

export function DataTable<TData, TValue>({
  columns,
  data,
  fullData,
  search,
  children,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })
  
  return (
    <>
      <Input
        placeholder="Pesquisar..."
        value={(table.getColumn(search)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(search)?.setFilterValue(event.target.value)
        }
        containerClassName='justify-end'
        className="max-w-sm border-primary pr-10"
        icon={<Search className='text-primary w-5 h-5 absolute transform -translate-y-1/2 top-1/2 right-3' />}
      />
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
            table.getRowModel().rows.map((row) => (
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
                        {cloneElement(children, { data: fullData[row.index], show: true })}
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-16 text-center">
                Não foi encontrado nenhum resultado...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='flex justify-between'>
        {fullData ? <p className="text-sm">{`${fullData.length} ${fullData.length > 1 ? 'fábricas encontradas' : 'fábrica encontrada'}`}</p> : <p>Procurando fábricas</p>}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </>
  )
}

