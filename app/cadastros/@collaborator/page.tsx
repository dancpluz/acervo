import { Button } from "@/components/ui/button"
import { columns } from "./collaboratorcolumns";
import { DataTable } from "@/components/DataTable";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormCollaborator from "@/components/FormCollaborator";

export default function Collaborator() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <DataTable entity={'collaborator'} search={'name'} columns={columns}>
        <FormCollaborator show />
      </DataTable>
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CirclePlus />ADICIONAR COLABORADOR
            </Button>
          </DialogTrigger>
          <DialogContent className='w-10/12 top-[30%] translate-y-[0%]'>
            <FormCollaborator />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

