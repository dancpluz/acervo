import { formatCurrency } from "@/lib/utils";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function ChangeTab({ text, count, active, route, money }: { text: string, count: number, active: boolean, route: string, money: number }) {
  return (
    <Link href={`/crm/${route}`}>
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

function ButtonShape({ type, active }: { type?: StatusTypes, active: boolean }) {
    switch (type) {
      case 'front':
        return (
          <>
            {!active && <div className={`absolute right-[-8px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[9px] border-t-[26px] border-b-[26px] rounded-md border-t-transparent border-b-transparent border-l-secondary`} />}

            <div className={`absolute right-[-6.5px] top-1/2 transform -translate-y-1/2 bottom-0 w-0 h-0 border-l-[8px] border-t-[23px] border-b-[23px] rounded border-t-transparent border-b-transparent ${active ? 'border-l-primary right-[-8.5px]' : 'border-l-background'}`} />
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

            <div className={`absolute right-[-6.5px] top-1/2 transform -translate-y-1/2 bottom-0 w-0 h-0 border-l-[8px] border-t-[23px] border-b-[23px] rounded border-t-transparent border-b-transparent ${active ? 'border-l-primary right-[-8.5px]' : 'border-l-background'}`} />

            {!active && <div className={`absolute left-[0px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[9px] border-t-[26px] border-b-[26px] rounded-md border-t-transparent border-b-transparent border-l-secondary`} />}

            <div className={`absolute left-[0px] top-1/2 transform -translate-y-1/2 bottom-0 w-0 h-0 border-l-[8px] border-t-[23px] border-b-[23px] rounded border-t-transparent border-b-transparent border-l-background`} />
          </>
        )
      default: 
        return;
    }
  }

export function StatusFilter({ type, text, count, active, route, money }: { type?: StatusTypes, text: string, count: number, active: boolean, route: string, money: number }) {
  
  return (
    <div className={`flex flex-col px-2 py-1 text-background rounded-sm relative ${active ? type === 'lost' ? 'bg-destructive' : 'bg-primary' : type === 'lost' ? 'border border-destructive' : 'border border-secondary bg-background'} ${type === 'back' || type === 'both' ? 'pl-4 border-l-0' : ''}`}>
      <div className='flex grow items-center gap-1'>
        <h3 className={`text-sm ${active ? '' : 'text-foreground'}`}>{text}</h3>
        <span className={`flex justify-center items-center w-5 h-5 bg-background rounded-full text-foreground ${active ? '' : type === 'lost' ? 'border-destructive border' : 'border border-secondary'} ${count > 100 ? 'text-[10px]' : 'text-xs'}`}>{count}</span>
      </div>
      <p className={`text-xs ${active ? '' : 'text-tertiary'}`}>{formatCurrency(money)}</p>

      <ButtonShape type={type} active={active} />
      
    </div>
  )
}

// polygon(calc(100% - 6px) 0,100% 50%,calc(100% - 6px) 100%,2px 100%,8px 50%,2px 0)
//[&>div:nth]:border-l-red-500

export function StatusButton({ type, text, statusNum, num, onClick }: { type?: StatusTypes, text: string, statusNum: number, num: number, onClick: () => void }) {
'bg-destructive hover:bg-destructive/80 border-destructive'
'border border-destructive hover:bg-destructive/20'
  const buttonStyle = () => {
    if (type === 'lost') {
      return statusNum === 0 ? 'bg-destructive hover:bg-destructive/80 border-destructive' : 'border border-destructive hover:bg-destructive/20 text-foreground'
    } else {
      return statusNum >= num ? 'bg-primary border-primary hover:bg-primary/80' : 'border-secondary bg-background'
    }
  }  

  return (
    <Button type='button' onClick={onClick} className={`flex bg-background h-auto flex-col px-2 py-2 text-background border transition-colors hover:bg-secondary/20 rounded-sm relative ${buttonStyle()} ${type === 'back' || type === 'both' ? 'pl-4 border-l-0' : ''}`}>
      <div className='flex grow items-center gap-1'>
        <h3 className={`text-base leading-7 ${statusNum >= num ? '' : 'text-foreground'}`}>{text}</h3>
      </div>
      <ButtonShape type={type} active={statusNum >= num} />
    </Button>
  )
}