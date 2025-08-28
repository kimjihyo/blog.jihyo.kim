"use client";
import * as React from "react";
import { motion } from "motion/react";

const tickVariants = {
  checked: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      delay: 0.2,
    },
  },
  unchecked: {
    pathLength: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

interface CheckboxProps {
  id: string;
  name?: string;
  defaultChecked?: boolean;
}

export function Checkbox({ id, name, defaultChecked }: CheckboxProps) {
  const [isChecked, setIsChecked] = React.useState(defaultChecked ?? false);

  return (
    <button className="relative flex items-center">
      <input
        type="checkbox"
        value={isChecked ? "true" : "false"}
        className="border-blue-gray-200 relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 transition-all duration-500 checked:border-primary checked:bg-primary"
        onChange={() => setIsChecked(!isChecked)}
        id={id}
        name={name}
        defaultChecked={defaultChecked}
      />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3.5"
          stroke="currentColor"
          className="h-3.5 w-3.5"
          initial={false}
          animate={isChecked ? "checked" : "unchecked"}
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
            variants={tickVariants}
          />
        </motion.svg>
      </div>
    </button>
  );
}
