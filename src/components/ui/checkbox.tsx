"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps {
  checked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean) => void
  className?: string
  disabled?: boolean
  "aria-label"?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    const [isHydrated, setIsHydrated] = React.useState(false)
    
    React.useEffect(() => {
      setIsHydrated(true)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
    }

    // Durante a hidratação, use um estado neutro para evitar inconsistências
    const displayChecked = isHydrated ? checked : false

    return (
      <div className="relative inline-flex items-center">
        <input
          ref={ref}
          type="checkbox"
          checked={displayChecked === true}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
            displayChecked === true && "bg-primary text-primary-foreground",
            displayChecked === "indeterminate" && "bg-primary text-primary-foreground",
            className
          )}
        >
          {displayChecked === true && <Check className="h-3 w-3" />}
          {displayChecked === "indeterminate" && (
            <div className="h-2 w-2 bg-current rounded-sm" />
          )}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }