"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface EditFieldModalProps {
  isVisible: boolean
  onClose: () => void
  fieldName: string
  initialValue: string
  onSave: (fieldName: string, value: string) => void
  maxLength: number
}

export default function EditFieldModal({
  isVisible,
  onClose,
  fieldName,
  initialValue,
  onSave,
  maxLength,
}: EditFieldModalProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue, isVisible])

  const handleSave = () => {
    onSave(fieldName, value)
  }

  const getFieldLabel = () => {
    switch (fieldName) {
      case "name":
        return "Name"
      case "highlight_bio":
        return "Bio"
      case "looking_for":
        return "Looking For"
      case "likes":
        return "What I Like"
      case "dislikes":
        return "What I Dislike"
      default:
        return fieldName
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-primary rounded-xl w-full max-w-md p-4 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-bold">Edit {getFieldLabel()}</h2>
          <button onClick={onClose}>
            <X className="text-white" size={24} />
          </button>
        </div>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
          placeholder={`Enter your ${getFieldLabel().toLowerCase()}`}
          className="w-full bg-black text-white border border-primary rounded-lg p-3 h-32 mb-2"
        />
        <div className="text-right text-gray-400 text-sm mb-4">
          {value.length}/{maxLength}
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-primary rounded-lg text-white">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary rounded-lg text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
