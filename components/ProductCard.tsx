'use client'

import { Eye, EyeOff, Trash, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PriceBox from './PriceBox'
import { MarkupT, ProductT, VersionT } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { useCRMContext } from '@/hooks/useCRMContext'

export default function ProductCard({ product, index }: { product: ProductT; index: number }) {
  function GreyText({ children }: { children: React.ReactNode }) {
    return <b className="text-tertiary font-normal text-xs ">{children}</b>
  }

  function BlackText({ children }: { children: React.ReactNode }) {
    return <p className="text-foreground text-sm">{children}</p>
  }

  const { proposal, setProposal, versionNum, calculatePrice, updateProductEnable, updateProductQuantity } = useCRMContext()

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
              {finish.height}cm<GreyText> x </GreyText>
              {finish.depth}cm
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
              {markup.name}
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
}