// @ts-nocheck
import { DateField, InputField, ReferenceField } from "@/components/AllFields";
import { Trash2, CirclePlus } from "lucide-react";
import { actionFields } from "@/lib/fields";


export default function ActionForm({ form, path, append, remove }) {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-lg text-foreground'>Nova Ação</h1>
      <ReferenceField path={path} customClass={'grow-0'} obj={actionFields.collaborator} form={form} hint={'Ex. Punto'} />
      <InputField path={path} obj={actionFields.description} form={form} long />
      <DateField path={path} obj={actionFields.date} form={form} />
      <div className='flex relative p-1 justify-between items-center'>
        <Trash2 onClick={remove} className='cursor-pointer hover:text-primary/80 h-6 w-6 text-primary' />
        <CirclePlus onClick={append} className='cursor-pointer hover:text-primary/80 h-6 w-6 text-primary' />
      </div>
    </div>
  )
}
