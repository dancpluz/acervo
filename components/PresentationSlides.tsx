/* eslint-disable jsx-a11y/alt-text */
import { PresentationToggleT, useCRMContext } from "@/hooks/useCRMContext";
import { FactoryT, FreightT, MarkupT, ProductT } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Presentation } from "react-pptx";
import Preview from "react-pptx/preview";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, calculateCostMarkup, getSlideImageDimensions } from "@/lib/utils";
import PriceBox from "./PriceBox";
import { BlackText, GreyText } from "./ProductCard";
import ProductButtons from './ProductButtons'
import { Slider } from "@/components/ui/slider"

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

  const { id, name, quantity, factory, freight, finish, image, cost, enabled, markup } = product

  const price = calculateCostMarkup({ cost: cost.toString(), quantity, selectedFactory: factory as FactoryT, selectedFreight: freight as FreightT, selectedMarkup: markup as MarkupT })

  const textStyle = 'text-sm leading-0 text-wrap'

  const { images, markup12, markup6, markupCash, imageX } = presentationToggle[id];

  const dimensions = getSlideImageDimensions(image.width, image.height, { w: 4.32, h: 2.88 })
  const maxPosition = 10 - 4.32 - dimensions.w

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
            {maxPosition > 0 &&
              <div className='flex flex-col gap-2'>
                <GreyText className='text-sm'>POSIÇÃO DA IMAGEM</GreyText>
                <Slider
                  onValueChange={(e) => updatePresentationToggle(id, 'imageX', e[0])}
                  defaultValue={[imageX]}
                  max={maxPosition}
                  step={0.01}
                />
              </div>
            }
            {images && 
            <ToggleBox productId={id} id='images'>
              <GreyText className='text-sm'>IMAGENS ACABAMENTOS </GreyText>
            </ToggleBox>}
            <PriceBox className='py-1 text-sm' title='12x' text={formatCurrency(price['12x'])} active={markup12} onClick={() => updatePresentationToggle(id, 'markup12', !markup12)} />
            <PriceBox className='py-1 text-sm' title='6x' text={formatCurrency(price['6x'])} active={markup6} onClick={() => updatePresentationToggle(id, 'markup6', !markup6)} />
            <PriceBox className='py-1 text-sm' title='á vista' text={formatCurrency(price['cash'])} active={markupCash} onClick={() => updatePresentationToggle(id, 'markupCash', !markupCash)} />
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
