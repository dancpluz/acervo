import { Button } from "@/components/ui/button"
import { columns } from "./clientcolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormClient from "@/components/FormClient";
import { TabsContent } from "@/components/ui/tabs";

export default function Client() {
  return (
    <TabsContent value="clientes">
      <div className="flex flex-col gap-4 py-4">
        <DataTable entity={'client'} search={'name'} columns={columns}>
          <FormClient show />
        </DataTable>
        <div className="flex justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CirclePlus />ADICIONAR CLIENTE
              </Button>
            </DialogTrigger>
            <DialogContent className='w-10/12 top-[30%] translate-y-[0%]'>
              <FormClient />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TabsContent >
  )
}

