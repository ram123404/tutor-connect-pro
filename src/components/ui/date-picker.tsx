
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  setDate?: (date: Date | undefined) => void
  mode: "single" | "range" | "multiple"
  selected?: Date | Date[] | undefined
  onSelect?: (date: Date | undefined) => void
  disabled?: boolean | ((date: Date) => boolean)
  initialFocus?: boolean
}

export function DatePicker({
  mode = "single",
  selected,
  onSelect,
  disabled,
  initialFocus = false,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    selected as Date | undefined
  )

  // Handle date selection
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (onSelect) onSelect(selectedDate)
  }

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode={mode}
            selected={date}
            onSelect={handleSelect}
            disabled={disabled}
            initialFocus={initialFocus}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
