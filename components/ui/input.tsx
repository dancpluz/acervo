import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import MaskedInput from 'react-text-mask'


export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

interface InputCustom extends InputProps {
  actions?: {
    clear?: () => void;
    isDirty?: boolean;
  };
  mask?: (string | RegExp)[];
}

const Input = React.forwardRef<HTMLInputElement, InputCustom>(
  ({ className, mask, type, actions, ...props }, ref) => {

    const { isDirty, clear } = actions || {};
    const MyInput = mask ? MaskedInput : 'input';

    return (
      <div className='relative'>
        <MyInput
          type={type}
          mask={mask || []}
          className={cn(
            `flex h-10 w-full rounded-md border text-ellipsis border-alternate bg-transparent px-3 py-2 ${clear ? 'pr-7' : ''} text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
            className
          )}
          ref={ref}
          {...props}
        />
        {clear && isDirty &&
          <button onClick={clear} className='absolute transform -translate-y-1/2 top-1/2 right-2'>
            <X className='h-4 w-4 text-tertiary' />
          </button>
        }
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
