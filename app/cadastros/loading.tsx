import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <LoaderCircle className='text-primary size-16 animate-spin' />
    </div>
  )
}