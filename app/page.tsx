'use client'

import Image from "next/image";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


type Props = {
  icon: string;
  title: string;
  active?: boolean;
}

export default function Home() {
  const [expanded, setExpanded] = useState(false);

  function SidebarItem({ icon, title, active }: Props) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip disableHoverableContent={true}>
          <TooltipTrigger asChild>
            <div className={`w-full flex items-center p-3 gap-4 rounded-lg ${expanded ? "justify-start" : ""} ${active ? "bg-primary" : "cursor-pointer hover:outline outline-secondary outline-1"}`}>
              <Image className={`absolute ${active ? "brightness-0 invert" : ""}`} alt={"Acessar Página de " + title} src={icon} width={32} height={32} />
              <h2 className={`overflow-hidden transition-all ml-12 text-lg ${active ? "text-background" : ""} ${expanded ? "" : "w-0"}`}>{title}</h2>
            </div>
          </TooltipTrigger>
          <TooltipContent className={`text-foreground bg-background ${expanded ? "hidden" : ""}`} side="right" sideOffset={8}>
            {title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  };

  return (
    <div className="bg-background" >
      <aside className={`fixed flex flex-col justify-between h-full py-10 inset-y-0 left-0 z-10 w-24 border-r border-secondary transition-all ${expanded ? "w-64" : ""}`}>
        <button className={`absolute flex justify-center items-center transition-all cursor-pointer w-5 h-5 top-20 -right-2.5 bg-secondary rounded-full ${expanded ? 'rotate-180' : ""}`} onClick={() => setExpanded(curr => !curr)}>
          <Image alt={'Expandir Aba'} src={'/icons/chevron.svg'} width={16} height={16} />
        </button>
        <div className="flex justify-center">
          Acervo
        </div>
        <nav className="flex flex-col px-5 gap-6">
          <SidebarItem icon={'/icons/desktop.svg'} title={'Atividades'} />
          <SidebarItem icon={'/icons/users.svg'} title={'Cadastros'} active />
          <SidebarItem icon={'/icons/pie-chart.svg'} title={'CRM'} />
          <SidebarItem icon={'/icons/catalog.svg'} title={'Catálogo'} />
          <SidebarItem icon={'/icons/calculator.svg'} title={'Orçamento'} />
        </nav>
        <div className="px-5">
          <SidebarItem icon={'/icons/config.svg'} title={'Configurações'} />
        </div>
      </aside>

    </div>
  );
}
