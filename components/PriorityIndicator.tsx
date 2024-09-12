// @ts-nocheck

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';

export default function PriorityIndicator({ form, obj, priority }) {
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
                <Button type='button' onClick={() => priority === (i + 1).toString() ? '' : form.setValue(obj.value, (i + 1).toString())} key={i} className={`w-5 h-5 p-0 bg-background transition-colors border border-primary rounded-full ${i < priority ? 'bg-primary hover:bg-primary/80' : 'hover:bg-secondary/20' }`} />
              )
            })}
          </div>
        </FormItem>
      )} />
  )
}