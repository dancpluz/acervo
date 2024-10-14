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
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { entityTitles } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import useGetEntities from '@/hooks/useGetEntities';
import { converters, ConverterKey } from '@/lib/converters';
import { Skeleton } from "@/components/ui/skeleton"

interface DataTableProps<TData, TValue> {
  entity: ConverterKey,
  columns: ColumnDef<TData, TValue>[]
  search: string
  children?: ReactElement
  link?: string
}

export function DataTable<TData, TValue>({
  entity,
  columns,
  search,
  children,
  link,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const router = useRouter();
  const found = entityTitles[entity];
  const [data, loading, error] = useGetEntities<TData>(entity, converters[entity]);
  
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
      <div className='relative'>
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
      </div>
      <Table containerClassName="h-[520px] overflow-y-auto">
        <TableHeader style={{insetBlockStart: 0, position: 'sticky', zIndex: 5}}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className={children ? 'first:pl-10' : ''} style={{ width: header.getSize() }} key={header.id}>
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
        <TableBody className='last:border-b last:border-primary'>
          {table.getRowModel().rows?.length ? 
           children && data ?
          (
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
                        {cloneElement(children, { data: data[row.index] })}
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))
          ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className={link ? 'cursor-pointer hover:bg-secondary/20' : ''}
                    onClick={link && data ? () => router.push(link + (data[row.index]).id) : undefined}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
          : loading ? 
          (
            <>
              {Array.from({ length: 7 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={columns.length + 1} className="h-16">
                    <Skeleton className="bg-secondary/30 w-full h-full " />
                  </TableCell>
                </TableRow>
              ))}
            </>
          )
          : 
          
          (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-16 text-center text-base text-tertiary">
                Não foi encontrado nenhum resultado...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='flex justify-between'>
        {data ? data.length === 0 ? <p className="text-sm">{`Adicione um${found.sufix === 'a' ? 'a' : ''} nov${found.sufix} ${found.singular}!`}</p> : <p className="text-sm">{`${data.length} ${data.length > 1 ? `${found.plural} encontrad${found.sufix}s` : `${found.singular} encontrad${found.sufix}`}`}</p> : <p>Procurando {found.plural}</p>}
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

