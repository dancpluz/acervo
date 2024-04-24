import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TinyTable() {
  return (
    <Table>
      <TableHeader className='bg-transparent'>
        <TableRow>
          <TableHead className="w-[100px]">NOME</TableHead>
          <TableHead>CELULAR</TableHead>
          <TableHead>TELEFONE</TableHead>
          <TableHead className="">DETALHE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium"></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right"></TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium"></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right"></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
