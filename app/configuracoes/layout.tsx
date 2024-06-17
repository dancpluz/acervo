'use client'

import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Layout({ general, markup } : { general: React.ReactNode, markup: React.ReactNode }) {
  
  return (
    <div className="flex flex-col gap-4 px-20 py-10 h-full">
      <Header page='Configurações' />
      <Tabs className='flex-1' defaultValue="general">
        <TabsList >
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="markup">Marcação e Frete</TabsTrigger>
        </TabsList>
      <TabsContent value="general">{general}</TabsContent>
      <TabsContent value="markup">{markup}</TabsContent>
    </Tabs>
  </div>
  )
}
