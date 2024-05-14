import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Copy } from "lucide-react";
import MaskedInput from 'react-text-mask'


export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

interface InputCustom extends InputProps {
  actions?: {
    clear?: () => void;
    isDirty?: boolean;
    copy?: () => void;
  };
  mask?: (string | RegExp)[];
  long?: boolean;
  containerClassName?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputCustom>(
  ({ className, containerClassName, long, mask, type, icon, actions, ...props }, ref) => {

    const { isDirty, clear, copy } = actions || {};

    let CustomInput: string | typeof MaskedInput = 'input';

    if (mask) {
      CustomInput = MaskedInput;
    }
    if (long) {
      CustomInput = 'textarea';
    }

    return (
      <div className={cn('relative grow flex', containerClassName)}>
        <CustomInput
          type={type}
          mask={mask || []}
          className={cn(
            `${long ? 'h-32 box-border resize-none' : 'h-10'} flex w-full rounded-md border text-ellipsis border-alternate bg-transparent px-3 py-2 ${clear ? 'pr-7' : ''} text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
            className
          )}
          {...props}
        />
        {clear && isDirty && !props.disabled &&
          <button type='button' tabIndex={-1} onClick={clear} className='rounded p-1 hover:bg-alternate/20 absolute transform -translate-y-1/2 top-1/2 right-1'>
            <X className='h-4 w-4 text-tertiary' />
          </button>
        }
        {props.value !== '' && copy && props.disabled &&
          <button type='button' onClick={copy} className='rounded p-1 hover:bg-alternate/20 absolute transform -translate-y-1/2 top-1/2 right-1'>
            <Copy className='h-4 w-4 text-tertiary' />
          </button>
        }
        {icon}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
