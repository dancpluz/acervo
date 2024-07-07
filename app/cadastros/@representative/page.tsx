import { Button } from "@/components/ui/button"
import { columns } from "./representativecolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import { getEntities } from "@/lib/dbRead";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormRepresentative from "@/components/FormRepresentative";
import { formatRepresentative, entityTitles } from "@/lib/utils";

export const revalidate = 60;

export default async function Representative() {
  const fullData = await getEntities('representative');

  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable search={'company_name'} columns={columns} data={fullData ? formatRepresentative(fullData) : []} fullData={fullData ? fullData : []} found={entityTitles.representative}>
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

