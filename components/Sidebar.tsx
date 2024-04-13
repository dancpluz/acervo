'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from 'next/navigation';

type Props = {
  icon: string;
  title: string;
  slug: string;
}

export default function SideBar() {
  const [expanded, setExpanded] = useState(false);
  const currentPage = usePathname().split('/')[1];

  function SidebarItem({ icon, title, slug }: Props) {
    const active = slug == currentPage;

    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip disableHoverableContent={true}>
          <TooltipTrigger asChild>
            <Link href={slug}>
              <div className={`w-full flex items-center p-3 gap-4 rounded-lg ${expanded ? "justify-start" : ""} ${active ? "bg-primary" : "hover:outline outline-secondary outline-1 active:bg-secondary/20"}`}>
                <Image className={`absolute ${active ? "brightness-0 invert" : ""}`} alt={"Acessar Página de " + title} src={icon} width={32} height={32} />
                <h2 className={`overflow-hidden transition-all ml-12 text-lg ${active ? "text-background font-medium" : ""} ${expanded ? "" : "w-0"}`}>{title}</h2>
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent className={`text-foreground bg-background ${expanded ? "hidden" : ""}`} side="right" sideOffset={8}>
            {title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  };

  return (
    <aside className={`fixed flex flex-col bg-background justify-between h-full py-10 inset-y-0 left-0 z-10 w-24 border-r border-secondary transition-all ${expanded ? "w-64" : ""}`}>
      <button className={`absolute flex justify-center items-center transition-all cursor-pointer w-5 h-5 top-32 -right-2.5 bg-secondary rounded-full ${expanded ? 'rotate-180' : ""}`} onClick={() => setExpanded(curr => !curr)}>
        <Image alt={'Expandir Aba'} src={'/icons/chevron.svg'} width={16} height={16} />
      </button>
      <Link href='/'>
        <div className='flex py-4 justify-center items-center'>
          <Image className={`transition-opacity ${expanded ? 'opacity-0' : ''}`} alt={'Acervo'} src={'/acervo-sm.svg'} width={52} height={52} />
          <Image className={`transition-opacity absolute ${expanded ? '' : 'opacity-0'}`} alt={'Acervo'} src={'/acervo-bg.svg'} width={150} height={52} />
        </div>
      </Link>
      <nav className="flex flex-col px-5 gap-6">
        <SidebarItem icon={'/icons/desktop.svg'} title={'Atividades'} slug={'atividades'} />
        <SidebarItem icon={'/icons/users.svg'} title={'Cadastros'} slug={'cadastros'}  />
        <SidebarItem icon={'/icons/pie-chart.svg'} title={'CRM'} slug={'crm'}  />
        <SidebarItem icon={'/icons/catalog.svg'} title={'Catálogo'} slug={'catalogo'}  />
        <SidebarItem icon={'/icons/calculator.svg'} title={'Orçamento'} slug={'orcamento'} />
      </nav>
      <div className="px-5">
        <SidebarItem icon={'/icons/config.svg'} title={'Configurações'} slug={'configuracoes'} />
      </div>
    </aside>
  );
}
