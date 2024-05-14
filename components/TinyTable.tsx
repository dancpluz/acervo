import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { CirclePlus, CircleX } from 'lucide-react';

type TableField = {
  value: string;
  label: string;
  validation?: z.ZodType<any, any>;
  mask?: (string | RegExp)[];
  size?: string;
};

type Props = {
  columns: TableField[];
  rows?: {
    [key: string]: any;
  }[];
  placeholder?: string;
  title?: string;
  order: string[];
}

type EditProps = {
  columns: TableField[];
  rows: {
    [key: string]: any;
  }[];
  title?: string;
  edit: string;
  form: UseFormReturn;
  append: () => void;
  remove: (index: number) => void;
}

export function EditTinyTable({ columns, title, rows, append, remove, form, edit}: EditProps) {
  return (
    <div className='flex flex-col gap-1'>
      <Label>{title}</Label>
      <Table containerClassName="max-h-[180px] overflow-y-auto">
        <TableHeader className='bg-transparent'>
          <TableRow>
            {columns.map((column) => {
              return (
                <TableHead key={column.label} className={`first:pl-4 px-2 text-tertiary text-sm w-[${column.size}]`}>{column.label}</TableHead>
              )
            })}
            <TableHead className='text-center w-2 px-0'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {rows.map((row,index) => {
            return (
              <TableRow key={row.id}>
                {Object.keys(row).map((key, i) => {
                  if (key == 'id') {return}
                  return (
                    <TableCell className='first:pl-4 px-2' key={key}>
                      <FormField
                        control={form.control}
                        name={`${edit}.${index}.${key}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input mask={columns[i].mask} actions={{ isDirty: form.getFieldState(`${edit}.${index}.${key}`).isDirty, clear: () => form.resetField(`${edit}.${index}.${key}`, { defaultValue: '', keepError: false }) }} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                    </TableCell>
                  )
                })}
                <TableCell className='pl-2 pr-4'>
                  <CircleX className='text-destructive cursor-pointer' onClick={() => remove(index)} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        <TableFooter>
          <tr>
            <th colSpan={5}>
              <div className='flex bg-transparent hover:bg-secondary/20 w-full border-t border-secondary font-normal justify-center gap-2 cursor-pointer items-center py-2' onClick={() => append()}>
                <CirclePlus className='text-primary w-5 h-5' />
                Adicionar
              </div>
            </th>
          </tr>
        </TableFooter>
      </Table>
    </div>
  )
}

export function TinyTable({ columns, title, rows, placeholder, order }: Props) {  
  return (
    <div className='flex flex-1 flex-col gap-1'>
      <Label>{title}</Label>
      <Table>
        <TableHeader className='bg-transparent'>
          <TableRow>
            {columns.map((column) => {
              return (
                <TableHead key={column.label} className={`text-tertiary text-sm w-[${column.size}]`}>{column.label}</TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody className={rows ? '' : 'relative h-12'}>
          {rows && rows.length !== 0 ? rows.map((row) => {
            return (
              <TableRow key={row.value}>
                {Object.keys(row).sort((a, b) => { return order.indexOf(a) - order.indexOf(b); }).map((key) => {
                if (key === 'id') {return}
                return (
                  <TableCell key={key} className='pr-0 py-3'>{row[key as keyof typeof row]}</TableCell>
                )
              })}
            </TableRow>
            )
          }) :
            <TableRow>
              <TableCell className='text-center text-base text-tertiary border-secondary border-t' colSpan={columns.length}>
                {placeholder}
              </TableCell>
            </TableRow>}
        </TableBody>
      </Table>  
    </div>
  )
}
