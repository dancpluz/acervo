'use client'

import db from '@/lib/firebase';
import { MarkupT, ProductT, ProposalT, VersionT } from '@/lib/types';
import { unformatNumber } from '@/lib/utils';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

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
  calculatePrice: (cost: number, markup: MarkupT, quantity: number) => { markup12: number; markup6: number; markupCash: number };
  updateProductEnable: (proposalId: string, versionNum: number, productIndex: number, enable: boolean) => Promise<void>;
  updateProductQuantity: (proposalId: string, versionNum: number, productIndex: number, quantity: number) => Promise<void>;
  totalValues: { markup12: number; markup6: number; markupCash: number };
  updateProposalStatus: (status: string) => Promise<void>;
  updateProposalPriority: (priority: string) => Promise<void>;
  presentationToggle: PresentationToggleT;
  setPresentationToggle: Dispatch<SetStateAction<PresentationToggleT>>;
};

const Context = createContext<CRMContextProps | null>(null);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [proposal, setProposal] = useState<ProposalT | undefined>(undefined);
  const [totalValues, setTotalValues] = useState({ markup12: 0, markup6: 0, markupCash: 0 });
  const [versionNum, setVersionNum] = useState<number>(1);
  const proposalRef = proposal ? doc(db, 'proposal', proposal.id) : undefined
  const [presentationToggle, setPresentationToggle] = useState({ 
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
  });

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

  async function updateProductEnable(proposalId: string, versionNum: number, productIndex: number, enable: boolean) {
    try {
      if (!proposalRef) {
        throw new Error('Proposal reference is undefined');
      }
      const proposal = await getDoc(proposalRef);
      
      const data = proposal.data();
      if (!data) {
        throw new Error('Proposal data is undefined');
      }
      const versions = data.versions.map((version: VersionT) => 
        version.num === versionNum ? 
        { ...version, products: version.products.map((product: ProductT, index: number) => 
          index === productIndex ? { ...product, enabled: enable } : product
        ) } : version
      )

      await updateDoc(proposalRef, { versions })
    } catch (error) {
      console.log(error)
    }
  }

  async function updateProductQuantity(proposalId: string, versionNum: number, productIndex: number, quantity: number) {
    try {
      if (!proposalRef) {
        throw new Error('Proposal reference is undefined');
      }
      const proposal = await getDoc(proposalRef);

      const data = proposal.data();
      if (!data) {
        throw new Error('Proposal data is undefined');
      }
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
    }
  }

  function calculatePrice(cost: number, markup: MarkupT, quantity: number) {
    const markup12 = markup && cost ? unformatNumber(markup['12x'] as string) * cost * quantity : 0
    const markup6 = markup && cost ? Number(markup12) * (1 - unformatNumber(markup['6x'] as string, true)) : 0
    const markupCash = markup && cost ? Number(markup12) * (1 - unformatNumber(markup['cash'] as string, true)) : 0

    return { markup12, markup6, markupCash }
  }

  return (
    <Context.Provider
      value={{
        proposal,
        setProposal,
        versionNum,
        setVersionNum,
        calculatePrice,
        updateProductEnable,
        updateProductQuantity,
        updateProposalStatus,
        updateProposalPriority,
        totalValues,
        presentationToggle,
        setPresentationToggle
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