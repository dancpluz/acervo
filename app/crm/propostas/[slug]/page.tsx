import Header from "@/components/Header";
import { ChevronLeft } from 'lucide-react';
import Link from "next/link";
import db from "@/lib/firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { converters } from '@/lib/converters';
import ProposalView from "@/components/ProposalView";
import ProposalSidebar from "@/components/ProposalSidebar";
import { PriorityProposal } from '@/components/PriorityIndicator';

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const querySnapshot = await getDocs(collection(db, 'proposal'));
  const slugs = await Promise.all(querySnapshot.docs.map(async (doc: any) => doc.id))

  return slugs.map((slug) => ({ slug }))
}

async function resolvePromises(data: any): Promise<any> {
  if (data instanceof Promise) {
    return await data;
  }

  if (Array.isArray(data)) {
    return await Promise.all(data.map(resolvePromises));
  }

  if (data !== null && typeof data === 'object') {
    const resolvedData = { ...data };
    const entries = await Promise.all(
      Object.entries(data).map(async ([key, value]) => [key, await resolvePromises(value)])
    );
    for (const [key, value] of entries) {
      resolvedData[key] = value;
    }
    return resolvedData;
  }

  return data;
}

export default async function Propostas({ params: { slug } }: { params: { slug: string } }) {
  const proposal = await getDoc(doc(db,'proposal',slug).withConverter(converters['proposal']));
  let data = await proposal.data()

  if (data) {
    data = await resolvePromises(data);
  }

  return (
    <>
      <div className="flex flex-col gap-4 pl-20 pr-[152px] py-10 h-screen">
        <Header>
          <div className='flex gap-2 items-center'>
            <Link href='/crm/propostas'>
              <ChevronLeft className='w-8 h-8' />
            </Link>
            <div className='flex flex-col'>
              <span className='text-tertiary leading-none'>
                {slug}
              </span>
              <div className='flex items-center gap-2'>
                <h1 className='text-2xl'>
                  {data && data.name}
                </h1>
                <PriorityProposal />
              </div>
            </div>
          </div>
        </Header>
        <ProposalView data={JSON.stringify(data)} />
      </div>
      <ProposalSidebar />
    </>
  )
}