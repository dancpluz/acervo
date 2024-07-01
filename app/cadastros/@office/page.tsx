import { Button } from "@/components/ui/button"
import { columns } from "./officecolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import { getEntities } from "@/lib/dbRead";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormOffice from "@/components/FormOffice";
import { formatOffice, entityTitles } from "@/lib/utils";

export default async function Office() {
  const fullData = await getEntities('office');

  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable search={'company_name'} columns={columns} data={fullData ? formatOffice(fullData) : []} fullData={fullData ? fullData : []} found={entityTitles.office}>
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

