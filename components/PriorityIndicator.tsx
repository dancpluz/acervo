'use client'

import { EnumFieldT } from "@/lib/fields"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form"
import { useCRMContext } from "@/hooks/useCRMContext";

export function PriorityField({ form, obj, priority }: { form: ReturnType<typeof useForm>, obj: EnumFieldT, priority: string }) {
  return (
    <FormField
      control={form.control}
      name={obj.value}
      render={() => (
        <FormItem>
          <FormMessage className='top-4' />
          <FormLabel>{obj.label}</FormLabel>
          <div className='flex gap-0.5'>
            {Array(3).fill(null).map((_, i) => {
              return (
                <Button type='button' onClick={() => priority === (i + 1).toString() ? '' : form.setValue(obj.value, (i + 1).toString())} key={i} className={`w-5 h-5 p-0 bg-background transition-colors border border-primary rounded-full ${i < Number(priority) ? 'bg-primary hover:bg-primary/80' : 'hover:bg-secondary/20'}`} />
              )
            })}
          </div>
        </FormItem>
      )} />
  )
}

export function PriorityButtons({ priority }: { priority: number }) {
  return (
    <div className='flex gap-0.5'>
      {Array(3).fill(null).map((_, i) => {
        return (
          <Button type='button' onClick={(e) => console.log(e)} key={i} className={`w-5 h-5 p-0 bg-background transition-colors border border-primary rounded-full ${i < Number(priority) ? 'bg-primary hover:bg-primary/80' : 'hover:bg-secondary/20'}`} />
        )
      })}
    </div>
  )
}

export function PriorityProposal() {
  const { proposal, setProposal, updateProposalPriority } = useCRMContext();
  const changePriority = async (priority: string) => {
    if (proposal && priority !== proposal.priority) {
      setProposal((prev) => prev ? ({ ...prev, priority }) : prev)
      await updateProposalPriority(priority);
    }
  }

  return (
    <div className='flex gap-0.5'>
      {proposal && Array(3).fill(null).map((_, i) => {
        return (
          <Button type='button' onClick={() => changePriority((i+1).toString())} key={i} className={`w-5 h-5 p-0 bg-background transition-colors border border-primary rounded-full ${i < Number(proposal.priority) ? 'bg-primary hover:bg-primary/80' : 'hover:bg-secondary/20'}`} />
        )
      })}
    </div>
  )
}