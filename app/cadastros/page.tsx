'use client'

import db from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { Factory } from "@/lib/types";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { Icon } from "@/components/Header";
import { columns } from "./columns"
import { DataTable } from "@/components/DataTable"
import { CirclePlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormFactory from "@/components/FormFactory";


async function fetchFactory(param?: string) {

  const q = query(collection(db, "factory"));

  const querySnapshot = await getDocs(q);
  const data: Factory[] = [];

  querySnapshot.forEach((doc) => {
    const fetchedData = {id: doc.id, ...doc.data()} as Factory;

  });
  console.log(data)
}

export default function Cadastros() {
  const [tab, setTab] = useState<Icon>('factory');
  const example = Array(3).fill({ name: "Butzke", pricing: 5, style: "Contemporâneo", environment: "Interno", representative: "Punto", direct_sale: 0.0835, discount: 0.05, link_table: "https://www.acervomobilia.com/" });
  example.push({ name: "Casa", pricing: 4, style: "Moderno", environment: "Externo", representative: "Punto", discount: 0.02, link_table: "https://www.acervomobilia.com/" })
  example.push({ name: "Exemplo", pricing: 3, style: "Moderno", environment: "Externo", representative: "Teste", discount: 0.01, direct_sale: 0.05 })
  example.push({ name: "Teste", pricing: 1, style: "Antigo", environment: "Int. e Ext", representative: "", discount: 0.05 })
  example.push({ name: "Acervo", pricing: 2, style: "Antigo", environment: "Int. e Ext", representative: "", discount: 0.04 })

  return (
    <div className="flex flex-col gap-4 px-20 py-10 h-full">
      <Header page='Cadastros' tab={tab}/>
      <Tabs className='flex-1' defaultValue="factory" onValueChange={(value: Icon) => {setTab(value)}}>
        <TabsList >
          <TabsTrigger value="factory">Fábricas</TabsTrigger>
          <TabsTrigger value="client">Clientes</TabsTrigger>
          <TabsTrigger value="representative">Representação</TabsTrigger>
          <TabsTrigger value="office">Escritórios</TabsTrigger>
          <TabsTrigger value="service">Serviços</TabsTrigger>
          <TabsTrigger value="collaborator">Colaboradores</TabsTrigger>
        </TabsList>

        <TabsContent value="factory">
          <div className="flex flex-col gap-4">
            <div className="h-9">

            </div>
            <DataTable columns={columns} data={example} />
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
              
              
              <p className="text-sm">{example.length} fábricas encontradas</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="client">client</TabsContent>
        <TabsContent value="representative">representative</TabsContent>
        <TabsContent value="office">office</TabsContent>
        <TabsContent value="service">service</TabsContent>
        <TabsContent value="collaborator">collaborator</TabsContent>

      </Tabs>
    </div>
  )
}
