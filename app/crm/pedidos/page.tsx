import { ChangeTab } from "@/components/StatusButtons";
import Header from "@/components/Header";

export default function Pedidos() {
  return (
    <div className="flex flex-col gap-4 px-20 py-10 h-full">
      <Header page='CRM'>
        <div className='flex gap-2'>
          <ChangeTab text='Propostas' count={33} route='/propostas' money={200000} active={true} />
          <ChangeTab text='Pedidos' count={63} route='/pedidos' money={200000} active={false} />
        </div>
      </Header>
    </div>
  )
}
