'use client'

import { Button } from '@/components/ui/button'
import PriceBox from '@/components/PriceBox'
import { MarkupT, ProductT, VersionT } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { useCRMContext } from '@/hooks/useCRMContext'
import { cn, calculatePriceMarkup } from "@/lib/utils"
import Image from 'next/image'
import { Image as ImageIcon } from 'lucide-react';
import ProductButtons from './ProductButtons'

export function GreyText({ className, children }: { className?: string, children: React.ReactNode }) {
  return <b className={cn('text-xs text-tertiary font-normal', className)}>{children}</b>
}

export function BlackText({ className, children }: { className?: string, children: React.ReactNode }) {
  return <p className={cn('text-sm text-foreground', className)}>{children}</p>
}

export default function ProductCard({ product, index }: { product: ProductT; index: number }) {
  const { proposal, setProposal, versionNum, updateProductQuantity } = useCRMContext()
  const { id, name, quantity, finish, cost, enabled, markup, image } = product
  
  const price = calculatePriceMarkup(cost, markup as MarkupT, quantity)

  async function changeQuantity(quantity: number) {
    const versions = proposal.versions.map((version: VersionT) =>
      version.num === versionNum ?
        {
          ...version, products: version.products.map((product: ProductT) =>
            product.id === id ? { ...product, quantity } : product
          )
        } : version
    )

    setProposal((prev) => prev ? ({ ...prev, versions }) : prev)

    try {
      await updateProductQuantity(id, quantity)
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

  return (
    <div className="flex border border-secondary gap-4 p-4 rounded-lg justify-between">
      <div style={{ opacity: enabled && quantity > 0 ? 1 : 0.5 }} className="flex justify-center items-center border border-primary overflow-hidden rounded-2xl w-32 h-32">
        {image && image.path.toLowerCase().includes("http") ? 
          <Image alt={id} className='object-cover' width={128} height={128} src={image.path} />
        :
          <ImageIcon className='text-primary'/>
        }
      </div>
      <div style={{ opacity: enabled && quantity > 0 ? 1 : 0.5 }} className="flex flex-col grow">
        <div className="flex flex-col">
          <span className="text-tertiary text-xs">Item {index + 1}{id && ` - ${id}`}</span>
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
              {finish.designer ? finish.designer : '-'}
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
        <ProductButtons enabled={enabled} id={id} product={product} />
      </div>
    </div>
  )
}