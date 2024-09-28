'use client'

import Image from "next/image";
import { useState } from "react";


export default function ProposalSidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className={`fixed flex flex-col bg-background justify-between h-full py-2 inset-y-0 right-0 z-10 w-[72px] border-l border-secondary transition-all ${expanded ? "w-[300px] shadow-2xl" : ""}`}>
      <button className={`absolute flex justify-center items-center transition-all cursor-pointer w-5 h-5 top-32 -left-2.5 bg-secondary rounded-full ${expanded ? '' : 'rotate-180'}`} onClick={() => setExpanded(curr => !curr)}>
        <Image alt={'Expandir Aba'} src={'/icons/chevron.svg'} width={16} height={16} />
      </button>
      <nav className="flex flex-col px-5 gap-6">
        Test
      </nav>
      <div className="px-5">
        test2
      </div>
    </aside>
  );
}
