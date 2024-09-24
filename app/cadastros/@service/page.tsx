import { Button } from "@/components/ui/button"
import { columns } from "./servicecolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormService from "@/components/FormService";

export default async function Service() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable entity={'service'} search={'name'} columns={columns}>
        <FormService show />
      </DataTable>
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CirclePlus />ADICIONAR SERVIÇO
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormService />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

