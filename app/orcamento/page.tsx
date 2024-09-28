import Header from "@/components/Header";
import BudgetCalculator from '@/components/BudgetCalculator'

export default async function Orcamento() {
  return (
    <div className="flex flex-col gap-6 px-20 py-10 h-full ">
      <Header page='Calculadora de Orçamento' />
      <BudgetCalculator />
    </div>
  )
}
