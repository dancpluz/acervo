'use client'

import { StatusButton } from "@/components/StatusButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { CirclePlus, LoaderCircle, Search, Eye, EyeOff, List, Presentation, Rows3 } from 'lucide-react';
import PriceBox from "@/components/PriceBox";
import VersionOptions from '@/components/VersionOptions'
import ProductCard from "@/components/ProductCard";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import ProductForm from "@/components/ProductForm";
import { useCRMContext } from "@/hooks/useCRMContext";
import { ProductT, ProposalT } from "@/lib/types";
import { useEffect, useState } from "react";
import { formatCurrency, groupProductsByAmbient, timestampToDate, stringToSlug } from "@/lib/utils";
import PresentationSlides from "@/components/PresentationSlides";
import { Timestamp } from "firebase/firestore";
import { CRMPopup } from "@/components/AllPopups";
import React from "react";

export default function ProposalView({ data }: { data: string }) {
  const { setProposal, proposal, setVersionNum, versionNum, handleEnableToggle, getTotalValues, updateProposalStatus } = useCRMContext();
  const [view, setView] = useState<'list' | 'presentation'>('list');
  const { markup12, markup6, markupCash } = getTotalValues()
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    if (data) {
      const obj = JSON.parse(data) as ProposalT;
      obj.created_at = timestampToDate(obj.created_at as Timestamp)
      obj.last_updated = timestampToDate(obj.last_updated as Timestamp)
      setProposal(obj);
      setVersionNum(obj.versions.length || 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeStatus = async (status: string) => {
    if (proposal && status !== proposal.status) {
      setProposal((prev) => prev ? { ...prev, status } : prev)
      await updateProposalStatus(status);
    }
  }

  const handleHideProducts = (enabled, products) => {
    products.forEach((product) => handleEnableToggle(enabled, product.id))
  }

  return (
    <>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2 py-3'>
          {proposal ? 
          <>
            <StatusButton type='front' text='Solicitado' statusNum={Number(proposal.status)} num={1} onClick={() => changeStatus('1')} />
            <StatusButton type='both' text='Enviado' statusNum={Number(proposal.status)} num={2} onClick={() => changeStatus('2')} />
            <StatusButton type='both' text='Revisão' statusNum={Number(proposal.status)} num={3} onClick={() => changeStatus('3')} />
            <StatusButton type='both' text='Esperando' statusNum={Number(proposal.status)} num={4} onClick={() => changeStatus('4')} />
            <StatusButton type='both' text='Negociação' statusNum={Number(proposal.status)} num={5} onClick={() => changeStatus('5')} />
            <StatusButton type='back' text='Fechado' statusNum={Number(proposal.status)} num={6} onClick={() => changeStatus('6')} />
            <StatusButton type='lost' text='Perdido' statusNum={Number(proposal.status)} num={0} onClick={() => changeStatus('0')} />
          </>
          :
            <div>
              <LoaderCircle className='text-primary h-8 w-8 animate-spin' />
            </div>
        }
        </div>
        <Tabs onValueChange={(value) => setView(value as 'list' | 'presentation')} value={view} defaultValue="list">
          <TabsList className='flex h-auto border border-primary rounded-sm m-0'>
            <TabsTrigger className='flex text-base m-0 gap-2 px-3 py-2 text-primary data-[state=active]:border-b-0 border-r border-primary data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:font-normal' value="list">
              <Rows3 />
              <p>Lista</p>
            </TabsTrigger>
            <TabsTrigger className='flex text-base m-0 gap-2 px-3 py-2 text-primary data-[state=active]:border-b-0 border-primary data-[state=active]:bg-primary  data-[state=active]:text-background data-[state=active]:font-normal' value="presentation">
              <Presentation />
              <p>Apresentação</p>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Tabs className='flex flex-col relative grow overflow-hidden' defaultValue={versionNum.toString()} value={versionNum.toString()} onValueChange={(e) => setVersionNum(Number(e))}>
        {proposal && proposal.versions && proposal.versions.length > 0 ? 
          <>
            <TabsList className='mt-0 mb-2 justify-between border-0'>
              {proposal.versions.map(({ num }) => (
                <TabsTrigger className='px-0 data-[state=active]:font-normal data-[state=active]:text-foreground' key={num} value={num.toString()}>
                <VersionOptions num={num} active={num === versionNum} />
              </TabsTrigger>
            ))}
            </TabsList>
            {proposal.versions.map(({ num, products }) => {
              const ambients = groupProductsByAmbient(products)

            return (
              <TabsContent className='flex data-[state=active]:grow flex-col gap-2 overflow-hidden' key={num} value={num.toString()}>
                <ScrollArea>
                  <div className='flex flex-col gap-2 py-2'>
                    {Object.keys(ambients).map((ambient) => {
                      const productsAmbient = ambients[ambient]
                      const enabled = productsAmbient.filter((product) => product.enabled).length > 0

                      return (
                        <React.Fragment key={ambient}>
                          <div className='flex justify-between items-center'>
                            <div className='flex gap-2 items-center'>
                              {/* <Button variant='outline' className='h-auto border-primary gap-1 rounded-lg py-2 px-2 text-xs text-primary'><List className='w-4 h-4' /></Button> */}
                              <h3 className='text-lg'>{ambient.toUpperCase()}</h3>
                              {/* <Button onClick={() => handleHideProducts(enabled, products)} variant='ghost' className='p-1 h-auto'>
                                {enabled ? <Eye className='text-primary w-6 h-6' /> : <EyeOff className="text-primary" />}
                              </Button> */}
                            </div>
                          </div>
                          <div className='flex flex-col gap-4 pr-2'>
                            {productsAmbient.map((product, i) => view === 'list' ? 
                            (<ProductCard key={product.id + '-' + i} product={product} index={products.indexOf(product)} />) :
                              (<PresentationSlides key={product.id + '-' + i} product={product} index={products.indexOf(product)} />
                            ))}
                          </div>
                        </React.Fragment>
                      )
                    })}
                  </div>
                </ScrollArea>
                {view === 'list' && 
                  <div className='flex grow justify-end items-end gap-2'>
                    <PriceBox title='12x' text={formatCurrency(markup12)} />
                    <PriceBox title='6x' text={formatCurrency(markup6)} />
                    <PriceBox title='à vista' text={formatCurrency(markupCash)} />
                  </div>
                }
              </TabsContent>
            )
          })}
        </>
         : 
          <h2 className='mt-12 text-2xl'>Adicione novos Produtos</h2>
        }
        <div className='flex gap-2 mt-12 absolute top-0 right-0'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' className='h-auto border-primary bg-background gap-1 rounded-lg py-2 px-2 text-xs text-primary'><Search className='w-4 h-4' />BUSCAR PRODUTOS</Button>
            </DialogTrigger>
            <DialogContent className='w-[680px] h-[500px]'>
              WIP
            </DialogContent>
          </Dialog>
          <CRMPopup
            button={
              <Button className='h-auto gap-1 rounded-lg py-2 px-2 text-xs'>
                <CirclePlus className='w-4 h-4' />NOVO PRODUTO
              </Button>
            }
            popupOpen={popupOpen}
            setPopupOpen={setPopupOpen}
          >
            <ProductForm setPopupOpen={setPopupOpen} />
          </CRMPopup>
        </div>
      </Tabs>
    </>
  )
}
