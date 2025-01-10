// 'use client'

// import { formatCurrency } from "@/lib/utils";

// export default function FilterStatus({ type, text, count, active, route, money }: { type?: StatusTypes, text: string, count: number, active: boolean, route: string, money: number }) {

//   return (
//     <div className={`flex flex-col px-2 py-1 text-background rounded-sm relative ${active ? type === 'lost' ? 'bg-destructive' : 'bg-primary' : type === 'lost' ? 'border border-destructive' : 'border border-secondary bg-background'} ${type === 'back' || type === 'both' ? 'pl-4 border-l-0' : ''}`}>
//       <div className='flex grow items-center gap-1'>
//         <h3 className={`text-sm ${active ? '' : 'text-foreground'}`}>{text}</h3>
//         <span className={`flex justify-center items-center w-5 h-5 bg-background rounded-full text-foreground ${active ? '' : type === 'lost' ? 'border-destructive border' : 'border border-secondary'} ${count > 100 ? 'text-[10px]' : 'text-xs'}`}>{count}</span>
//       </div>
//       <p className={`text-xs ${active ? '' : 'text-tertiary'}`}>{formatCurrency(money)}</p>

//       <ButtonShape type={type} active={active} />
      
//     </div>
//   )
// }