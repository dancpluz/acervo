/* eslint-disable jsx-a11y/alt-text */
import { PresentationToggleT, useCRMContext } from "@/hooks/useCRMContext";
import { MarkupT, ProductT } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Presentation, Slide, Text, Shape, Image } from "react-pptx";
import Preview from "react-pptx/preview";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import { Eye, EyeOff, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import PriceBox from "./PriceBox";
import { BlackText, GreyText } from "./ProductCard";

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
  const { calculatePrice, presentationToggle, updatePresentationToggle, handleEnableToggle } = useCRMContext()

  const { id, name, quantity, finish, cost, enabled, markup } = product

  const price = calculatePrice(cost, markup as MarkupT, quantity)

  const textStyle = 'text-sm leading-0 text-wrap'

  const { sizes, markupName, designer, frame, fabric, extra, images, markup12, markup6, freight, markupCash } = presentationToggle[id];

  const fontFace = 'Open Sans';
  const small = 10;
  const big = 13;
  const space = 2;

  return (
    <div className='flex gap-4'>
      <Preview slideStyle={{
        border: '1px solid #485813',
        borderRadius: '0.5rem',
        width: '100%',
        height: 'auto',
        aspectRatio: '16/9',
        opacity: enabled ? 1 : 0.5
      }}>
        <Presentation>
          <Slide style={{
            backgroundColor: "#feffff"
          }}>
            <Image
              src={{ kind: "path", path: "/acervo-sm.svg" }}
              style={{ x: 9.4, y: 0.2, w: 0.3, h: 0.3 }}
            />
            <Text style={{
              x: 0.5, y: 3.9, w: 3,
              fontSize: small,
              fontFace,
              verticalAlign: 'bottom',
            }}>
              <Text.Bullet style={{
                fontSize: big,
                fontFace,
                bold: true,
                paraSpaceBefore: 16,
                paraSpaceAfter: 16,
              }}>
                {name}
              </Text.Bullet>
              <Text.Bullet>
                {markupName ? `${markup.name}` : ''}
              </Text.Bullet>
              <Text.Bullet>
                {frame ? `Base/Estrutura - ${finish.frame}` : ''}
              </Text.Bullet>
              <Text.Bullet>
                {fabric ? `Tampo/Tecido - ${finish.fabric}` : ''}
              </Text.Bullet>
              <Text.Bullet>
                {extra && finish.extra ? `Acabamento 3 - ${finish.extra}` : ''}
              </Text.Bullet>
              <Text.Bullet style={{ paraSpaceBefore: 14, paraSpaceAfter: 14 }}>
                {sizes ? `${finish.width}cm x ${finish.depth}cm x ${finish.height}cm` : ''}
              </Text.Bullet>
              <Text.Bullet style={{ bold: true, paraSpaceBefore: space, paraSpaceAfter: space }}>
                {`A partir de`}
              </Text.Bullet>
              <Text.Bullet style={{ bold: true, paraSpaceBefore: space, paraSpaceAfter: space }}>
                {markup12 ? `${formatCurrency(price.markup12)} UND. em 12x` : ''}
              </Text.Bullet>
              <Text.Bullet style={{ bold: true, paraSpaceBefore: space, paraSpaceAfter: space }}>
                {markup6 ? `${formatCurrency(price.markup6)} UND. em 6x` : ''}
              </Text.Bullet>
              <Text.Bullet style={{ color: '#a53825',fontSize: small + 2, bold: true, paraSpaceBefore: space, paraSpaceAfter: space }}>
                {markupCash ? `${formatCurrency(price.markupCash)} UND. à vista` : ''}
              </Text.Bullet>
              <Text.Bullet style={{ color: '#a53825', bold: true, paraSpaceBefore: space, paraSpaceAfter: space }}>
                {freight ? `Frete incluso` : ''}
              </Text.Bullet>
            </Text>
            <Image
              src={{ kind: "path", path: "https://placehold.co/600x400?text=Imagem" }}
              style={{ x: 4, y: 1, w: 5.4, h: 3.6 }}
            />
            <Text style={{
              x: 4, y: 4.7, w: 1.5, h: 0.4,
              fontSize: small,
              fontFace,
            }}>
              Portfólio, ACERVO
            </Text>
            <Text style={{
              x: 6, y: 4.7, w: 1.5, h: 0.4,
              fontSize: small,
              fontFace,
              align: 'center',
            }}>
              acervomobilia.com
            </Text>
            <Text style={{
              x: 7.9, y: 4.7, w: 1.5, h: 0.4,
              fontSize: small,
              fontFace,
              align: 'right',
            }}>
              {designer && finish.designer ? `designer ${finish.designer}` : ''}
            </Text>
          </Slide>
        </Presentation>
      </Preview>
      <div className='w-[20%] flex flex-col border border-secondary gap-4 p-4 rounded-lg justify-between'>
        <div style={{ opacity: enabled ? 1 : 0.5 }} className="flex flex-col gap-2 grow">
          <div className="flex flex-col">
            <span className="text-tertiary text-xs truncate">Item {id ? id : index + 1}</span>
            <h3 className="text-xl">{name}</h3>
          </div>
          <div className='flex flex-col gap-2'>
            <ToggleBox productId={id} id='markupName'>
              <BlackText>
                <GreyText className='text-sm'>MARCAÇÃO </GreyText>
                {markup.name}
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
          <Button
            onClick={() => handleEnableToggle(enabled, index)}
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
