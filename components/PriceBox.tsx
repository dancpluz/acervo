import { Button } from '@/components/ui/button';

export default function PriceBox({ title, text, className, active, onClick } : { title: string, text?: string, className?: string, active?: boolean, onClick?: () => void }) {

  if (onClick) {
    return (
      <Button variant='ghost' onClick={onClick} className='flex rounded-sm justify-start border gap-0 border-primary p-0 w-fit h-auto grow-0'>
        <div className={`p-2 text-center text-2xl border-r border-primary text-background ${active ? 'bg-primary text-background' : 'text-tertiary'} ${className}`}>
          {title}
        </div>
        <div className={`p-2 flex text-2xl text-center ${className}`}>
          {text ? text : '-'}
        </div>
      </Button>
    )
  }
  
  return (
    <div className='flex rounded-sm border border-primary'>
      <div className={`p-2 text-tertiary text-center text-2xl border-r border-primary ${className}`}>
        {title}
      </div>
      <div className={`p-2 text-2xl min-w-16 text-center ${className}`}>
        {text ? text : '-'}
      </div>
    </div>
  )
}
