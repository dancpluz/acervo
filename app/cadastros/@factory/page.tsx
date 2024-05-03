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
  // const example = Array(3).fill({ name: "Butzke", pricing: 5, style: "Contemporâneo", environment: "Interno", representative: "Punto", direct_sale: 0.0835, discount: 0.05, link_table: "https://www.acervomobilia.com/" });
  // example.push({ name: "Casa", pricing: 4, style: "Moderno", environment: "Externo", representative: "Punto", discount: 0.02, link_table: "https://www.acervomobilia.com/" })
  // example.push({ name: "Exemplo", pricing: 3, style: "Moderno", environment: "Externo", representative: "Teste", discount: 0.01, direct_sale: 0.05 })
  // example.push({ name: "Teste", pricing: 1, style: "Antigo", environment: "Int. e Ext", representative: "", discount: 0.05 })
  // example.push({ name: "Acervo", pricing: 2, style: "Antigo", environment: "Int. e Ext", representative: "", discount: 0.04 })
  
  const fullData = Object.values(await getFactory());

  return (
    <div className="flex flex-col gap-4">
      <div className="h-9">
        
      </div>
      <DataTable columns={columns} data={fullData ? formatFactory(fullData) : []} fullData={fullData ? fullData : []} />
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

