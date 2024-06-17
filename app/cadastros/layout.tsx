'use client'

import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react";
import { IconT } from "@/components/Header"; 

export default function Layout({ factory, representative, office, client, collaborator , service } : { factory: React.ReactNode, representative: React.ReactNode, client: React.ReactNode, office: React.ReactNode, collaborator: React.ReactNode, service: React.ReactNode }) {
  const [tab, setTab] = useState<IconT>('factory');
  
  return (
    <div className="flex flex-col gap-4 px-20 py-10 h-full">
      <Header page='Cadastros' tab={tab} />
      <Tabs className='flex-1' defaultValue="factory" onValueChange={(value: IconT) => { setTab(value) }}>
        <TabsList >
          <TabsTrigger value="factory">Fábricas</TabsTrigger>
          <TabsTrigger value="client">Clientes</TabsTrigger>
          <TabsTrigger value="representative">Representação</TabsTrigger>
          <TabsTrigger value="office">Escritórios</TabsTrigger>
          <TabsTrigger value="service">Serviços</TabsTrigger>
          <TabsTrigger value="collaborator">Colaboradores</TabsTrigger>
        </TabsList>
      <TabsContent value="factory">{factory}</TabsContent>
      <TabsContent value="representative">{representative}</TabsContent>
      <TabsContent value="client">{client}</TabsContent>
      <TabsContent value="office">{office}</TabsContent>
      <TabsContent value="service">{service}</TabsContent>
      <TabsContent value="collaborator">{collaborator}</TabsContent>
    </Tabs>
  </div>
  )
}
