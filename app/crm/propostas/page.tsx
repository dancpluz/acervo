import Header from "@/components/Header";
import { ChangeTab, StatusFilter } from "@/components/StatusButtons";
import { columns } from "./proposalcolumns";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import ProposalForm, { ProposalDialog } from "@/components/ProposalForm";
import { CRMPopup } from "@/components/AllPopups";

export default function CRM() {
  return (
    <div className="flex flex-col gap-4 px-20 py-10 h-full">
      <Header page='CRM'>
        <div className='flex gap-2'>
          <ChangeTab text='Propostas' count={33} route='/propostas' money={200000} active={true} />
          <ChangeTab text='Pedidos' count={63} route='/pedidos' money={200000} active={false} />
        </div>
      </Header>
      <div className='flex gap-2 py-3'>
        <StatusFilter text='Todos' count={33} route='/propostas' money={2000} active={true} />
        <StatusFilter type='front' text='Solicitado' count={33} route='/propostas' money={2000} active={false} />
        <StatusFilter type='both' text='Revisão' count={33} route='/propostas' money={2000} active={false} />
        <StatusFilter type='both' text='Esperando' count={33} route='/propostas' money={2000} active={false} />
        <StatusFilter type='both' text='Negociação' count={33} route='/propostas' money={2000} active={false} />
        <StatusFilter type='back' text='Fechado' count={33} route='/propostas' money={2000} active={false} />
        <StatusFilter type='lost' text='Perdido' count={33} route='/propostas' money={2000} active={false} />
      </div>
      <DataTable entity={'proposal'} search={'name'} columns={columns} link={'/crm/propostas/'} />
      <div className="flex justify-between">
      <ProposalDialog />
      </div>
    </div>
  )
}
