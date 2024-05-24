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
import { FactoryT, RepresentativeT, OfficeT, ClientT, CollaboratorT, ServiceT } from "@/lib/types";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  fullData: FactoryT[] | RepresentativeT[] | OfficeT[] | ClientT[] | CollaboratorT[] | ServiceT[]
  search: string
  children: ReactElement
  found: {singular: string, plural: string, sufix: 'o' | 'a'}
}

export function DataTable<TData, TValue>({
  columns,
  data,
  fullData,
  search,
  children,
  found,
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
        placeholder={`Pesquisar ${found.plural}...`}
        value={(table.getColumn(search)?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn(search)?.setFilterValue(e.target.value)
        }
        containerClassName='justify-end'
        className="max-w-sm border-primary pr-10"
        icon={<Search className='text-primary w-5 h-5 absolute transform -translate-y-1/2 top-1/2 right-3' />}
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className='first:pl-10' style={{ width: header.getSize() }} key={header.id}>
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
                  <CollapsibleTrigger className='cursor-pointer [&>svg]:[&>td]:data-[state=open]:rotate-90' asChild>
                    <TableRow className='relative hover:bg-secondary/10'>
                    {row.getVisibleCells().map((cell, index) => index === 0 ? (
                      <TableCell key={cell.id} className='flex items-center gap-3'>
                        <ChevronRight className='text-tertiary transform transition-transform' />
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                      ) : (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                      )
                    )}
                    </TableRow>
                  </CollapsibleTrigger>
                  <CollapsibleContent asChild>
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} className="p-0">
                        {cloneElement(children, { data: fullData[row.index] })}
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-16 text-center text-base text-tertiary">
                Não foi encontrado nenhum resultado...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='flex justify-between'>
        {fullData ? fullData.length === 0 ? <p className="text-sm">{`Adicione um${found.sufix === 'a' ? 'a' : ''} nov${found.sufix} ${found.singular}!`}</p> : <p className="text-sm">{`${fullData.length} ${fullData.length > 1 ? `${found.plural} encontrad${found.sufix}s` : `${found.singular} encontrad${found.sufix}`}`}</p> : <p>Procurando ${found.plural}</p>}
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

