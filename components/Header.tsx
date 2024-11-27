import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const icons = {
  fabricas: '/icons/factory.svg',
  clientes: '/icons/happy.svg',
  representacoes: '/icons/briefcase.svg',
  escritorios: '/icons/chair.svg',
  servicos: '/icons/hammer.svg',
  colaboradores: '/icons/people.svg',
}

export type IconT = keyof typeof icons | string;

export default function Header({ page, tab, children }: { page?: string, tab?: IconT, children?: React.ReactNode }) {
  const user = 'Thiago';

  return (
    <div className={`flex justify-between w-full items-center`} >
      {page && <div className='flex gap-2'>
        {tab && <Image src={icons[tab as keyof typeof icons]} alt={tab} width={32} height={32} />}
        <h1 className='text-3xl'>{page}</h1>
      </div>}
      {children}
      <div className='flex gap-6 items-center'>
        <div className='flex flex-col items-end' >
          <h2 className= 'text-xl'>Olá, {user}</h2>
          <h3 className='text-sm text-tertiary'>Admin</h3>
        </div>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>{user[0]}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
