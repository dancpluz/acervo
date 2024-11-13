'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';
import { translationFields } from '@/lib/utils';
import { Dispatch, SetStateAction } from "react";

export function DeleteAlert({ submit }: { submit: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className='flex gap-2 items-center justify-center transition-opacity hover:opacity-50 rounded-none h-9.5 border-0 border-b border-primary text-primary px-4'><Trash2 className='w-4 h-4' />APAGAR</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza que deseja apagar?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação eliminará removerá os dados dos nossos servidores. Essa ação é irreversível.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>CANCELAR</AlertDialogCancel>
          <AlertDialogAction onClick={submit}>APAGAR</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function ConfirmAlert({ submit, popupOpen, setPopupOpen, conflicts, resetForm }: { submit: () => void, popupOpen: boolean, setPopupOpen: Dispatch<SetStateAction<boolean>>, conflicts: { [key: string]: [string, number] }, resetForm: () => void }) {
  return (
    <AlertDialog open={popupOpen} onOpenChange={setPopupOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza que deseja adicionar?</AlertDialogTitle>
          <AlertDialogDescription>
            Foi encontrado no nosso banco de dados registros com estes mesmos dados:
            {conflicts ? Object.keys(conflicts).map((key) => 
              <React.ReactFragment key={key}>{`- ${translationFields[key]}`} <b>{conflicts[key][0]}</b>
              {` (encontrado ${conflicts[key][1]} ocorrência${conflicts[key][1] > 1 ? 's' : ''} desse dado)`}</React.ReactFragment>
            ) : <>Não encontrado...</>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={resetForm}>NÃO</AlertDialogCancel>
          <AlertDialogAction onClick={submit}>SIM</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}