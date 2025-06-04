"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

const CustomSelect = ({ 
  label, 
  items, 
  placeholder = "Select an option",
  onChange,
  value 
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [selectedValue, setValue] = useState(value || "");

  const handleSelect = (currentValue) => {
    setValue(currentValue === selectedValue ? "" : currentValue);
    if (onChange) {
      onChange(currentValue === selectedValue ? "" : currentValue);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-2 min-w-[300px]">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background px-3 font-normal"
          >
            {selectedValue ? (
              <span className="flex min-w-0 items-center gap-2">
                {(() => {
                  const selectedItem = items.find((item) => item.value === selectedValue);
                  if (selectedItem && selectedItem.icon) {
                    const Icon = selectedItem.icon;
                    return <Icon className="h-4 w-4 text-muted-foreground" />;
                  }
                  return null;
                })()}
                <span className="truncate">
                  {items.find((item) => item.value === selectedValue)?.label}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/80" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={handleSelect}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="h-4 w-4 text-muted-foreground" />}
                      {item.label}
                    </div>
                    {item.number !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {item.number.toLocaleString()}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { CustomSelect };