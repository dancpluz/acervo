import { Button } from "@/components/ui/button"
import { columns } from "./factorycolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormFactory from "@/components/FormFactory";

export default function Fabricas() {
  return (
    <TabsContent value="fabricas">
      <div className="flex flex-col gap-4 py-4">
        <DataTable entity={'factory'} search={'name'} columns={columns}>
          <FormFactory show />
        </DataTable>
        <div className="flex justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CirclePlus />ADICIONAR FÁBRICA
              </Button>
            </DialogTrigger>
            <DialogContent className='w-10/12 top-[30%] translate-y-[0%]'>
              <FormFactory />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TabsContent>
  )
}