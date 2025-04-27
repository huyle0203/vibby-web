"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface VibeFactEditModalProps {
  isVisible: boolean
  onClose: () => void
  factIndex: number
  initialFact: string
  onSave: (index: number, fact: string) => void
}

export default function VibeFactEditModal({
  isVisible,
  onClose,
  factIndex,
  initialFact,
  onSave,
}: VibeFactEditModalProps) {
  const [fact, setFact] = useState(initialFact)
  const MAX_LENGTH = 100

  useEffect(() => {
    setFact(initialFact)
  }, [initialFact, isVisible])

  const handleSave = () => {
    onSave(factIndex, fact)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-primary rounded-xl w-full max-w-md p-4 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-bold">Edit Vibe Fact #{factIndex + 1}</h2>
          <button onClick={onClose}>
            <X className="text-white" size={24} />
          </button>
        </div>

        <textarea
          value={fact}
          onChange={(e) => setFact(e.target.value.slice(0, MAX_LENGTH))}
          placeholder={`Enter your vibe fact #${factIndex + 1}`}
          className="w-full bg-black text-white border border-primary rounded-lg p-3 h-32 mb-2"
        />
        <div className="text-right text-gray-400 text-sm mb-4">
          {fact.length}/{MAX_LENGTH}
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
