import { DateTimeField, InputField, ReferenceField } from "@/components/AllFields";
import { Trash2, CirclePlus, Pencil } from "lucide-react";
import { actionFields, FieldT } from "@/lib/fields";

export default function ActionForm({ path, append, remove, edit}: { path: string, append?: () => void, remove?: () => void, edit?: () => void }) {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-lg text-foreground'>Nova Ação</h1>
      <ReferenceField path={path} customClass={'grow-0'} obj={actionFields.collaborator as FieldT} refPath='collaborator' hint={'Ex. Thiago'} person />
      <InputField path={path} obj={actionFields.description as FieldT} long />
      <DateTimeField path={path} obj={actionFields.date as FieldT} />
      <div className='flex relative p-1 justify-between items-center'>
        {remove ? <Trash2 onClick={remove} className='cursor-pointer hover:text-primary/80 h-6 w-6 text-primary' /> : <div/>}
        {edit ? 
          <Pencil onClick={edit} className='cursor-pointer hover:text-primary/80 h-6 w-6 text-primary' /> 
            : 
          <CirclePlus onClick={append} className='cursor-pointer hover:text-primary/80 h-6 w-6 text-primary' />
        }
      </div>
    </div>
  )
}
