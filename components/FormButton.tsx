import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft, Plus, Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@/components/ui/popover";
import { FormState } from "react-hook-form";

type Props = {
  nextValue?: string;
  backValue?: string;
  submit?: boolean;
  state?: FormState<any>;
}

export default function FormButton({ nextValue, backValue, submit, state }: Props) {
  const error = state?.isValid ? false : undefined;
  const success = state?.isSubmitSuccessful;
  const loading = state?.isSubmitting;

  function Icon() {
    if (loading) return <LoaderCircle className='text-background animate-spin' />
    else if (success) return <Check className='text-background' />
    else return <Plus className='text-background' />
  }

  return (
    <TabsList className='m-0 flex flex-1 gap-2 justify-end items-end w-auto border-0'>
      {backValue && <TabsTrigger className='px-2 py-2 outline outline-1 outline-offset-0 outline-primary rounded-sm hover:bg-secondary/20' value={backValue}>
        <ChevronLeft className='text-primary' />
      </TabsTrigger>}
      {nextValue && <TabsTrigger className='px-2 py-2 outline outline-1 outline-offset-0 outline-primary rounded-sm hover:bg-secondary/20' value={nextValue}>
        <ChevronRight className='text-primary' />
      </TabsTrigger>}
      {submit && 
      <Popover open={error}>
        <PopoverTrigger asChild>
          <Button disabled={success || loading} className='px-2 pr-3 outline outline-primary outline-1 outline-offset-0' type='submit'>
              <Icon />ADICIONAR
          </Button>
        </PopoverTrigger>
          <PopoverContent side='top' className='outline outline-secondary outline-1 shadow-none w-full text-sm bg-background rounded-sm p-3'>
          <PopoverArrow className='fill-secondary'/>
          Preencha os campos corretamente
        </PopoverContent>
      </Popover>}
    </TabsList>
  )
}