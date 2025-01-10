/* eslint-disable jsx-a11y/alt-text */
'use client'

import { Document, Page, Text, View, Font, Image, PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { FileDown, LoaderCircle } from 'lucide-react';
import { useCRMContext } from "@/hooks/useCRMContext";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { FactoryT, FreightT, MarkupT, ProductT } from "@/lib/types";
import { calculateCostMarkup, formatCurrency, paymentEnum, groupProductsByAmbient, cn } from '@/lib/utils'
import { conformNumberToMask, symbolCostMask, dayMask } from "@/lib/masks";

Font.register({
  family: 'Poppins',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrFJDUc1NECPY.ttf', // Poppins Regular
    },
    {
      src: 'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9V1tvFP-KUEg.ttf', // Poppins Medium
      fontWeight: 'medium',
    },
    {
      src: 'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6V1tvFP-KUEg.ttf', // Poppins SemiBold
      fontWeight: 'semibold',
    },
  ],
});

const tw = createTw({
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        background: '#F7F1EA',
        foreground: '#333333',
        primary: '#465613',
        secondary: '#BCC1AB',
        tertiary: '#6B6B6B',
        alternate: '#C1C1C1',
        destructive: '#D3533D',
      },
    },
  },
});

function PriceBox({ title, value, active=false, className }: { title: string, value: string, active?: boolean, className?: string }) {
  return ( 
    <View style={tw('flex flex-row rounded-md border border-primary text-[9px]')}>
      <View style={tw(cn('py-1 px-2 text-center border-r border-primary', className, active ? 'bg-primary text-background' : 'text-tertiary'))}>
        <Text>{title}</Text>
      </View>
      <View style={tw(cn('py-1 px-2  text-center',className))}>
        <Text>{value}</Text>
      </View>
    </View>
  )
}

function ComplementBox({ title, value }: { title: string, value: string }) {
  return ( 
    <View style={tw('flex p-2 gap-1 items-center flex-col rounded-md border border-primary')}>
      <Text style={tw('text-[8px] leading-none')}>
        {title.toUpperCase()}
      </Text>
      <Text style={tw('text-sm font-bold')}>
        {value}
      </Text>
    </View>
  )
}

function ProductPDFCard({ product, index }: { product: ProductT; index: number }) {
  const { name, quantity, finish, image, cost, markup, factory, freight } = product
  const price = calculateCostMarkup({ cost: cost.toString(), quantity, selectedFactory: factory as FactoryT, selectedFreight: freight as FreightT, selectedMarkup: markup as MarkupT })
  const { fabric_img, frame_img, extra_img } = finish

  return (
    <View style={tw('flex flex-row border border-secondary  gap-2 p-4 rounded-lg justify-between')}>
      <View style={tw('flex items-center justify-center border border-primary overflow-hidden rounded-2xl h-32 min-w-32')}>
        {image && image.path.includes("http") ? 
          <Image style={tw("object-cover rounded-2xl w-full h-full")} src={image.path} /> 
          : 
          <Text style={tw('text-lg')}>Sem foto</Text>
        }
      </View>
      <View style={tw('flex flex-col w-full')}>

        <View style={tw('flex flex-row justify-between items-center gap-4')}>
          <View style={tw('flex flex-col')}>
            <Text style={tw('text-tertiary text-xs')}>Item {index + 1}</Text>
            <Text style={tw('text-lg')}>{name}</Text>
          </View>
          <View style={tw('flex flex-row gap-2')}>
            {frame_img && frame_img.path.includes("http") && 
              <View style={tw('flex items-center justify-center border border-primary overflow-hidden rounded-xl h-8 min-w-8')}>
                <Image style={tw("object-cover rounded-xl w-full h-full")} src={frame_img.path} />
              </View>
            }
            {fabric_img && fabric_img.path.includes("http") &&
              <View style={tw('flex items-center justify-center border border-primary overflow-hidden rounded-xl h-8 min-w-8')}>
                <Image style={tw("object-cover rounded-xl w-full h-full")} src={fabric_img.path} />
              </View>
            }
            {extra_img && extra_img.path.includes("http") &&
              <View style={tw('flex items-center justify-center border border-primary overflow-hidden rounded-xl h-8 min-w-8')}>
                <Image style={tw("object-cover rounded-xl w-full h-full")} src={extra_img.path} />
              </View>
            }
          </View>
        </View>
        <View style={tw('flex flex-col gap-2')}>
          <View style={tw('flex flex-row gap-4 justify-between')}>
            <View style={tw('flex flex-col gap-1 w-[30%]')}>
              <Text style={tw("text-[8px] leading-none")}><Text style={tw("text-tertiary")}>LARGURA </Text>{finish.width}cm</Text>
              <Text style={tw("text-[8px] leading-none")}><Text style={tw("text-tertiary")}>PROFUNDIDADE </Text>{finish.depth}cm</Text>
              <Text style={tw("text-[8px] leading-none")}><Text style={tw("text-tertiary")}>ALTURA </Text>{finish.height}cm</Text>
            </View>
            <View style={tw('flex flex-col gap-1 w-[40%]')}>
              <Text style={tw("text-[8px] leading-none")}><Text style={tw("text-tertiary")}>BASE/ESTRUTURA </Text>{finish.frame}</Text>
              <Text style={tw("text-[8px] leading-none")}><Text style={tw("text-tertiary")}>TAMPO/TECIDO </Text>{finish.fabric}</Text>
            </View>
            <View style={tw('flex flex-col gap-1 w-[30%]')}>
              {finish.extra && <Text style={tw("text-[8px]  leading-none")}><Text style={tw("text-tertiary")}>ACAB. 3/OBS </Text>{finish.extra}</Text>}
              <Text style={tw("text-[8px] leading-none")}><Text style={tw("text-tertiary")}>MARCAÇÃO </Text>{(markup as MarkupT ).name}</Text>
              {finish.designer && <Text style={tw("text-[8px] leading-none")}><Text style={tw("text-tertiary")}>DESIGN BY </Text>{finish.designer}</Text>}
            </View>
          </View>
          <View style={tw('flex flex-row justify-between gap-2 items-end')}>
            <View style={tw('flex border border-primary rounded-md flex-row p-1 justify-center items-center')}>
              <Text style={tw('text-[9px]')}>
                {quantity > 1 ? quantity + ' Unidades' : quantity + ' Unidade'}
              </Text>
            </View>
            <View style={tw('flex flex-row gap-2')}>
              {Object.keys(price).filter(key => key !== 'costBase').map((key) => {
                const translate = { '12x' : '12x', '6x': '6x', 'cash': 'à vista' }
                return ( 
                  <PriceBox key={key} title={translate[key]} value={formatCurrency(price[key])}/>
                )
              }
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  )

}

export default function ProposalPDF() {
  const { proposal, versionNum, getTotalValues } = useCRMContext();

  function ProposalDocument() {
    const { products, complement } = proposal?.versions.find(({num}) => num === versionNum)
    const ambients = groupProductsByAmbient(products)
    const total = getTotalValues()

    const { freight, discount, deadline, expiration, payment_method, info, general_info } = complement
    const markup12 = total.markup12 + freight - discount
    const markup6 = total.markup6 + freight - discount
    const markupCash = total.markupCash + freight - discount

    return (
      <Document>
        <Page size="A4" style={tw("bg-background text-foreground p-12 font-sans flex flex-col gap-4")}>
          <View style={tw("flex flex-row")}>
            <View style={tw("flex flex-col gap-4")}>
              <Image style={tw("w-52 h-auto")} src='/acervo-bg.png' />
              <Text style={tw("text-sm")}><Text style={tw("font-semibold")}>Cliente: </Text>{proposal.client.person.label}</Text>
            </View>
            <View style={tw("flex flex-col gap-2 grow items-end")}>
              <Text style={tw("text-xs")}><Text style={tw("font-semibold")}>Nº da Proposta: </Text>#{proposal.num}</Text>
              <Text style={tw("text-xs")}><Text style={tw("font-semibold")}>Escritório: </Text>{proposal.office.person.label}</Text>
              <Text style={tw("text-xs")}><Text style={tw("font-semibold")}>Vendedor: </Text>{proposal.collaborator.person.label}</Text>
              <Text style={tw("text-xs")}><Text style={tw("font-semibold")}>Data: </Text>{format(proposal.created_at, "dd/MM/yyyy")}</Text>
            </View>
          </View>
          <View style={tw('flex flex-col gap-4 mt-2')}>
            <Text style={tw('text-xl border-primary border-b')}>
              LISTA DE PRODUTOS
            </Text>
            {Object.keys(ambients).map((ambient) => {
              const productsAmbients = ambients[ambient]
              return (
                <View key={ambient} style={tw('flex flex-col gap-2')}>
                  <Text style={tw('text-base')}>{ambient.toUpperCase()}</Text>
                  <View style={tw('flex flex-col gap-4')}>
                    {productsAmbients.filter(({ quantity, enabled }) => enabled && quantity > 0).map((product, i) => 
                      <ProductPDFCard key={product.id} product={product} index={products.indexOf(product)} />
                    )}
                  </View>
                </View>
              )
            })}
            <View wrap={false} style={tw('flex flex-col rounded-md border border-primary p-4 gap-3')}>
              <View style={tw('flex flex-col gap-2')}>
                <Text style={tw('text-xl')}>VALOR DA PROPOSTA</Text>
                <View style={tw('flex flex-row justify-between')}>
                  <View style={tw('flex flex-col min-w-[40%] gap-3')}>
                    {freight && <PriceBox title={'frete'} value={conformNumberToMask(freight.toString().replace('.', ','), symbolCostMask('+'))} className='text-base' />}
                    {discount && <PriceBox title={'desconto'} value={conformNumberToMask(discount.toString().replace('.', ','), symbolCostMask('-'))} className='text-base' />}
                    <PriceBox title={'12x'} value={formatCurrency(markup12)} className='text-base' />
                    <PriceBox title={'6x'} value={formatCurrency(markup6)} className='text-base' />
                    <PriceBox title={'à vista'} value={formatCurrency(markupCash)} className='text-base' />
                  </View>
                  <View style={tw('flex flex-col gap-3')}>
                    <ComplementBox title={'Forma de pagamento'} value={paymentEnum[payment_method]} />
                    <ComplementBox title={'Prazo de entrega'} value={conformNumberToMask(deadline, dayMask)} />
                    <ComplementBox title={'Validade da proposta'} value={conformNumberToMask(expiration, dayMask)} />
                  </View>
                </View>
              </View>
              {general_info && 
              <View style={tw('flex flex-col')}>
                <Text style={tw('text-lg')}>INFORMAÇÕES GERAIS</Text>
                <Text style={tw('text-sm')}>{general_info}</Text>
              </View>}
              {info && 
              <View style={tw('flex flex-col')}>
                <Text style={tw('text-lg')}>INFORMAÇÕES</Text>
                <Text style={tw('text-sm')}>{info}</Text>
              </View>}
              <View style={tw('flex flex-col')}>
                <Text style={tw('text-lg')}>ASSINATURA</Text>
                <Text style={tw('text-sm')}>{`Atenciosamente,
Departamento de Vendas`}</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    )
  }

  return (
    <div className='flex flex-col gap-2 p-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl'>Proposta em PDF - {proposal.name}</h2>
        <PDFDownloadLink document={<ProposalDocument />} fileName={`${proposal.id}.pdf`}>
          {({ loading }) => loading ?  
          <Button disabled className='pr-3'>
            BAIXAR
            <LoaderCircle className='text-background size-6 animate-spin' />
          </Button> : 
          <Button className='pr-3'>
            BAIXAR
            <FileDown className='text-background' />
          </Button>}
        </PDFDownloadLink>
      </div>
      <PDFViewer style={{ width: '100%', height: '100%' }}>
        <ProposalDocument />
      </PDFViewer>
    </div>
  );
}
