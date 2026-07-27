'use client'

import { useSidebar } from '@/lib/SidebarContext'

export default function ContentShell({ children }) {
  const { isOpen } = useSidebar()

  return (
    <div
      className={`min-h-screen flex flex-col pt-[72px] lg:pt-20 transition-all duration-300 ease-out
        ${isOpen ? 'lg:ml-56' : 'lg:ml-16'}
        ml-0`}
    >
      {children}
    </div>
  )
}
