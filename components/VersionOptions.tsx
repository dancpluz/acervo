'use client'

import { ChevronDown, Copy, Trash, FileText, Presentation } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function VersionOptions({ num, active } : { num: number, active: boolean }) {
  return (
    <Popover>
      <div className='flex gap-1'>
        VERSÃO {(num+1).toString()}
      {active && 
      <>
        <PopoverTrigger asChild>
          <div className='h-auto p-1 rounded-md bg-transparent transition-colors hover:bg-secondary/20'>
            <ChevronDown className='w-5 h-5' />
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-auto text-foreground bg-background p-1 rounded-lg'>
          <div className='flex flex-col gap-1'>
            <Button variant='ghost' className='justify-start p-1 pr-2 h-auto'>
              <Copy className='w-4 h-4' /> Duplicar Proposta
            </Button>
            <Button variant='ghost' className='justify-start p-1 pr-2 h-auto'>
              <Trash className='w-4 h-4' /> Excluir Proposta
            </Button>
            <Button variant='ghost' className='justify-start p-1 pr-2 h-auto'>
              <FileText className='w-4 h-4' /> Exportar PDF
            </Button>
            <Button variant='ghost' className='justify-start p-1 pr-2 h-auto'>
              <Presentation className='w-4 h-4' /> Exportar Apresentação
            </Button>
          </div>
        </PopoverContent>
      </>}
      </div>
    </Popover>
  )
}