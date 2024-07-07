import Header from "@/components/Header";
import BudgetCalculator from '@/components/BudgetCalculator'
import { getConfig, getEntities } from '@/lib/dbRead';
import { formatPercent } from '@/lib/utils'
import { FreightT, MarkupT } from "@/lib/types";

export const revalidate = 30;

export default async function Orcamento() {
  const fullData = await getEntities('factory', 'representative');
  const [factories, markups, freights]: [any, MarkupT[], FreightT[]] = await Promise.all([getEntities('factory'), getConfig('markup_freight', 'markup'), getConfig('markup_freight', 'freight')])

  return (
    <div className="flex flex-col gap-6 px-20 py-10 h-full ">
      <Header page='Calculadora de Orçamento' />
      <BudgetCalculator factories={factories} markups={markups} freights={freights} />
    </div>
  )
}
