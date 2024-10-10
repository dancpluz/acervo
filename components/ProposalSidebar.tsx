'use client'

import Image from "next/image";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Info, Activity, Scroll, TriangleAlert, SquarePen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SideAccordion({ icon, title, expanded, value, children }: { title: string, icon: React.ReactElement, value: string, expanded: boolean, children: React.ReactNode }) {
  return (
    <>
      <AccordionItem className='border-0 w-full' value={value}>
        <AccordionTrigger className={`p-0 ${expanded ? '' : '[&>svg]:hidden'}`}>
          <div className='flex gap-2 items-center'>
            {icon}
            {expanded && <h2 className='text-xl font-normal'>{title}</h2>}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {children}
        </AccordionContent>
      </AccordionItem>
    </>
  )
}

export function SideButton({ icon, title, expanded }: { title: string, icon: React.ReactElement, expanded: boolean }) {
  return (
    <Button onClick={() => console.log('TEst')} variant='outline' className={`p-1 h-auto border-secondary justify-start text-base ${expanded ? 'w-full' : 'border-0'}`}>
      {icon}
      {expanded && title}
    </Button>
  )
} 

export default function ProposalSidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside style={{ width: expanded ? '280px' : '72px' }} className={`fixed flex flex-col bg-background justify-between items-center h-full py-10 inset-y-0 right-0 z-10 px-6 w-[72px] border-l border-secondary transition-all ${expanded ? "shadow-2xl" : ""}`}>
      <button className={`absolute flex justify-center items-center transition-all cursor-pointer w-5 h-5 top-32 -left-2.5 bg-secondary rounded-full ${expanded ? '' : 'rotate-180'}`} onClick={() => setExpanded(curr => !curr)}>
        <Image alt={'Expandir Aba'} src={'/icons/chevron.svg'} width={16} height={16} />
      </button>
      <Accordion className={`flex flex-col items-center gap-6 w-full ${expanded ? 'justify-start' : ''}`} type="single" collapsible>
        <SideAccordion icon={<Info className='w-8 h-8 text-primary' />} title='INFORMAÇÕES' expanded={expanded} value='1'>
          Test
        </SideAccordion>
        <SideAccordion icon={<Activity className='w-8 h-8 text-primary' />} title='AÇÕES' expanded={expanded} value='2'>
          Test
        </SideAccordion>
        <SideAccordion icon={<TriangleAlert className='w-8 h-8 text-primary' />} title='COMPLEMENTO' expanded={expanded} value='3'>
          Test
        </SideAccordion>
      </Accordion>
      <div className="flex flex-col gap-2 items-center w-full">
        <SideButton title='GERAR PROPOSTA' icon={<Scroll className='w-8 h-8 text-primary' />} expanded={expanded}/>
        <SideButton title='EDITAR PROPOSTA' icon={<SquarePen className='w-8 h-8 text-primary' />} expanded={expanded} />
        <SideButton title='EXCLUIR PROPOSTA' icon={<Trash2 className='w-8 h-8 text-primary' />} expanded={expanded} />
      </div>
    </aside>
  );
}
