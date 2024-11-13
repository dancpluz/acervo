import { Button } from "@/components/ui/button"
import { columns } from "./representativecolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormRepresentative from "@/components/FormRepresentative";
import { TabsContent } from "@/components/ui/tabs";

export default function Representative() {
  return (
    <TabsContent value="representacoes">
      <div className="flex flex-col gap-4 py-4">
        <DataTable entity={'representative'} search={'name'} columns={columns}>
          <FormRepresentative show />
        </DataTable>
        <div className="flex justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CirclePlus />ADICIONAR REPRESENTAÇÃO
              </Button>
            </DialogTrigger>
            <DialogContent className='w-10/12 top-[30%] translate-y-[0%]'>
              <FormRepresentative />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TabsContent>
  )
}

