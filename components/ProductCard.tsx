import { Eye, Trash, Edit } from 'lucide-react';

export default function ProductCard() {
  function GreyText({ children }: { children: React.ReactNode }) {
    return (<b className='text-tertiary font-normal text-xs '>{children}</b>)
  }

  function BlackText({ children }: { children: React.ReactNode }) {
    return (<p className='text-foreground text-sm'>{children}</p>)
  }

  return (
    <div className='flex border border-secondary gap-4 p-4 rounded-lg justify-between'>
      <div className='w-32 h-32 border border-primary rounded-2xl'>
        Imagem
      </div>
      <div className='flex flex-col grow'>
        <div className='flex flex-col'>
          <span className='text-tertiary text-xs'>Item 0001</span>
          <h3 className='text-xl'>Cadeira Paralelepípedo</h3>
        </div>
        <div className='flex flex-col grow gap-1'>
          <div className='flex flex-col'>
            
            <BlackText>{'34cm'}<GreyText> x </GreyText>{'34cm'}<GreyText> x </GreyText>{'34cm'}</BlackText>
            <BlackText><GreyText>DESIGN BY </GreyText>{'Rodrigo'}</BlackText>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-between px-2 py-1'>
        <Eye className='text-primary' />
        <Edit className='text-primary' />
        <Trash className='text-primary' />
      </div>
    </div>
  )
}
