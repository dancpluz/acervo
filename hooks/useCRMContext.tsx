/* eslint-disable jsx-a11y/alt-text */
'use client'

import db from '@/lib/firebase';
import { MarkupT, ProductT, ProposalT, VersionT } from '@/lib/types';
import { formatCurrency, unformatNumber } from '@/lib/utils';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { Presentation, render, Slide, Text, Image } from "react-pptx";
import { deleteToast } from './general';

export type PresentationToggleT = {
  sizes: boolean;
  markupName: boolean;
  designer: boolean;
  frame: boolean;
  fabric: boolean;
  freight: boolean;
  extra: boolean;
  images: boolean;
  markup12: boolean;
  markup6: boolean;
  markupCash: boolean;
}

export type ComplementT = {
  discount: number,
  freight: number,
  expiration: number,
  deadline: number,
  payment: string,
  general_info: string,
  info: string,
}

type CRMContextProps = {
  proposal?: ProposalT;
  setProposal: Dispatch<SetStateAction<ProposalT | undefined>>
  versionNum: number;
  setVersionNum: Dispatch<SetStateAction<number>>;
  calculatePrice: (cost: number, markup: MarkupT, quantity: number) => { markup12: number; markup6: number; markupCash: number };
  updateProductQuantity: (productIndex: number, quantity: number) => Promise<void>;
  totalValues: { markup12: number; markup6: number; markupCash: number };
  updateProposalStatus: (status: string) => Promise<void>;
  updateProposalPriority: (priority: string) => Promise<void>;
  presentationToggle: { [id: string]: PresentationToggleT };
  setPresentationToggle: Dispatch<SetStateAction<{ [id: string]: PresentationToggleT }>>;
  updatePresentationToggle: (id: string, key: keyof PresentationToggleT, value: boolean) => void;
  handleEnableToggle: (enabled: boolean, index: number) => Promise<void>;
  complementInfo: ComplementT;
  deleteProduct: (productIndex: number) => Promise<void>;
  createProductSlide: (product: ProductT, left?: boolean) => JSX.Element;
  downloadPresentation: () => Promise<void>;
  popups: Record<Popups, boolean>;
  setPopupOpen: (key: Popups, value: boolean) => void;
};

export type Popups = 'product' | 'proposal' | 'productEdit' | 'proposalEdit';

const Context = createContext<CRMContextProps | null>(null);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [proposal, setProposal] = useState<ProposalT | undefined>(undefined);
  const [totalValues, setTotalValues] = useState({ markup12: 0, markup6: 0, markupCash: 0 });
  const [versionNum, setVersionNum] = useState<number>(1);
  const [presentationToggle, setPresentationToggle] = useState<{ [id: string ]: PresentationToggleT }>({})
  const [complementInfo, setComplementInfo] = useState<ComplementT>({
    discount: 0,
    freight: 0,
    expiration: 0,
    deadline: 0,
    payment: 'boleto',
    general_info: '',
    info: '',
  })
  const [popups, setPopups] = useState<Record<Popups, boolean>>({
    product: false,
    proposal: false,
    productEdit: false,
    proposalEdit: false,
  })

  const setPopupOpen = (key: Popups, value: boolean) => setPopups(prev => ({ ...prev, [key]: value }))

  const proposalRef = proposal ? doc(db, 'proposal', proposal.id) : undefined

  useEffect(() => {
    const defaultToggle = {
      sizes: true,
      markupName: true,
      designer: true,
      frame: true,
      fabric: true,
      extra: true,
      images: true,
      freight: true,
      markup12: true,
      markup6: true,
      markupCash: true,
    }
    const productIds = Object.keys(presentationToggle)

    if (proposal?.versions) {
      const presentations = proposal.versions.reduce((acc: any, { products }: VersionT) => {
        products.forEach(({ id }: ProductT) => {
          if (!productIds.includes(id)) {
        acc[id] = defaultToggle;
          }
        });
        return acc;
      }, {});
      setPresentationToggle(prev => ({...prev, ...presentations}))
    }
  }, [proposal]);

  useEffect(() => {
    if (proposal) {
      let totalMarkup12 = 0;
      let totalMarkup6 = 0;
      let totalMarkupCash = 0;

      for (const version of proposal.versions) {
        for (const product of version.products) {
          if (product.enabled) {
            const { markup12, markup6, markupCash } = calculatePrice(product.cost, product.markup as MarkupT, product.quantity);
            totalMarkup12 += markup12;
            totalMarkup6 += markup6;
            totalMarkupCash += markupCash;
          }
        }
      }

      setTotalValues({ markup12: totalMarkup12, markup6: totalMarkup6, markupCash: totalMarkupCash });
    }
  }, [proposal]);

  function updatePresentationToggle(id: string, key: keyof PresentationToggleT, value: boolean) {
    setPresentationToggle(prev => ({ ...prev, [id]: { ...prev[id], [key]: value } }))
  }

  async function handleEnableToggle(enabled: boolean, id: string) {
    const newEnabledState = !enabled
    if (!proposal) {
      throw new Error('Proposal is undefined');
    }
    const versions = proposal.versions.map((version: VersionT) =>
      version.num === versionNum ?
        {
          ...version, products: version.products.map((product: ProductT) =>
            product.id === id ? { ...product, enabled: newEnabledState } : product
          )
        } : version
    )

    setProposal((prev) => prev ? { ...prev, versions } : undefined)

    try {
      await updateProductEnable(id, newEnabledState)
    } catch (error) {
      console.error('Falha em habilitar/desabilitar produto:', error)
      deleteToast(error);
    }
  }

  async function getProposal() {
    if (!proposalRef) {
      throw new Error('Proposal reference is undefined');
    }
    const proposal = await getDoc(proposalRef);

    const data = proposal.data();
    if (!data) {
      throw new Error('Proposal data is undefined');
    }

    return data
  }

  async function deleteProduct(productIndex: number) {
    try {
      const data = await getProposal();

      const versions = data.versions.map((version: VersionT) =>
        version.num === versionNum ?
          {
            ...version, products: version.products.filter((product: ProductT, index: number) =>
              index !== productIndex
            )
          } : version
      )

      await updateDoc(proposalRef, { versions })
    } catch (error) {
      console.log(error)
      deleteToast(error);
    }
  }

  async function updateProductEnable(id: string, enable: boolean) {
    try {
      const data = await getProposal();

      const versions = data.versions.map((version: VersionT) => 
        version.num === versionNum ? 
        { ...version, products: version.products.map((product: ProductT, index: number) => 
          id === product.id ? { ...product, enabled: enable } : product
        ) } : version
      )

      await updateDoc(proposalRef, { versions })
    } catch (error) {
      console.log(error)
      deleteToast(error);
    }
  }

  async function updateProductQuantity(productIndex: number, quantity: number) {
    try {
      const data = await getProposal();
      
      const versions = data.versions.map((version: VersionT) =>
        version.num === versionNum ?
          {
            ...version, products: version.products.map((product: ProductT, index: number) =>
              index === productIndex ? { ...product, quantity } : product
            )
          } : version
      )

      await updateDoc(proposalRef, { versions })
    } catch (error) {
      console.log(error)
      deleteToast(error);
    }
  }

  async function updateProposalStatus(status: string) {
    try {
      if (!proposalRef) {
        throw new Error('Proposal reference is undefined');
      }
      await updateDoc(proposalRef, { status })
    } catch (error) {
      console.log(error)
      deleteToast(error);
    }
  }

  async function updateProposalPriority(priority: string) {
    try {
      if (!proposalRef) {
        throw new Error('Proposal reference is undefined');
      }
      await updateDoc(proposalRef, { priority })
    } catch (error) {
      console.log(error)
      deleteToast(error);
    }
  }

  function calculatePrice(cost: number, markup: MarkupT, quantity: number) {
    const markup12 = markup && cost ? unformatNumber(markup['12x'] as string) * cost * quantity : 0
    const markup6 = markup && cost ? Number(markup12) * (1 - unformatNumber(markup['6x'] as string, true)) : 0
    const markupCash = markup && cost ? Number(markup12) * (1 - unformatNumber(markup['cash'] as string, true)) : 0

    return { markup12, markup6, markupCash }
  }

  const createProductSlide = (product: ProductT, right: boolean = false) => {
    const { id, name, quantity, finish, cost, image, enabled, markup } = product

    const { sizes, markupName, designer, frame, fabric, extra, images, markup12, markup6, freight, markupCash } = presentationToggle[id];

    const price = calculatePrice(cost, markup as MarkupT, quantity)

    const fontFace = 'Open Sans';
    const small = 10;
    const big = 13;
    const space = 2;
    const bulletOptions: { type: 'bullet', characterCode: string } = { type: 'bullet', characterCode: '' }
    const textPosition = right ? { x: 6.5, y: 0.9, w: 3, h: 4 } : { x: 0.5, y: 0.9, w: 3, h: 4 };
    const captionOptions = {
      y: 4.7, w: 1.5, h: 0.4,
      fontSize: small,
      fontFace,
    }

    const maxImageDimension = { w: 5.4, h: 3.6 }
    const imagePosition = right ? { x: 0.5, y: 1, ...maxImageDimension } : { x: 4, y: 1, ...maxImageDimension };

  const getDimensions = (width: number, height: number) => {
    const widthRatio = maxImageDimension.w / width;
    const heightRatio = maxImageDimension.h / height;

    const scale = Math.min(widthRatio, heightRatio);

    return {
      w: width * scale,
      h: height * scale,
    };
  };

    return (
      <Slide hidden={!enabled} style={{
        backgroundColor: "#feffff"
      }}>
        <Image
          src={{ kind: "path", path: "/acervo-sm.png" }}
          style={{ x: 9.4, y: 0.2, w: 0.4, h: 0.3 }}
        />
        <Text style={{
          ...textPosition,
          fontSize: small,
          fontFace,
          verticalAlign: 'bottom',
          align: right ? 'right' : 'left',
        }}>
          <Text.Bullet {...bulletOptions} style={{
            fontSize: big,
            fontFace,
            bold: true,
            paraSpaceBefore: 16,
            paraSpaceAfter: 16,
          }}>
            {name}
          </Text.Bullet>
          <Text.Bullet {...bulletOptions}>
            {markupName ? `${markup.name}` : ''}
          </Text.Bullet>
          <Text.Bullet {...bulletOptions}>
            {frame ? `Base/Estrutura - ${finish.frame}` : ''}
          </Text.Bullet>
          <Text.Bullet {...bulletOptions}>
            {fabric ? `Tampo/Tecido - ${finish.fabric}` : ''}
          </Text.Bullet>
          <Text.Bullet {...bulletOptions}>
            {extra && finish.extra ? `Acabamento 3 - ${finish.extra}` : ''}
          </Text.Bullet>
          <Text.Bullet {...bulletOptions} style={{ paraSpaceBefore: 14, paraSpaceAfter: 14 }}>
            {sizes ? `${finish.width}cm x ${finish.depth}cm x ${finish.height}cm` : ''}
          </Text.Bullet>
          <Text.Bullet {...bulletOptions} style={{ bold: true, paraSpaceBefore: space, paraSpaceAfter: space }}>
            {`A partir de`}
          </Text.Bullet>
          <Text.Bullet {...bulletOptions} style={{ bold: true, paraSpaceBefore: space, paraSpaceAfter: space }}>
            {markup12 ? `${formatCurrency(price.markup12)} UND. em 12x` : ''}
          </Text.Bullet>
          <Text.Bullet {...bulletOptions} style={{ bold: true, paraSpaceBefore: space, paraSpaceAfter: space }}>
            {markup6 ? `${formatCurrency(price.markup6)} UND. em 6x` : ''}
          </Text.Bullet>
          <Text.Bullet {...bulletOptions} style={{ color: '#a53825', fontSize: small + 2, bold: true, paraSpaceBefore: space, paraSpaceAfter: space }}>
            {markupCash ? `${formatCurrency(price.markupCash)} UND. à vista` : ''}
          </Text.Bullet>
          <Text.Bullet {...bulletOptions} style={{ color: '#a53825', bold: true, paraSpaceBefore: space, paraSpaceAfter: space }}>
            {freight ? `Frete incluso` : ''}
          </Text.Bullet>
        </Text>
        {image ?
          <Image
            src={{ kind: "path", path: image.path }}
            style={{ ...imagePosition, ...getDimensions(image.width, image.height)}}
          />
          :
          <Text style={{
            ...imagePosition,
            fontSize: big,
            fontFace,
            verticalAlign: 'middle',
            align: 'center',
            backgroundColor: "#eeeeee"
          }}>
            Sem Imagem
          </Text>
        }
        <Text style={{
          ...captionOptions,
          x: right ? 0.5 : 4,
        }}>
          Portfólio, ACERVO
        </Text>
        <Text style={{
          ...captionOptions,
          x: right ? 2.4 : 6,
          align: 'center',
        }}>
          acervomobilia.com
        </Text>
        <Text style={{
          ...captionOptions,
          x: right ? 0.5 : 7.9,
          align: 'right',
        }}>
          {designer && finish.designer ? `designer ${finish.designer}` : ''}
        </Text>
      </Slide>
    )
  }

  const downloadPresentation = async () => {
    try {
      if (!proposal) {
        throw new Error('Proposal are undefined');
      }

      const version = proposal.versions.find(version => version.num === versionNum);

      if (!version) {
        throw new Error('Version are undefined');
      }

      const slides = version.products.filter(product => product.enabled).map(product => createProductSlide(product));

      const buffer = await render(
        <Presentation>
          <Slide>
            <Image style={{
              x: 0,
              y: 0,
              w: '100%',
              h: '100%',
            }} src={{ kind: "path", path: "/slide1.jpg" }} />
          </Slide>
          <Slide>
            <Image style={{
              x: 0,
              y: 0,
              w: '100%',
              h: '100%',
            }} src={{ kind: "path", path: "/slide2.jpg" }} />
          </Slide>
          {slides}
          <Slide>
            <Image style={{
              x: 0,
              y: 0,
              w: '100%',
              h: '100%',
            }} src={{ kind: "path", path: "/slideFinal.jpg" }} />
          </Slide>
        </Presentation>,
        { outputType: "blob" }
      );

      const url = URL.createObjectURL(buffer as Blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${proposal?.id ?? 'presentation'}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating presentation:", error);
      deleteToast(error);
    }
  };

  return (
    <Context.Provider
      value={{
        proposal,
        setProposal,
        versionNum,
        setVersionNum,
        calculatePrice,
        handleEnableToggle,
        updateProductQuantity,
        deleteProduct,
        updateProposalStatus,
        updateProposalPriority,
        updatePresentationToggle,
        totalValues,
        presentationToggle,
        setPresentationToggle,
        complementInfo,
        createProductSlide,
        downloadPresentation,
        popups,
        setPopupOpen,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useCRMContext(){
  const context = useContext(Context);
  if (!context) {
    throw new Error('useContext must be used within a Provider');
  }
  return context;
};