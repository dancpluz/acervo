import Header from "@/components/Header";
import { ChangeTab, StatusFilter } from "@/components/StatusButtons";
import { columns } from "./proposalcolumns";
import { DataTable } from "@/components/DataTable";
import { ProposalDialog } from "@/components/ProposalForm";
import { getCountStatus } from "@/lib/dbWrite";

export const dynamic = 'force-dynamic'

export default async function CRM({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const status = Number(searchParams.status);
  const [all, lost, solicited, sent, revision, waiting, closed] = await Promise.all([undefined,'0','1','2','3','4','5'].map(s => getCountStatus('proposal', s)))

  return (
    <div className="flex flex-col gap-4 px-20 py-10 h-full">
      <Header page='CRM'>
        <div className='flex gap-2'>
          <ChangeTab text='Propostas' count={all} route='/propostas' money={0} active={true} />
          <ChangeTab text='Pedidos' count={0} route='/pedidos' money={0} active={false} />
        </div>
      </Header>
      <div className='flex gap-2 py-3'>
        <StatusFilter text='Todos' count={all} route='/propostas' money={0} active={!status && status !== 0} />
        <StatusFilter type='front' text='Solicitado' count={solicited} route='/propostas?status=1' money={0} active={status >= 1} />
        <StatusFilter type='both' text='Enviado' count={sent} route='/propostas?status=2' money={0} active={status >= 2} />
        <StatusFilter type='both' text='Revisão' count={revision} route='/propostas?status=3' money={0} active={status >= 3} />
        <StatusFilter type='both' text='Esperando' count={waiting} route='/propostas?status=4' money={0} active={status >= 4} />
        <StatusFilter type='back' text='Fechado' count={closed} route='/propostas?status=5' money={0} active={status >= 5} />
        <StatusFilter type='lost' text='Perdido' count={lost} route='/propostas?status=0' money={0} active={status === 0} />
      </div>
      <DataTable filterKeys={['status','priority', 'project_type', 'client_type']} entity={'proposal'} search={'name'} columns={columns} link={'/crm/propostas/'} />
      <div className="flex justify-between">
        <ProposalDialog />
      </div>
    </div>
  )
}
