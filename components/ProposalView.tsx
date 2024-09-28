'use client'

import { StatusButton } from "@/components/StatusButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { CirclePlus, Search, Eye, List } from 'lucide-react';
import PriceBox from "@/components/PriceBox";
import VersionOptions from '@/components/VersionOptions'
import ProductCard from "@/components/ProductCard";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ProposalView() {
  return (
    <>
      <div className='flex justify-between'>
        <div className='flex gap-2 py-3'>
          <StatusButton type='front' text='Solicitado' statusNum={Number(2)} num={1} onClick={() => console.log('test')} />
          <StatusButton type='both' text='Enviado' statusNum={Number(2)} num={2} onClick={() => console.log('test')} />
          <StatusButton type='both' text='Esperando' statusNum={Number(2)} num={3} onClick={() => console.log('test')} />
          <StatusButton type='both' text='Negociação' statusNum={Number(2)} num={4} onClick={() => console.log('test')} />
          <StatusButton type='back' text='Fechado' statusNum={Number(2)} num={5} onClick={() => console.log('test')} />
          <StatusButton type='lost' text='Perdido' statusNum={Number(2)} num={0} onClick={() => console.log('test')} />
        </div>
        Lista/apresenta
      </div>
      <Tabs className='flex flex-col grow overflow-hidden' defaultValue="1">
        <TabsList className='justify-between border-0'>
        {Array(3).fill(null).map((_,i) => (
          <TabsTrigger className='px-0 data-[state=active]:font-normal data-[state=active]:text-foreground' key={i} value={(i+1).toString()}>
            <VersionOptions num={i} active={i === 0} />
          </TabsTrigger>
        ))}
        </TabsList>
        <TabsContent className='py-2 flex flex-col gap-2 grow overflow-hidden'  value="1">
          <div className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
              <Button variant='outline' className='h-auto border-primary gap-1 rounded-lg py-2 px-2 text-xs text-primary'><List className='w-4 h-4' /></Button>
              <h3 className='text-xl'>SEM CATEGORIA</h3>
              <Button variant='ghost'  className='p-1 h-auto'><Eye className='text-primary w-6 h-6' /></Button>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' className='h-auto border-primary gap-1 rounded-lg py-2 px-2 text-xs text-primary'><Search className='w-4 h-4' />BUSCAR PRODUTOS</Button>
              <Button className='h-auto gap-1 rounded-lg py-2 px-2 text-xs'><CirclePlus className='w-4 h-4' />NOVO PRODUTO</Button>
            </div>
          </div>
          
            <ScrollArea className='grow'>
              <div className='flex flex-col gap-4 pr-2'>
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
              </div>
            </ScrollArea>
          
          <div className='flex justify-end items-center gap-2'>
            <PriceBox title='12x' />
            <PriceBox title='6x' text='R$24.000,00' />
            <PriceBox title='à vista' text='R$24.000,00' />
          </div>
        </TabsContent>
        <TabsContent value="2">klç</TabsContent>
        <TabsContent value="3">kl~ç</TabsContent>
      </Tabs>
    </>
  )
}
