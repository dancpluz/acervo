/* eslint-disable jsx-a11y/alt-text */
import { PresentationToggleT, useCRMContext } from "@/hooks/useCRMContext";
import { MarkupT, ProductT } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Presentation } from "react-pptx";
import Preview from "react-pptx/preview";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, calculatePriceMarkup } from "@/lib/utils";
import PriceBox from "./PriceBox";
import { BlackText, GreyText } from "./ProductCard";
import ProductButtons from './ProductButtons'


function ToggleBox({ children, productId, id }: { children: React.ReactNode, productId: string, id: keyof PresentationToggleT }) {
  const { presentationToggle, updatePresentationToggle } = useCRMContext()

  return (
    <div className="items-center flex gap-1">
      <Checkbox checked={presentationToggle[productId][id]} onCheckedChange={(e: boolean) => updatePresentationToggle(productId, id, e)} id={productId + '_' + id} />
      <Label htmlFor={productId + '_' + id} className="text-sm w-full">
        {children}
      </Label>
    </div>
  )
}



export default function PresentationSlides({ product, index }: { product: ProductT; index: number }) {
  const { createProductSlide, presentationToggle, updatePresentationToggle } = useCRMContext()

  const { id, name, quantity, finish, cost, enabled, markup } = product

  const price = calculatePriceMarkup(cost, markup as MarkupT, quantity)

  const textStyle = 'text-sm leading-0 text-wrap'

  const { images, markup12, markup6, markupCash } = presentationToggle[id];

  return (
    <div className='flex gap-4'>
      <Preview slideStyle={{
        border: '1px solid #485813',
        borderRadius: '0.5rem',
        width: '100%',
        height: 'auto',
        aspectRatio: '16/9',
        opacity: enabled && quantity > 0  ? 1 : 0.5
      }}>
        <Presentation>
          {index % 2 === 0 ? createProductSlide(product) : createProductSlide(product, true)}
        </Presentation>
      </Preview>
      <div className='w-[20%] flex flex-col border border-secondary gap-4 p-4 rounded-lg justify-between'>
        <div style={{ opacity: enabled && quantity > 0 ? 1 : 0.5 }} className="flex flex-col gap-2 grow">
          <div className="flex flex-col">
            <span className="text-tertiary text-xs truncate">Item {index + 1}{id && ` - ${id}`}</span>
            <h3 className="text-xl">{name}</h3>
          </div>
          <div className='flex flex-col gap-2'>
            <ToggleBox productId={id} id='markupName'>
              <BlackText>
                <GreyText className='text-sm'>MARCAÇÃO </GreyText>
                {(markup as MarkupT).name}
              </BlackText>
            </ToggleBox>
            {finish.designer &&
              <ToggleBox productId={id} id='designer'>
                <BlackText>
                  <GreyText className='text-sm'>DESIGN BY </GreyText>
                  {finish.designer}
                </BlackText>
              </ToggleBox>}
            <ToggleBox productId={id} id='frame'>
              <BlackText>
                <GreyText className='text-sm'>BASE/ESTRUTURA </GreyText>
                {finish.frame}
              </BlackText>
            </ToggleBox>
            <ToggleBox productId={id} id='fabric'>
              <BlackText>
                <GreyText className='text-sm'>TAMPO/TECIDO </GreyText>
                {finish.fabric}
              </BlackText>
            </ToggleBox>
            {finish.extra &&
              <ToggleBox productId={id} id='extra'>
                <BlackText>
                  <GreyText className='text-sm'>ACAB. 3/OBS </GreyText>
                  {finish.extra}
                </BlackText>
              </ToggleBox>}
            <ToggleBox productId={id} id={'sizes'}>
              <BlackText className={textStyle}>
                {finish.width}cm<GreyText className={textStyle}> x </GreyText>
                {finish.depth}cm<GreyText className={textStyle}> x </GreyText>
                {finish.height}cm
              </BlackText>
            </ToggleBox>
            {/* <ToggleBox productId={id} id='images'>
              <GreyText className='text-sm'>IMAGENS ACABAMENTOS </GreyText>
            </ToggleBox> */}
            <PriceBox className='py-1 text-sm' title='12x' text={formatCurrency(price.markup12)} active={markup12} onClick={() => updatePresentationToggle(id, 'markup12', !markup12)} />
            <PriceBox className='py-1 text-sm' title='6x' text={formatCurrency(price.markup6)} active={markup6} onClick={() => updatePresentationToggle(id, 'markup6', !markup6)} />
            <PriceBox className='py-1 text-sm' title='á vista' text={formatCurrency(price.markupCash)} active={markupCash} onClick={() => updatePresentationToggle(id, 'markupCash', !markupCash)} />
            <ToggleBox productId={id} id='freight'>
              <GreyText className='text-sm'>FRETE INCLUSO </GreyText>
            </ToggleBox>
          </div>
        </div>
        <div className="flex justify-between px-2 py-1">
          <ProductButtons enabled={enabled} id={id} product={product} />
        </div>
      </div>
    </div>
  )
}
