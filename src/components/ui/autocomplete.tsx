"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

export interface AutocompleteProps extends React.ComponentProps<typeof Input> {
  suggestions: string[];
  minLength?: number;
  ref?: React.Ref<HTMLInputElement>;
}

export function Autocomplete({
  suggestions,
  minLength = 1,
  className,
  ref,
  ...props
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number | null>(
    null
  );
  const [inputValue, setInputValue] = React.useState(
    props.defaultValue ? String(props.defaultValue) : ""
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Controlled/uncontrolled support
  const isControlled = props.value !== undefined;
  const value = isControlled ? String(props.value) : inputValue;

  const filtered =
    value.length >= minLength
      ? suggestions.filter(
          (s) =>
            s.toLowerCase().includes(value.toLowerCase()) &&
            s.toLowerCase() !== value.toLowerCase()
        )
      : [];

  React.useEffect(() => {
    if (!open) setHighlightedIndex(null);
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInputValue(e.target.value);
    props.onChange?.(e);
    setOpen(true);
  };

  const handleSelect = (suggestion: string) => {
    if (!isControlled) setInputValue(suggestion);
    if (props.onChange) {
      const event = {
        ...new Event("change", { bubbles: true }),
        target: { value: suggestion },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      props.onChange(event);
    }
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev === null || prev === filtered.length - 1 ? 0 : prev + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev === null || prev === 0 ? filtered.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && highlightedIndex !== null) {
      e.preventDefault();
      handleSelect(filtered[highlightedIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Merge the decoupled ref with the internal ref
  React.useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") ref(inputRef.current);
    else if (ref && typeof ref === "object")
      (ref as React.MutableRefObject<HTMLInputElement | null>).current =
        inputRef.current;
  }, [ref]);

  return (
    <div className={cn("relative", className)}>
      <Input
        {...props}
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref && typeof ref === "object")
            (ref as React.MutableRefObject<HTMLInputElement | null>).current =
              node;
        }}
        value={value}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-48 overflow-auto"
          >
            {filtered.map((s, i) => (
              <li
                key={s}
                className={cn(
                  "px-3 py-2 cursor-pointer",
                  i === highlightedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
                onMouseDown={() => handleSelect(s)}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                {s}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
