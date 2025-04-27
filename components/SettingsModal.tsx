"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  X,
  Search,
  Share,
  Bell,
  Mail,
  Sparkles,
  UserMinus,
  Lock,
  FileText,
  Shield,
  Download,
  LogOut,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/context/AuthContext"

interface SettingsModalProps {
  isVisible: boolean
  onClose: () => void
}

export default function SettingsModal({ isVisible, onClose }: SettingsModalProps) {
  const [isPaused, setIsPaused] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isVisible])

  const handleLogout = async () => {
    await signOut()
    onClose()
    router.push("/login")
  }

  if (!isVisible) return null

  const renderSectionHeader = (title: string) => (
    <h3 className="text-white text-lg font-semibold opacity-70 mt-6 mb-2">{title}</h3>
  )

  const renderNavigationItem = (title: string, icon: React.ReactNode, color = "white", onClick?: () => void) => (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-4 border-b border-primary border-opacity-70"
    >
      <div className="flex items-center">
        <span className="mr-3" style={{ color }}>
          {icon}
        </span>
        <span className="text-white">{title}</span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-600"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-end justify-center md:items-center">
      <div className="bg-black border-t-2 border-gray-800 md:border-2 md:border-gray-800 rounded-t-3xl md:rounded-xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
        <div className="flex justify-center items-center relative p-4 border-b border-gray-800">
          <h2 className="text-primary font-bold text-lg">Settings</h2>
          <button onClick={onClose} className="absolute right-4">
            <X className="text-white" size={24} />
          </button>
        </div>

        <div className="overflow-auto">
          {renderSectionHeader("Profile")}
          <div className="border border-primary rounded-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-primary border-opacity-70">
              <div className="flex items-center">
                <Search className="text-white mr-3" size={20} />
                <div>
                  <p className="text-white font-semibold">Pause</p>
                  <p className="text-gray-400 text-sm">
                    Pausing prevents your profile from being shown to new people. You can still chat with your current
                    matches.
                  </p>
                </div>
              </div>
              <Switch checked={isPaused} onCheckedChange={setIsPaused} />
            </div>
            {renderNavigationItem("Share Profile", <Share size={20} />)}
          </div>

          {renderSectionHeader("Notifications")}
          <div className="border border-primary rounded-lg mx-4 overflow-hidden">
            {renderNavigationItem("Push Notifications", <Bell size={20} />)}
            {renderNavigationItem("Email", <Mail size={20} />)}
          </div>

          {renderSectionHeader("Subscription")}
          <div className="border border-primary rounded-lg mx-4 overflow-hidden">
            {renderNavigationItem("Subscribe to Vibby", <Sparkles size={20} />, "#FFBA0A")}
            {renderNavigationItem("Restore Subscription", <Sparkles size={20} />)}
          </div>

          {renderSectionHeader("Users")}
          <div className="border border-primary rounded-lg mx-4 overflow-hidden">
            {renderNavigationItem("Block List", <UserMinus size={20} />)}
          </div>

          {renderSectionHeader("Legal")}
          <div className="border border-primary rounded-lg mx-4 overflow-hidden">
            {renderNavigationItem("Privacy Policy", <Lock size={20} />)}
            {renderNavigationItem("Terms of Service", <FileText size={20} />)}
            {renderNavigationItem("Your Privacy Choices", <Shield size={20} />)}
            {renderNavigationItem("Download My Data", <Download size={20} />)}
          </div>

          {renderSectionHeader("Account Management")}
          <div className="border border-primary rounded-lg mx-4 overflow-hidden mb-8">
            <button className="w-full p-4 text-left text-white border-b border-primary border-opacity-70">
              Disable Account
            </button>
            <button className="w-full p-4 text-left text-red-500 border-b border-primary border-opacity-70">
              Delete Account
            </button>
            <button onClick={handleLogout} className="w-full p-4 text-left flex items-center text-white">
              <LogOut size={20} className="mr-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
