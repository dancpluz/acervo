'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { filters } from "@/lib/filters"
import { useQueryState } from "nuqs";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export default function FilterSelect({ filterKey }: { filterKey: keyof typeof filters }) {
  const filter = filters[filterKey]

  const { param, placeholder, options, parser } = filter

  const [filterState, setFilterState] = useQueryState(param, parser)

  if (!placeholder) return null

  return (
    <Select value={filterState as string} onValueChange={setFilterState}>
      <div style={{ paddingRight: filterState ? '0px' : '4px' }} className='flex gap-1 items-center'>
        <SelectTrigger className="p-2 h-8 data-[placeholder]:text-foreground hover:bg-primary/70 data-[placeholder]:bg-transparent bg-primary text-background border-primary [&>svg]:text-background data-[placeholder]:hover:bg-alternate/20 [&>svg]:data-[placeholder]:text-primary">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {filterState && <Button className='h-6 w-6 p-1' variant='ghost' onClick={() => setFilterState('')}>
          <X className="h-4 w-4 text-tertiary" />
        </Button>}
      </div>
      <SelectContent>
        {options.map(({ value, label }) => 
          <SelectItem key={value} value={value}>{label}</SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
