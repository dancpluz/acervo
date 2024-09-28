import { SetStateAction, Dispatch } from 'react';
import { formatPercent } from "@/lib/utils";

export default function SelectableChips<Chip>({ chips, chipText, chipNumber, placeholder, selectedChip, setFunction }: { chips: Chip[], chipText: string, chipNumber: string, placeholder: string, selectedChip?: Chip, setFunction: Dispatch<SetStateAction<Chip | undefined>> }) {
  return (
    <div className='flex w-full flex-wrap gap-2'>
      {chips.length > 0 ? chips.map((chip) =>
        <div key={chip[chipText]} onClick={() => { selectedChip && chip.ref === selectedChip.ref ? setFunction(undefined) : setFunction(chip) }} className={`flex border transition-colors rounded-lg cursor-pointer h-10 border-secondary gap-1 items-center px-2 ${chip === selectedChip ? 'bg-primary border-primary text-background [&>div]:text-foreground [&>div]:bg-background' : 'hover:bg-secondary/20'}`}>
          {chip[chipText]}
          <div className='bg-secondary transition-colors rounded-sm px-1 text-sm'>
            {chip[chipNumber] === '' ? 'Grátis' : formatPercent(chip[chipNumber] as number)+'%'}
          </div>
        </div>
      ) : <p className='text-tertiary'>{placeholder}</p>}
    </div>
  )
}