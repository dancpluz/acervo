import Header from "@/components/Header";
import BudgetCalculator from '@/components/BudgetCalculator'
import { Suspense } from "react";

export default async function Calculadora() {
  return (
    <div className="flex flex-col gap-6 px-20 py-10 h-full">
      <Header page='Calculadora de Orçamento' />
      <Suspense>
        <BudgetCalculator />
      </Suspense>
    </div>
  )
}