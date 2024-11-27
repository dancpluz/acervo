import { Button } from "@/components/ui/button"
import { columns } from "./officecolumns";
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormOffice from "@/components/FormOffice";
import { TabsContent } from "@/components/ui/tabs";

export default function Office() {
  return (
    <TabsContent value="escritorios">
      <div className="flex flex-col gap-4 py-4">
        <DataTable entity={'office'} search={'name'} columns={columns}>
          <FormOffice show />
        </DataTable>
        <div className="flex justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CirclePlus />ADICIONAR ESCRITÓRIO
              </Button>
            </DialogTrigger>
            <DialogContent className='w-10/12 top-[30%] translate-y-[0%]'>
              <FormOffice />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TabsContent>
  )
}

