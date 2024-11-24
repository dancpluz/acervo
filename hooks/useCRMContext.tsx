/* eslint-disable jsx-a11y/alt-text */
'use client'

import db from '@/lib/firebase';
import { ComplementT, MarkupT, ProductT, ProposalT, VersionT } from '@/lib/types';
import { formatCurrency, timestampToDate, calculatePriceMarkup, resolvePromises } from '@/lib/utils';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { Presentation, render, Slide, Text, Image } from "react-pptx";
import { errorToast } from './general';
import { useRouter } from 'next/navigation'
import { converters } from '@/lib/converters';

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

type CRMContextProps = {
  proposal?: ProposalT;
  setProposal: Dispatch<SetStateAction<ProposalT | undefined>>
  versionNum: number;
  setVersionNum: Dispatch<SetStateAction<number>>;
  updateProductQuantity: (productId: string, quantity: number) => Promise<void>;
  getTotalValues: () => { markup12: number; markup6: number; markupCash: number };
  updateProposalStatus: (status: string) => Promise<void>;
  updateProposalPriority: (priority: string) => Promise<void>;
  presentationToggle: { [id: string]: PresentationToggleT };
  setPresentationToggle: Dispatch<SetStateAction<{ [id: string]: PresentationToggleT }>>;
  updatePresentationToggle: (id: string, key: keyof PresentationToggleT, value: boolean) => void;
  handleEnableToggle: (enabled: boolean, id: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  deleteVersion: (num: number) => Promise<void>;
  duplicateVersion: (num: number) => Promise<void>;
  deleteProposal: () => Promise<void>;
  getProposal: (resolve: boolean) => ProposalT;
  createProductSlide: (product: ProductT, left?: boolean) => JSX.Element;
  downloadPresentation: () => Promise<void>;
  updateComplement: (complement: ComplementT) => Promise<void>;
};

const Context = createContext<CRMContextProps | null>(null);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [proposal, setProposal] = useState<ProposalT | undefined>(undefined);
  const [versionNum, setVersionNum] = useState<number>(1);
  const [presentationToggle, setPresentationToggle] = useState<{ [id: string ]: PresentationToggleT }>({})
  const router = useRouter()

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

  function checkProposal() {
    if (!proposalRef) {
      throw new Error('Referência da proposta não está definida');
    }
    if (!proposal) {
      throw new Error('Proposta não está definida');
    }
  }

  function getTotalValues() {
    if (proposal) {
      let totalMarkup12 = 0;
      let totalMarkup6 = 0;
      let totalMarkupCash = 0;
  
      for (const version of proposal.versions) {
        for (const product of version.products) {
          if (product.enabled) {
            const { markup12, markup6, markupCash } = calculatePriceMarkup(product.cost, product.markup as MarkupT, product.quantity);
            totalMarkup12 += markup12;
            totalMarkup6 += markup6;
            totalMarkupCash += markupCash;
          }
        }
      }
  
      return { markup12: totalMarkup12, markup6: totalMarkup6, markupCash: totalMarkupCash }
    } else {
      return { markup12: 0, markup6: 0, markupCash: 0 }
    }
  }

  async function updateComplement(complement: ComplementT) {
    try {
      checkProposal()

      const data = await getProposal();
      const { versions } = data as ProposalT;

      const newVersions = versions.map(version => version.num === versionNum ? ({ ...version, complement }) : version)
      
      await updateDoc(proposalRef, { versions: newVersions })

      const newVersionsState = proposal.versions.map(version => version.num === versionNum ? ({ ...version, complement }) : version)
      
      setProposal((prev) => prev ? { ...prev, versions: newVersionsState } : prev)

    } catch (error) {
      console.log(error)
      errorToast(error);
    }
  }

  function updatePresentationToggle(id: string, key: keyof PresentationToggleT, value: boolean) {
    setPresentationToggle(prev => ({ ...prev, [id]: { ...prev[id], [key]: value } }))
  }

  async function handleEnableToggle(enabled: boolean, id: string) {
    const newEnabledState = !enabled
    checkProposal()

    const versions = proposal.versions.map((version: VersionT) =>
      version.num === versionNum ?
        {
          ...version, products: version.products.map((product: ProductT) =>
            product.id === id ? { ...product, enabled: newEnabledState } : product
          )
        } : version
    )

    setProposal((prev) => prev ? { ...prev, versions } : prev)

    try {
      await updateProductEnable(id, newEnabledState)
    } catch (error) {
      console.error('Falha em habilitar/desabilitar produto:', error)
      errorToast(error);
    }
  }

  async function getProposal(resolve=false) {
    checkProposal()

    let newProposal;

    if (resolve) {
      const ref = doc(db, 'proposal', proposal.id).withConverter(converters['proposal'])
      newProposal = await getDoc(ref);
    } else {
      newProposal = await getDoc(proposalRef);
    }


    let data = await newProposal.data();

    if (!data) {
      throw new Error('Proposal data is undefined');
    }

    if (resolve) {
      data = await resolvePromises(data);
      data.created_at = timestampToDate(data.created_at)
      data.last_updated = timestampToDate(data.last_updated)
    }

    return data
  }

  async function deleteProduct(productId: string) {
    try {
      checkProposal()

      const data = await getProposal();

      const versions = data.versions.map((version: VersionT) =>
        version.num === versionNum ?
          {
            ...version, products: version.products.filter((product: ProductT) =>
              product.id !== productId
            )
          } : version
      )

      await updateDoc(proposalRef, { versions })
    } catch (error) {
      console.log(error)
      errorToast(error);
    }
  }

  async function updateProductEnable(productId: string, enable: boolean) {
    try {
      checkProposal()

      const data = await getProposal();

      const versions = data.versions.map((version: VersionT) => 
        version.num === versionNum ? 
        { ...version, products: version.products.map((product: ProductT) => 
          productId === product.id ? { ...product, enabled: enable } : product
        ) } : version
      )

      await updateDoc(proposalRef, { versions })
    } catch (error) {
      console.log(error)
      errorToast(error);
    }
  }

  async function updateProductQuantity(productId: string, quantity: number) {
    try {
      checkProposal()

      const data = await getProposal();
      
      const versions = data.versions.map((version: VersionT) =>
        version.num === versionNum ?
          {
            ...version, products: version.products.map((product: ProductT) =>
              product.id === productId ? { ...product, quantity } : product
            )
          } : version
      )

      await updateDoc(proposalRef, { versions })
    } catch (error) {
      console.log(error)
      errorToast(error);
    }
  }

  async function updateProposalStatus(status: string) {
    try {
      checkProposal()

      await updateDoc(proposalRef, { status })
    } catch (error) {
      console.log(error)
      errorToast(error);
    }
  }

  async function updateProposalPriority(priority: string) {
    try {
      checkProposal()

      await updateDoc(proposalRef, { priority })
    } catch (error) {
      console.log(error)
      errorToast(error);
    }
  }

  async function duplicateVersion(num: number) {
    try {
      checkProposal()

      const data = await getProposal();
      const { versions } = data;

      const duplicatedVersion = versions.find((version: VersionT) => version.num === num)
      const newNum = versions.length + 1
      const newVersion = { versions: [...versions, {...duplicatedVersion, num: newNum }] }
      
      await updateDoc(proposalRef, newVersion)
      setVersionNum(newNum)
      router.refresh()
    } catch (error) {
      console.log(error)
      errorToast(error);
    }
  }

  async function deleteVersion(num: number) {
    try {
      checkProposal()

      const data = await getProposal();
      const { versions } = data;

      const filteredVersions = versions.filter((version: VersionT) => version.num !== num)

      await updateDoc(proposalRef, { versions: filteredVersions })
      setVersionNum(filteredVersions.length > 0 ? filteredVersions.sort((a,b) => a.num - b.num)[0].num : 1)
      router.refresh()
    } catch (error) {
      console.log(error)
      errorToast(error);
    }
  }

  async function deleteProposal() {
    try {
      checkProposal()

      await deleteDoc(proposalRef);
      router.push('/crm/propostas')
    } catch (error) {
      console.log(error)
      errorToast(error);
    }
  }

  const createProductSlide = (product: ProductT, right: boolean = false) => {
    const { id, name, quantity, finish, cost, image, enabled, markup } = product

    const { sizes, markupName, designer, frame, fabric, extra, images, markup12, markup6, freight, markupCash } = presentationToggle[id];

    const price = calculatePriceMarkup(cost, markup as MarkupT, quantity)

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
            {markupName ? `${(markup as MarkupT).name}` : ''}
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
        {image && image.path.includes("http") ?
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
      errorToast(error);
    }
  };

  return (
    <Context.Provider
      value={{
        proposal,
        setProposal,
        versionNum,
        setVersionNum,
        handleEnableToggle,
        updateProductQuantity,
        deleteProposal,
        deleteProduct,
        getProposal,
        updateComplement,
        deleteVersion,
        duplicateVersion,
        updateProposalStatus,
        updateProposalPriority,
        updatePresentationToggle,
        getTotalValues,
        presentationToggle,
        setPresentationToggle,
        createProductSlide,
        downloadPresentation,
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