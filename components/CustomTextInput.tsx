"use client"

import type React from "react"

import { ArrowRight } from "lucide-react"

interface CustomTextInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  placeholder?: string
}

export default function CustomTextInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Type here...",
}: CustomTextInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit()
    }
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-10 sm:h-12 px-3 pr-12 bg-black text-white border border-[#3A93FA] rounded-md font-bold text-sm sm:text-base"
      />
      <button onClick={onSubmit} className="absolute right-3 top-1/2 -translate-y-1/2">
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
    </div>
  )
}

