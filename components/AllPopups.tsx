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
import { translationFields } from '@/lib/utils';
import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import React from "react";

export function DeleteAlert({ submit, children }: { submit: () => void, children: React.ReactNode }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
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
              <React.Fragment key={key}>{`- ${translationFields[key]}`} <b>{conflicts[key][0]}</b>
              {` (encontrado ${conflicts[key][1]} ocorrência${conflicts[key][1] > 1 ? 's' : ''} desse dado)`}</React.Fragment>
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

export function CRMPopup({ children, button, setPopupOpen, popupOpen }: { children: React.ReactNode, button: React.ReactNode, setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>, popupOpen: boolean }) {
  return (
    <Dialog onOpenChange={setPopupOpen} open={popupOpen}>
      <DialogTrigger asChild>
        {button}
      </DialogTrigger>
      <DialogContent className='w-[760px]'>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export function CustomTooltip({ tooltip, children, delayDuration=200 }: { tooltip?: string, dialog?: React.ReactNode, children: React.ReactNode, delayDuration?: number }) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className='text-foreground bg-background'>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}