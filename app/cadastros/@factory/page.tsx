import { Button } from "@/components/ui/button"
import { columns } from "./factorycolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import { getFactory, getRepresentativeItems } from "@/lib/dbRead";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormFactory from "@/components/FormFactory";
import { formatFactory } from "@/lib/utils";

export default async function Factory() {
  const fullData = Object.values(await getFactory());
  const representatives = await getRepresentativeItems();

  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable search={'company_name'} columns={columns} data={fullData ? formatFactory(fullData) : []} fullData={fullData ? fullData : []} found={{plural: 'fábricas', singular: 'fábrica', sufix: 'a'}}>
        <FormFactory representatives={representatives} show />
      </DataTable>
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CirclePlus />ADICIONAR FÁBRICA
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormFactory representatives={representatives} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

