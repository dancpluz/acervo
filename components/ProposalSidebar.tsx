'use client'

import Image from "next/image";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Info, Activity, Scroll, CircleEllipsis, SquarePen, Trash2, User, PersonStanding, Armchair, Shapes, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCRMContext } from "@/hooks/useCRMContext";
import { format } from 'date-fns';

function SideAccordion({ icon, title, expanded, value, children }: { title: string, icon: React.ReactElement, value: string, expanded: boolean, children: React.ReactNode }) {
  return (
    <>
      <AccordionItem className='border-0 w-full' value={value}>
        <AccordionTrigger className={`p-0 ${expanded ? '' : '[&>svg]:hidden'}`}>
          <div className='flex gap-2 items-center'>
            {icon}
            {expanded && <h2 className='text-xl font-normal'>{title}</h2>}
          </div>
        </AccordionTrigger>
        <AccordionContent className='flex flex-col gap-2 pt-4 pb-0'>
          {children}
        </AccordionContent>
      </AccordionItem>
    </>
  )
}

function SideButton({ icon, title, expanded }: { title: string, icon: React.ReactElement, expanded: boolean }) {
  return (
    <Button onClick={() => console.log('TEst')} variant='outline' className={`p-1 h-auto border-secondary justify-start text-base ${expanded ? 'w-full' : 'border-0'}`}>
      {icon}
      {expanded && title}
    </Button>
  )
}

function InfoIcon({ icon, title, text }: { icon: React.ReactElement, title: string, text: string }) {
  return (
    <div className='flex gap-2 items-center'>
      {icon}
      <div className='flex flex-col'>
        <p className='text-tertiary text-sm uppercase leading-none'>{title}</p>
        <span className='text-sm leading-none'>{text}</span>
      </div>
    </div>
  )
}

export default function ProposalSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState('');
  const { proposal } = useCRMContext();

  return (
    <aside style={{ width: expanded ? '280px' : '72px' }} className={`fixed flex flex-col bg-background justify-between items-center h-full py-10 inset-y-0 right-0 z-10 px-6 w-[72px] border-l border-secondary transition-all ${expanded ? "shadow-2xl" : ""}`}>
      <button className={`absolute flex justify-center items-center transition-all cursor-pointer w-5 h-5 top-32 -left-2.5 bg-secondary rounded-full ${expanded ? '' : 'rotate-180'}`} onClick={expanded ? () => {setAccordionOpen(''); setExpanded(false)} : () => setExpanded(true)}>
        <Image alt={'Expandir Aba'} src={'/icons/chevron.svg'} width={16} height={16} />
      </button>
      <Accordion onValueChange={(e) => {expanded ? setAccordionOpen(e) : setExpanded(true); setAccordionOpen(e)}} value={accordionOpen} className={`flex flex-col items-center gap-6 w-full ${expanded ? 'justify-start' : ''}`} type="single" collapsible>
        <SideAccordion icon={<Info className='w-8 h-8 text-primary' />} title='INFORMAÇÕES' expanded={expanded} value='1'>
          {proposal ? 
          <>
            <InfoIcon icon={<User className='text-primary' />} title='Colaborador' text={proposal.collaborator.person.label} />
            <InfoIcon icon={<PersonStanding className='text-primary' />} title='Cliente' text={proposal.client.person.label} />
            <InfoIcon icon={<Armchair className='text-primary' />} title='Escritório' text={proposal.office.person.label} />
              <InfoIcon icon={<Shapes className='text-primary' />} title='Tipo de cliente' text={proposal.client_type ? proposal.client_type : 'Sem tipo definido'} />
            <InfoIcon icon={<Calendar className='text-primary' />} title='Criado em' text={format(proposal.created_at, "dd/MM/yyyy")} />
            <InfoIcon icon={<MessageCircle className='text-primary' />} title='observações' text={proposal.observations ? proposal.observations : 'Sem observações'} />
          </>
            :
            <div>Carregando...</div>}
        </SideAccordion>
        <SideAccordion icon={<Activity className='w-8 h-8 text-primary' />} title='AÇÕES' expanded={expanded} value='2'>
          Test
        </SideAccordion>
        <SideAccordion icon={<CircleEllipsis className='w-8 h-8 text-primary' />} title='COMPLEMENTO' expanded={expanded} value='3'>
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
