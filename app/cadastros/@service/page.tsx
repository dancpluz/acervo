import { Button } from "@/components/ui/button"
import { columns } from "./servicecolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import { getService } from "@/lib/dbRead";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormService from "@/components/FormService";
import { formatService } from "@/lib/utils";

export default async function Service() {
  const fullData = Object.values(await getService());

  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable search={'service'} columns={columns} data={fullData ? formatService(fullData) : []} fullData={fullData ? fullData : []} found={{plural: 'serviços', singular: 'serviço', sufix: 'o'}}>
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

