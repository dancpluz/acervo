import { Button } from "@/components/ui/button"
import { columns } from "./servicecolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormService from "@/components/FormService";
import { TabsContent } from "@/components/ui/tabs";

export default function Service() {
  return (
    <TabsContent value="servicos">
      <div className="flex flex-col gap-4 py-4">
        <DataTable entity={'service'} search={'name'} columns={columns}>
          <FormService show />
        </DataTable>
        <div className="flex justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CirclePlus />ADICIONAR SERVIÇO
              </Button>
            </DialogTrigger>
            <DialogContent className='w-10/12 top-[30%] translate-y-[0%]'>
              <FormService />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TabsContent>
  )
}

