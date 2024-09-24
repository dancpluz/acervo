import { Button } from "@/components/ui/button"
import { columns } from "./officecolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormOffice from "@/components/FormOffice";

export default async function Office() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable entity={'office'} search={'name'} columns={columns}>
        <FormOffice show />
      </DataTable>
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CirclePlus />ADICIONAR ESCRITÓRIO
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormOffice />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

