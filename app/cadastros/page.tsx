'use client'

import db from "@/lib/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { Factory } from "@/lib/types";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react";
import { Icon } from "@/components/Header";
import { columns } from "./columns"
import { DataTable } from "@/components/DataTable"

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
  
  const className = "text-xl px-6 -mt-0.5 font-normal text-tertiary rounded-none border-transparent border-b data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:shadow-none";

  return (
    <div className="flex flex-col gap-4 px-20 py-10 max-h-full">
      <Header page='Cadastros' tab={tab}/>
        <Tabs className='h-full' defaultValue="factory" onValueChange={(value: Icon) => {setTab(value)}}>
          <TabsList className="bg-transparent text-foreground w-full justify-start rounded-none border-b border-alternate p-0" >
            <TabsTrigger className={className} value="factory">Fábricas</TabsTrigger>
            <TabsTrigger className={className} value="client">Clientes</TabsTrigger>
            <TabsTrigger className={className} value="representative">Representação</TabsTrigger>
            <TabsTrigger className={className} value="office">Escritórios</TabsTrigger>
            <TabsTrigger className={className} value="service">Serviços</TabsTrigger>
            <TabsTrigger className={className} value="collaborator">Colaboradores</TabsTrigger>
          </TabsList>

          <TabsContent className='' value="factory">
          <div className="flex flex-col gap-4">
              <div className="h-9">

              </div>
              <DataTable columns={columns} data={Array(12).fill({ name: "Butzke", pricing: 5, style: "Contemporâneo", environment: "Interno", representative: "Punto", direct_sale: 0.0835, discount: 0.05, link_table: "*", link_catalog: "*" })} />
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
