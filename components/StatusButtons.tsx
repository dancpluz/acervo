import { formatCurrency } from "@/lib/utils";
import Link from 'next/link';

export function ChangeTab({ text, count, active, route, money }: { text: string, count: number, active: boolean, route: string, money: number }) {
  return (
    <Link href={`${route}`}>
      <div className={`flex flex-col px-2 py-1 text-background rounded-sm border-secondary ${active ? 'bg-primary' : 'border bg-background'}`}>
        <div className='flex grow items-center gap-1'>
          <h2 className={`text-base ${active ? '' : 'text-foreground' }`}>{text}</h2>
          <span className={`flex justify-center items-center w-6 h-6 bg-background rounded-full border-secondary text-foreground ${active ? '' : 'border'} ${count > 100 ? 'text-xs' : 'text-sm'}`}>{count}</span>
        </div>
        <p className={`text-sm ${active ? '' : 'text-tertiary'}`}>{formatCurrency(money)}</p>
      </div>
    </Link>
  )
}

type StatusTypes = 'front' | 'back' | 'both' | 'lost';

export function StatusFilter({ type, text, count, active, route, money }: { type?: StatusTypes, text: string, count: number, active: boolean, route: string, money: number }) {
  function ButtonShape() {
    switch (type) {
      case 'front':
        return (
          <>
            {!active && <div className={`absolute right-[-8px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[9px] border-t-[26px] border-b-[26px] rounded-md border-t-transparent border-b-transparent border-l-secondary`} />}

            <div className={`absolute right-[-6.5px] top-1/2 transform -translate-y-1/2 bottom-0 w-0 h-0 border-l-[8px] border-t-[23px] border-b-[23px] rounded border-t-transparent border-b-transparent ${active ? 'border-l-primary' : 'border-l-background'}`} />
          </>
        )
      case 'back':
        return (
          <>
            {!active && <div className={`absolute left-[0px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[9px] border-t-[26px] border-b-[26px] rounded-md border-t-transparent border-b-transparent border-l-secondary`} />}

            <div className={`absolute left-[0px] top-1/2 transform -translate-y-1/2 bottom-0 w-0 h-0 border-l-[8px] border-t-[23px] border-b-[23px] rounded border-t-transparent border-b-transparent border-l-background`} />
          </>
        )
      case 'both':
        return (
          <>
            {!active && <div className={`absolute right-[-8px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[9px] border-t-[26px] border-b-[26px] rounded-md border-t-transparent border-b-transparent border-l-secondary`} />}

            <div className={`absolute right-[-6.5px] top-1/2 transform -translate-y-1/2 bottom-0 w-0 h-0 border-l-[8px] border-t-[23px] border-b-[23px] rounded border-t-transparent border-b-transparent ${active ? 'border-l-primary' : 'border-l-background'}`} />

            {!active && <div className={`absolute left-[0px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[9px] border-t-[26px] border-b-[26px] rounded-md border-t-transparent border-b-transparent border-l-secondary`} />}

            <div className={`absolute left-[0px] top-1/2 transform -translate-y-1/2 bottom-0 w-0 h-0 border-l-[8px] border-t-[23px] border-b-[23px] rounded border-t-transparent border-b-transparent border-l-background`} />
          </>
        )
      default: 
        return;
    }
  }


  return (
    <div className={`flex flex-col px-2 py-1 text-background rounded-sm relative ${active ? type === 'lost' ? 'bg-destructive' : 'bg-primary' : type === 'lost' ? 'border border-destructive' : 'border border-secondary bg-background'} ${type === 'back' || type === 'both' ? 'pl-4 border-l-0' : ''}`}>
      <div className='flex grow items-center gap-1'>
        <h3 className={`text-sm ${active ? '' : 'text-foreground'}`}>{text}</h3>
        <span className={`flex justify-center items-center w-5 h-5 bg-background rounded-full text-foreground ${active ? '' : type === 'lost' ? 'border-destructive border' : 'border border-secondary'} ${count > 100 ? 'text-[10px]' : 'text-xs'}`}>{count}</span>
      </div>
      <p className={`text-xs ${active ? '' : 'text-tertiary'}`}>{formatCurrency(money)}</p>

      <ButtonShape />
      
    </div>
  )
}

// polygon(calc(100% - 6px) 0,100% 50%,calc(100% - 6px) 100%,2px 100%,8px 50%,2px 0)