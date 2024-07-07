import { Button } from "@/components/ui/button"
import { columns } from "./factorycolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import { getEntities } from "@/lib/dbRead";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormFactory from "@/components/FormFactory";
import { formatFactory, entityTitles } from "@/lib/utils";

export const revalidate = 60;

export default async function Factory() {
  const fullData = await getEntities('factory', 'representative');

  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable search={'company_name'} columns={columns} data={fullData ? formatFactory(fullData) : []} fullData={fullData ? fullData : []} found={entityTitles.factory}>
        <FormFactory show />
      </DataTable>
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CirclePlus />ADICIONAR FÁBRICA
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormFactory />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

