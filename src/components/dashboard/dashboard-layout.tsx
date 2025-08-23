'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  BarChart3,
  Calendar,
  DollarSign,
  Home,
  Menu,
  Settings,
  Trophy,
  Users,
  Bell,
  Plus
} from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  current?: boolean
}

interface User {
  id: string
  name: string
  email: string
  role: 'ORGANIZER' | 'COACH' | 'SKATER' | 'CLUB_ADMIN'
  avatar?: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
  notifications?: number
}

const getNavigationItems = (role: string): NavigationItem[] => {
  const baseItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
  ]

  switch (role) {
    case 'ORGANIZER':
      return [
        ...baseItems,
        { name: 'Competitions', href: '/dashboard/competitions', icon: Trophy },
        { name: 'Registrations', href: '/dashboard/registrations', icon: Users },
        { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
        { name: 'Revenue', href: '/dashboard/revenue', icon: DollarSign },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    
    case 'COACH':
      return [
        ...baseItems,
        { name: 'Students', href: '/dashboard/students', icon: Users },
        { name: 'Competitions', href: '/dashboard/competitions', icon: Trophy },
        { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    
    case 'SKATER':
      return [
        ...baseItems,
        { name: 'My Competitions', href: '/dashboard/competitions', icon: Trophy },
        { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
        { name: 'Profile', href: '/dashboard/profile', icon: Settings },
      ]
    
    case 'CLUB_ADMIN':
      return [
        ...baseItems,
        { name: 'Members', href: '/dashboard/members', icon: Users },
        { name: 'Competitions', href: '/dashboard/competitions', icon: Trophy },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    
    default:
      return baseItems
  }
}

export function DashboardLayout({ children, user, notifications = 0 }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const navigationItems = getNavigationItems(user.role)
  
  // Mark current navigation item
  const updatedNavigationItems = navigationItems.map(item => ({
    ...item,
    current: pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')
  }))

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ORGANIZER': return 'bg-purple-100 text-purple-800'
      case 'COACH': return 'bg-blue-100 text-blue-800'
      case 'SKATER': return 'bg-green-100 text-green-800'
      case 'CLUB_ADMIN': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ORGANIZER': return 'Organizer'
      case 'COACH': return 'Coach'
      case 'SKATER': return 'Skater'
      case 'CLUB_ADMIN': return 'Club Admin'
      default: return role
    }
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Trophy className="h-6 w-6" />
          <span>CompeteFlow</span>
        </Link>
      </div>
      
      <div className="flex-1">
        <nav className="grid items-start px-2 py-4 text-sm font-medium lg:px-4">
          {updatedNavigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                item.current
                  ? 'bg-muted text-primary'
                  : 'text-muted-foreground'
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
              {item.badge && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {user.role === 'ORGANIZER' && (
        <div className="mt-auto p-4">
          <Link href="/dashboard/competitions/new">
            <Button className="w-full" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Competition
            </Button>
          </Link>
        </div>
      )}
    </div>
  )

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <SidebarContent />
      </div>

      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Menu Button */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1" />
          
          {/* Notifications */}
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                {notifications > 99 ? '99+' : notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center justify-between">
                <span>Role</span>
                <Badge className={getRoleColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/dashboard/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}