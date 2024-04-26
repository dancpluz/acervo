import * as React from "react"
import { cn } from "@/lib/utils"

const FormDiv = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex gap-2", className)}
    {...props}
  />
))
FormDiv.displayName = "FormDiv"

const TabDiv = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 flex flex-col gap-4", className)}
    {...props}
  />
))
TabDiv.displayName = "TabDiv"

export {
  FormDiv,
  TabDiv,
}
