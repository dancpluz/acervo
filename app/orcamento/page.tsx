import Header from "@/components/Header";
import BudgetCalculator from '@/components/BudgetCalculator'
import { getConfig, getEntities } from '@/lib/dbRead';
import { FreightT, MarkupT, ProspectionT } from "@/lib/types";

export const revalidate = 30;

export default async function Orcamento() {
  const [factories, markups, freights, prospections]: [any[], MarkupT[], FreightT[], ProspectionT[]] = await Promise.all([getEntities('factory'), getConfig('markup_freight', 'markup'), getConfig('markup_freight', 'freight'), getConfig('markup_freight', 'prospection')])

  return (
    <div className="flex flex-col gap-6 px-20 py-10 h-full ">
      <Header page='Calculadora de Orçamento' />
      <BudgetCalculator factories={factories} markups={markups} freights={freights} prospections={prospections} />
    </div>
  )
}
