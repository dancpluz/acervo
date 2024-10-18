/* eslint-disable jsx-a11y/alt-text */
'use client'

import { Document, Page, Text, View, Font, Image, PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { FileDown, LoaderCircle } from 'lucide-react';
import { useCRMContext } from "@/hooks/useCRMContext";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ProductT } from "@/lib/types";

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

function ProductSlideCard({ product, index }: { product: ProductT; index: number }) {
  const { id, name, quantity, finish, cost, enabled, markup } = product

  return (
    <View style={tw('flex flex-row border border-secondary  gap-2 p-4 rounded-lg justify-between')}>
      <Image style={tw("border border-primary rounded-2xl object-cover w-32 h-32")} src='https://placehold.co/128/png'/>
      <View style={tw('flex flex-col grow')}>
        <View style={tw('flex flex-col')}>
          <Text style={tw('text-tertiary text-xs')}>Item {index + 1}</Text>
          <Text style={tw('text-lg')}>{name}</Text>
        </View>
        <View style={tw('flex flex-row grow justify-between')}>
          <View style={tw('flex flex-col gap-1 grow')}>
            <Text style={tw("text-xs")}><Text style={tw("text-tertiary")}>LARGURA </Text>{finish.width}cm</Text>
            <Text style={tw("text-xs")}><Text style={tw("text-tertiary")}>PROFUNDIDADE </Text>{finish.depth}cm</Text>
            <Text style={tw("text-xs")}><Text style={tw("text-tertiary")}>ALTURA </Text>{finish.height}cm</Text>
          </View>
          <View style={tw('flex flex-col gap-1 grow')}>
            <Text style={tw("text-xs")}><Text style={tw("text-tertiary")}>BASE/ESTRUTURA </Text>{finish.frame}</Text>
            <Text style={tw("text-xs")}><Text style={tw("text-tertiary")}>TAMPO/TECIDO </Text>{finish.fabric}</Text>
          </View>
          <View style={tw('flex flex-col gap-1 grow')}>
            {finish.extra && <Text style={tw("text-xs")}><Text style={tw("text-tertiary")}>ACAB. 3/OBS </Text>{finish.extra}</Text>}
            <Text style={tw("text-xs")}><Text style={tw("text-tertiary")}>MARCAÇÃO </Text>{(markup as MarkupT ).name}</Text>
            {finish.designer && <Text style={tw("text-xs")}><Text style={tw("text-tertiary")}>DESIGN BY </Text>{finish.designer}</Text>}
          </View>
        </View>
        <View style={tw('flex flex-row justify-between gap-2')}>
          <Text style={tw('flex flex-row p-1 justify-center items-center border border-primary rounded-sm grow-0 text-xs')}>
            {quantity > 1 ? quantity + ' Unidades' : quantity + ' Unidade'}
          </Text>
          <View style={tw('flex flex-row gap-2')}>
            <Text>
              Teste
            </Text>
          </View>
        </View>
      </View>
    </View>
  )

}

export default function ProposalPDF() {
  const { proposal, versionNum } = useCRMContext();

  function ProposalDocument() {
    return (
      <Document>
        <Page size="A4" style={tw("bg-background text-foreground p-12 font-sans")}>
          <View style={tw("flex flex-row")}>
            <View style={tw("flex flex-col gap-4")}>
              <Image style={tw("w-52 h-auto")} src='/acervo-bg.png' />

              <Text style={tw("text-sm")}><Text style={tw("font-semibold")}>Cliente: </Text>{proposal.client.person.label}</Text>
            </View>
            <View style={tw("flex flex-col gap-1 grow items-end")}>
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
            {proposal?.versions.find(({num}) => num === versionNum)?.products.map((product, i) => 
                  <ProductSlideCard key={product.id} product={product} index={i} />
                )}
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
            <LoaderCircle className='text-background h-8 w-8 animate-spin' />
          </Button> : 
          <Button className='pr-3'>
            BAIXAR
            <FileDown className='text-background' />
          </Button>}
        </PDFDownloadLink>
        {/* <Button className='pr-3'>
          BAIXAR
          <FileDown className='text-background' />
        </Button> */}
      </div>
      <PDFViewer style={{ width: '100%', height: '100%' }}>
        <ProposalDocument />
      </PDFViewer>
    </div>
  );
}
