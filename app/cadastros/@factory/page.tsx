import { Button } from "@/components/ui/button"
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import { getFactory } from "@/lib/dbRead";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormFactory from "@/components/FormFactory";
import { formatFactory } from "@/lib/utils";

export default async function Factory() {
  const fullData = Object.values(await getFactory());

  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable search={'name'} columns={columns} data={fullData ? formatFactory(fullData) : []} fullData={fullData ? fullData : []} />
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CirclePlus /> ADICIONAR FÁBRICA
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormFactory />
          </DialogContent>
        </Dialog>
        {fullData ? <p className="text-sm">{`${fullData.length} ${fullData.length > 1 ? 'fábricas encontradas' : 'fábrica encontrada'}`}</p> : <p>Procurando fábricas</p>}
      </div>
    </div>
  )
}

