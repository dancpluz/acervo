import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const icons = {
  factory: '/icons/factory.svg',
  client: '/icons/happy.svg',
  representative: '/icons/briefcase.svg',
  office: '/icons/chair.svg',
  service: '/icons/hammer.svg',
  collaborator: '/icons/people.svg',
}

export type Icon = keyof typeof icons | string;

type Props = {
  page: string;
  tab: Icon;
}

export default function Header({ page, tab }: Props) {
  const user = 'Thiago';

  return (
    <div className={`flex justify-between w-full items-center`} >
      <div className='flex gap-2'>
        <Image src={icons[tab as keyof typeof icons]} alt={tab} width={32} height={32} />
        <h1 className='text-3xl'>{page}</h1>
      </div>
      <div className='flex gap-6 items-center'>
        <div className='flex flex-col items-end' >
          <h2 className= 'text-xl'>Olá, {user}</h2>
          <h3 className='text-sm text-tertiary'>Admin</h3>
        </div>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className='bg-primary text-background text-xl font-medium'>{user[0]}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
