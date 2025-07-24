import Link from 'next/link'
import { PencilRuler } from 'lucide-react'
import UserActions from "./UserActions"



import { DarkModeToggle } from '@/components/DarkModeToogle'

export default function Header() {

  return (
    <header className="bg-white dark:bg-zinc-900 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-yellow-500 lg:border-none">
          <div className="flex items-center">
            <Link href="/">
              <span className="sr-only">DoodleDeck</span>
              <PencilRuler className="h-8 w-auto text-yellow-600" />
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              <Link href="#features" className="text-base font-medium dark:text-zinc-300 hover:text-yellow-700 dark:hover:text-yellow-400">
                Features
              </Link>
              <Link href="#how-it-works" className="text-base font-medium dark:text-zinc-300 hover:text-yellow-700 dark:hover:text-yellow-400">
                How It Works
              </Link>
              <Link href="#pricing" className="text-base font-medium dark:text-zinc-300 hover:text-yellow-700 dark:hover:text-yellow-400">
                Pricing
              </Link>
              <Link href="/canvas" className="text-base font-medium dark:text-zinc-300 hover:text-yellow-700 dark:hover:text-yellow-400">
                Canvas
              </Link>
            </div>
          </div>
          <div className="ml-10 space-x-4 flex items-center">
            <DarkModeToggle />
            <UserActions />

          </div>
        </div>
      </nav>
    </header>
  )
}

