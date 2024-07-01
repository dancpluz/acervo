import { Button } from "@/components/ui/button"
import { columns } from "./collaboratorcolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import { getEntities } from "@/lib/dbRead";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormCollaborator from "@/components/FormCollaborator";
import { formatCollaborator, entityTitles } from "@/lib/utils";

export default async function Collaborator() {
  const fullData = await getEntities('collaborator');
  
  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable search={'name'} columns={columns} data={fullData ? formatCollaborator(fullData) : []} fullData={fullData ? fullData : []} found={entityTitles.collaborator}>
        <FormCollaborator show />
      </DataTable>
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CirclePlus />ADICIONAR COLABORADOR
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

