import { Button } from "@/components/ui/button"
import { columns } from "./clientcolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import { getEntities } from "@/lib/dbRead";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormClient from "@/components/FormClient";
import { formatClient, entityTitles } from "@/lib/utils";

export default async function Client() {
  const fullData = await getEntities('client', 'office');

  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable search={'name'} columns={columns} data={fullData ? formatClient(fullData) : []} fullData={fullData ? fullData : []} found={entityTitles.client}>
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

