import { Button } from "@/components/ui/button"
import { columns } from "./clientcolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormClient from "@/components/FormClient";

export default async function Client() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable entity={'client'} search={'name'} columns={columns}>
        <FormClient show />
      </DataTable>
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CirclePlus />ADICIONAR CLIENTE
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormClient />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

