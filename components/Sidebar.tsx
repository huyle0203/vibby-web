"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Zap, Music, User, Plus } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-black border-r border-gray-800 flex flex-col items-center py-6">
      {/* Logo at the top */}
      <Link href="/" className="mb-8 transition-transform hover:scale-110">
        <Image src="/images/penguin.png" alt="Vibby" width={40} height={40} className="w-10 h-10" />
      </Link>

      {/* Navigation icons */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <NavItem href="/" icon={<Home size={28} />} isActive={pathname === "/"} />
        <NavItem href="/discover" icon={<Zap size={28} />} isActive={pathname === "/discover"} />
        <BigButton onClick={() => setIsModalOpen(true)} />
        <NavItem href="/music" icon={<Music size={28} />} isActive={pathname === "/music"} />
        <NavItem href="/profile" icon={<User size={28} />} isActive={pathname === "/profile"} />
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  isActive: boolean
}

function NavItem({ href, icon, isActive }: NavItemProps) {
  return (
    <Link href={href} className="relative group">
      <div
        className={`p-2 rounded-md transition-colors ${
          isActive ? "text-[#57D0FF]" : "text-white opacity-60 group-hover:opacity-100"
        }`}
      >
        {icon}
      </div>
    </Link>
  )
}

function BigButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-[59px] h-[48px] rounded-xl bg-[#1F2937] flex items-center justify-center shadow-md hover:bg-gray-700 transition-colors"
    >
      <Plus size={24} className="text-white opacity-80" strokeWidth={3.5} />
    </button>
  )
}

