import { Button } from "@/components/ui/button"
import { columns } from "./collaboratorcolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import { getCollaborator } from "@/lib/dbRead";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormCollaborator from "@/components/FormCollaborator";
import { formatCollaborator } from "@/lib/utils";

export default async function Collaborator() {
  const fullData = Object.values(await getCollaborator());

  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable search={'name'} columns={columns} data={fullData ? formatCollaborator(fullData) : []} fullData={fullData ? fullData : []} found={{plural: 'colaboradores', singular: 'colaborador', sufix: 'o'}}>
        <FormCollaborator show />
      </DataTable>
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CirclePlus />ADICIONAR COLABORADORES
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormCollaborator />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

