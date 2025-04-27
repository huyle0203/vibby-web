"use client"

import type React from "react"

import { ArrowRight } from "lucide-react"

interface CustomTextInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  placeholder?: string
  disabled?: boolean
}

export default function CustomTextInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Type here...",
  disabled = false,
}: CustomTextInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
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
        disabled={disabled}
        className="w-full h-12 px-3 pr-12 bg-black text-white border border-[#3A93FA] rounded-md font-bold disabled:opacity-50"
      />
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white disabled:opacity-50"
      >
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  )
}
