import { Button } from "@/components/ui/button"
import { columns } from "./representativecolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import { getRepresentative } from "@/lib/dbRead";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormRepresentative from "@/components/FormRepresentative";
import { formatRepresentative } from "@/lib/utils";

export default async function Representative() {
  const fullData = Object.values(await getRepresentative());

  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable search={'company_name'} columns={columns} data={fullData ? formatRepresentative(fullData) : []} fullData={fullData ? fullData : []} found={{plural: 'representações', singular: 'representação', sufix: 'a'}}>
        <FormRepresentative show />
      </DataTable>
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CirclePlus />ADICIONAR REPRESENTAÇÃO
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormRepresentative />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

