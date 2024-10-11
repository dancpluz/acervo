'use client'

import Image from "next/image";
import { Eye, EyeOff, Trash, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PriceBox from '@/components/PriceBox'
import { MarkupT, ProductT, VersionT } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { PresentationToggleT, useCRMContext } from '@/hooks/useCRMContext'
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from '@/components/ui/label';

function GreyText({ className, children }: { className?: string, children: React.ReactNode }) {
  return <b className={cn('text-xs text-tertiary font-normal', className)}>{children}</b>
}

function BlackText({ className, children }: { className?: string, children: React.ReactNode }) {
  return <p className={cn('text-sm text-foreground', className)}>{children}</p>
}

function ToggleBox({ children, id }: { children: React.ReactNode, id: keyof PresentationToggleT }) {
  const { presentationToggle, setPresentationToggle } = useCRMContext()

  return (
    <div className="items-center flex gap-1">
      <Checkbox checked={presentationToggle[id]} onCheckedChange={(e) => setPresentationToggle(prev => ({...prev, [id]: e }))} id={id} />
      <Label htmlFor={id} className="text-sm w-full">
        {children}
      </Label>
    </div>
  )
}

export default function ProductCard({ view, product, index }: { view: 'list' | 'presentation', product: ProductT; index: number }) {

  const { proposal, setProposal, versionNum, calculatePrice, updateProductEnable, updateProductQuantity, presentationToggle, setPresentationToggle } = useCRMContext()

  const { id, name, quantity, finish, cost, enabled, markup } = product
  
  const price = calculatePrice(cost, markup as MarkupT, quantity)

  const handleEnableToggle = async () => {
    const newEnabledState = !enabled
    const versions = proposal.versions.map((version: VersionT) =>
      version.num === versionNum ?
        {
          ...version, products: version.products.map((product: ProductT, i: number) =>
            i === index ? { ...product, enabled: newEnabledState } : product
          )
        } : version
    )

    setProposal((prev) => ({ ...prev, versions }))

    try {
      await updateProductEnable(proposal.id, versionNum, index, newEnabledState)
    } catch (error) {
      console.error('Failed to update product enable status:', error)
    }
  }

  async function changeQuantity(quantity: number) {
    const versions = proposal.versions.map((version: VersionT) =>
      version.num === versionNum ?
        {
          ...version, products: version.products.map((product: ProductT, i: number) =>
            i === index ? { ...product, quantity } : product
          )
        } : version
    )

    setProposal((prev) => ({ ...prev, versions }))

    try {
      await updateProductQuantity(proposal.id, versionNum, index, quantity)
    } catch (error) {
      console.error('Failed to update product enable status:', error)
    }
  }

  const handleIncreaseQuantity = async () => {
    const newQuantity = quantity + 1
    await changeQuantity(newQuantity)
  }

  const handleDecreaseQuantity = async () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1 
      await changeQuantity(newQuantity)
    }
  }

  if (view === 'list') {
    return (
      <div className="flex border border-secondary gap-4 p-4 rounded-lg justify-between">
        <div style={{ opacity: enabled ? 1 : 0.5 }} className="w-32 h-32 border border-primary rounded-2xl">Imagem</div>
        <div style={{ opacity: enabled ? 1 : 0.5 }} className="flex flex-col grow">
          <div className="flex flex-col">
            <span className="text-tertiary text-xs">Item {id ? id : index + 1}</span>
            <h3 className="text-xl">{name}</h3>
          </div>
          <div className="flex grow justify-between">
            <div className="flex flex-col grow">
              <BlackText>
                {finish.width}cm<GreyText> x </GreyText>
                {finish.depth}cm<GreyText> x </GreyText>
                {finish.height}cm
              </BlackText>
              <BlackText>
                <GreyText>DESIGN BY </GreyText>
                {finish.designer}
              </BlackText>
            </div>
            <div className="flex flex-col grow">
              <BlackText>
                <GreyText>BASE/ESTRUTURA </GreyText>
                {finish.frame}
              </BlackText>
              <BlackText>
                <GreyText>TAMPO/TECIDO </GreyText>
                {finish.fabric}
              </BlackText>
            </div>
            <div className="flex flex-col grow">
              <BlackText>
                <GreyText>ACAB.3/OBS </GreyText>
                {finish.extra ? finish.extra : '-'}
              </BlackText>
              <BlackText>
                <GreyText>MARCAÇÃO </GreyText>
                {(markup as MarkupT ).name}
              </BlackText>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex items-center border border-primary rounded-sm grow-0">
              <Button onClick={handleDecreaseQuantity} variant="outline" className="w-8 h-8 p-0 border-primary text-base border-0">
                -
              </Button>
              <span className="flex items-center justify-center   w-8 h-8 border-l border-r border-primary">
                {quantity}
              </span>
              <Button onClick={handleIncreaseQuantity} variant="outline" className="w-8 h-8 p-0 border-primary text-base border-0">
                +
              </Button>
            </div>
            <div className="flex gap-2">
              <PriceBox className="text-sm p-[6px]" title="12x" text={formatCurrency(price.markup12)} />
              <PriceBox className="text-sm p-[6px]" title="6x" text={formatCurrency(price.markup6)} />
              <PriceBox className="text-sm p-[6px]" title="á vista" text={formatCurrency(price.markupCash)} />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between px-2 py-1">
          <Button
            onClick={handleEnableToggle}
            variant="ghost"
            className="p-1 h-auto"
          >
            {enabled ? (
              <Eye className="text-primary" />
            ) : (
              <EyeOff className="text-primary" />
            )}
          </Button>
          <Button variant="ghost" className="p-1 h-auto">
            <Edit className="text-primary" />
          </Button>
          <Button variant="ghost" className="p-1 h-auto">
            <Trash className="text-primary" />
          </Button>
        </div>
      </div>
    )
  } else {
    const textStyle = 'text-sm leading-0 text-wrap'

    const { sizes, markupName, designer, frame, fabric, extra, images, markup12, markup6, freight, markupCash } = presentationToggle;

    return (
      <div className='flex gap-4'>
        <div style={{ opacity: enabled ? 1 : 0.5 }} className='relative p-16 aspect-video border border-primary rounded-lg bg-[#feffff] grow'>
          <Image className='absolute top-8 right-8' alt={'Acervo'} src={'/acervo-sm.svg'} width={32} height={16} />
          <div className='flex h-full justify-between items-end gap-8'>
            <div className='flex flex-col w-[30%] gap-10'>
              <h3 className="text-xl">{name}</h3>
              <div>
                {markupName &&
                <BlackText className={textStyle}>
                  {markup.name}
                </BlackText>}
                {frame &&
                <BlackText className={textStyle}>
                  <GreyText className={textStyle}>Base/Estrutura - </GreyText>
                  {finish.frame}
                </BlackText>}
                {fabric &&
                <BlackText className={textStyle}>
                  <GreyText className={textStyle}>Tampo/Tecido - </GreyText>
                  {finish.fabric}
                </BlackText>}
                {extra && finish.extra &&
                <BlackText className={textStyle}>
                  <GreyText className={textStyle}>Acabamento 3 - </GreyText>
                  {finish.extra}
                </BlackText>}
              </div>
              {sizes && 
              <BlackText className={textStyle}>
                {finish.width}cm<GreyText className={textStyle}> x </GreyText>
                {finish.depth}cm<GreyText className={textStyle}> x </GreyText>
                {finish.height}cm
              </BlackText>}
              <div className='flex flex-col gap-2'>
                <BlackText className={textStyle}>
                  A partir de
                </BlackText>
                {markup12 && 
                <BlackText className={textStyle}>
                  {formatCurrency(price.markup12)} UND. em 12x
                </BlackText>}
                {markup6 &&
                <BlackText className={textStyle}>
                  {formatCurrency(price.markup6)} UND. em 6x
                </BlackText>}
                {markupCash &&
                <BlackText className={textStyle + ' text-base text-red-700'}>
                  {formatCurrency(price.markupCash)} UND. à vista
                </BlackText>}
                {freight && 
                <BlackText className={textStyle + ' text-red-700'}>
                  Frete incluso
                </BlackText>}
              </div>
            </div>
            <div className='flex flex-col w-[70%] gap-4 justify-end h-auto'>
              <div className='aspect-video bg-red-200'>
                IMAGEM
              </div>
              <div className='flex justify-between'>
                <span className={textStyle}>Portfólio, ACERVO</span>
                <span className={textStyle}>acervomobilia.com</span>
                {finish.designer && designer && <span className={textStyle}>designer {finish.designer}</span>}
              </div>
            </div> 
          </div>
        </div>
        <div className='w-[20%] flex flex-col border border-secondary gap-4 p-4 rounded-lg justify-between'>
          <div style={{ opacity: enabled ? 1 : 0.5 }} className="flex flex-col gap-2 grow">
            <div className="flex flex-col">
              <span className="text-tertiary text-xs truncate">Item {id ? id : index + 1}</span>
            <h3 className="text-xl">{name}</h3>
          </div>
          <div className='flex flex-col gap-2'>
            <ToggleBox id='markupName'>
              <BlackText>
                <GreyText className='text-sm'>MARCAÇÃO </GreyText>
                {markup.name}
              </BlackText>
            </ToggleBox>
            {finish.designer && 
            <ToggleBox id='designer'>
              <BlackText>
                <GreyText className='text-sm'>DESIGN BY </GreyText>
                {finish.designer}
              </BlackText>
            </ToggleBox>}
            <ToggleBox id='frame'>
              <BlackText>
                <GreyText className='text-sm'>BASE/ESTRUTURA </GreyText>
                {finish.frame}
              </BlackText>
            </ToggleBox>
            <ToggleBox id='fabric'>
              <BlackText>
                <GreyText className='text-sm'>TAMPO/TECIDO </GreyText>
                {finish.fabric}
              </BlackText>
            </ToggleBox>
            {extra && 
            <ToggleBox id='extra'>
              <BlackText>
                <GreyText className='text-sm'>ACAB. 3/OBS </GreyText>
                {finish.extra}
              </BlackText>
            </ToggleBox>}
            <ToggleBox id={'sizes'}>
              <BlackText className={textStyle}>
                {finish.width}cm<GreyText className={textStyle}> x </GreyText>
                {finish.depth}cm<GreyText className={textStyle}> x </GreyText>
                {finish.height}cm
              </BlackText>
            </ToggleBox>
            <ToggleBox id='images'>
              <GreyText className='text-sm'>IMAGENS ACABAMENTOS </GreyText>
            </ToggleBox>
            <ToggleBox id='freight'>
              <GreyText className='text-sm'>FRETE INCLUSO </GreyText>
            </ToggleBox>
            <PriceBox className='py-1 text-sm' title='12x' text={formatCurrency(price.markup12)} active={markup12} onClick={() => setPresentationToggle(prev => ({ ...prev, markup12: !markup12 }))} />
            <PriceBox className='py-1 text-sm' title='6x' text={formatCurrency(price.markup6)} active={markup6} onClick={() => setPresentationToggle(prev => ({ ...prev, markup6: !markup6 }))} />
            <PriceBox className='py-1 text-sm' title='á vista' text={formatCurrency(price.markupCash)} active={markupCash} onClick={() => setPresentationToggle(prev => ({ ...prev, markupCash: !markupCash }))} />
          </div>
          </div>
          <div className="flex justify-between px-2 py-1">
            <Button
              onClick={handleEnableToggle}
              variant="ghost"
              className="p-1 h-auto"
            >
              {enabled ? (
                <Eye className="text-primary" />
              ) : (
                <EyeOff className="text-primary" />
              )}
            </Button>
            <Button variant="ghost" className="p-1 h-auto">
              <Edit className="text-primary" />
            </Button>
            <Button variant="ghost" className="p-1 h-auto">
              <Trash className="text-primary" />
            </Button>
        </div>
        </div>
      </div>
    )
  }

}