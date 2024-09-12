import { toast } from "@/components/ui/use-toast";

export function deleteToast(error: any) {
  toast({
    variant: 'destructive',
    title: 'Ocorreu um erro inesperado',
    description: error.message,
  });
}