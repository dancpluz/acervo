'use client'

import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react";
import { IconT } from "@/components/Header"; 
import Link from "next/link";
import { usePathname } from 'next/navigation'

const TabsLinkTrigger: React.FC<{ value: string; children: React.ReactNode }> = ({
  value,
  children,
}) => (
  <TabsTrigger value={value} asChild>
    <Link href={`/cadastros/${value}`}>{children}</Link>
  </TabsTrigger>
);

export function CadastrosTabs() {
  return (
    <TabsList>
      <TabsLinkTrigger value="fabricas">Fábricas</TabsLinkTrigger>
      <TabsLinkTrigger value="clientes">Clientes</TabsLinkTrigger>
      <TabsLinkTrigger value="representacoes">Representação</TabsLinkTrigger>
      <TabsLinkTrigger value="escritorios">Escritórios</TabsLinkTrigger>
      <TabsLinkTrigger value="servicos">Serviços</TabsLinkTrigger>
      <TabsLinkTrigger value="colaboradores">Colaboradores</TabsLinkTrigger>
    </TabsList>
	);
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [tab, setTab] = useState<IconT>(path.split('/')[2]);
  
  return (
    <div className="flex flex-col gap-4 px-20 py-10 h-screen">
      <Header page='Cadastros' tab={tab} />
      <Tabs className='flex-1' defaultValue={path.split('/')[2]} onValueChange={(value: IconT) => { setTab(value) }}>
        <CadastrosTabs />
      {children}
      </Tabs>
    </div>
  )
}
