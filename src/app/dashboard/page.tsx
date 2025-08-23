'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { CompetitionCard } from '@/components/ui/competition-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Users, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Plus,
  Eye
} from 'lucide-react'
import Link from 'next/link'

// Mock data - in real app this would come from API
const mockUser = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  role: 'ORGANIZER' as const
}

const mockStats = {
  activeCompetitions: 3,
  totalRegistrations: 247,
  revenueYTD: 12500,
  upcomingEvents: 8
}

const mockRecentCompetitions = [
  {
    id: '1',
    name: 'Spring Championships 2025',
    description: 'Annual spring figure skating championship',
    type: 'US_FIGURE_SKATING',
    status: 'PUBLISHED',
    startDate: '2025-03-15',
    endDate: '2025-03-17',
    location: 'Ice Arena Downtown',
    isPublished: true,
    _count: { registrations: 142 },
    events: [
      { id: '1', name: 'Juvenile Girls Freestyle', entryFee: 45 },
      { id: '2', name: 'Adult Bronze Freestyle', entryFee: 35 }
    ]
  },
  {
    id: '2',
    name: 'Winter Regional 2025',
    description: 'Regional winter competition',
    type: 'US_FIGURE_SKATING',
    status: 'DRAFT',
    startDate: '2025-02-20',
    endDate: '2025-02-22',
    location: 'Mountain View Rink',
    isPublished: false,
    _count: { registrations: 0 },
    events: []
  }
]

const mockRecentActivity = [
  {
    id: '1',
    type: 'registration',
    message: 'Emma Wilson registered for Juvenile Girls Freestyle',
    timestamp: '2 hours ago',
    competition: 'Spring Championships 2025'
  },
  {
    id: '2',
    type: 'payment',
    message: 'Payment received from Michael Chen - $35.00',
    timestamp: '4 hours ago',
    competition: 'Spring Championships 2025'
  },
  {
    id: '3',
    type: 'competition',
    message: 'Winter Regional 2025 needs schedule configuration',
    timestamp: '1 day ago',
    competition: 'Winter Regional 2025'
  }
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [competitions, setCompetitions] = useState<any[]>([])

  useEffect(() => {
    // Fetch competitions from API
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('/api/competitions')
        if (response.ok) {
          const data = await response.json()
          // Show only the most recent 2 competitions on dashboard
          setCompetitions(data.slice(0, 2))
        } else {
          // Fallback to mock data if API fails
          console.warn('API failed, using mock data')
          setCompetitions(mockRecentCompetitions)
        }
      } catch (error) {
        console.error('Error fetching competitions:', error)
        // Fallback to mock data
        setCompetitions(mockRecentCompetitions)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompetitions()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration': return <Users className="h-4 w-4 text-blue-600" />
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />
      case 'competition': return <Trophy className="h-4 w-4 text-orange-600" />
      default: return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout user={mockUser}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={mockUser}>
      <div className="flex flex-col gap-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {mockUser.name.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your competitions today.
            </p>
          </div>
          <Link href="/dashboard/competitions/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Competition
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Competitions
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeCompetitions}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Registrations
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalRegistrations}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12</span> this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Revenue YTD
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mockStats.revenueYTD.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+18%</span> from last year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                Next event in 3 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Competitions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Competitions</CardTitle>
                <Link href="/dashboard/competitions">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitions.map((competition) => (
                    <CompetitionCard
                      key={competition.id}
                      competition={competition}
                      showActions={true}
                      onEdit={(id) => console.log('Edit competition:', id)}
                      onDelete={(id) => console.log('Delete competition:', id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">
                          {activity.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {activity.timestamp}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {activity.competition}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}