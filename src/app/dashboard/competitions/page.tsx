'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { CompetitionCard } from '@/components/ui/competition-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Filter,
  Trophy,
  Calendar,
  MapPin
} from 'lucide-react'
import Link from 'next/link'

// Mock data - in real app this would come from API
const mockUser = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  role: 'ORGANIZER' as const
}

const mockCompetitions = [
  {
    id: '1',
    name: 'Spring Championships 2025',
    description: 'Annual spring figure skating championship featuring all levels from beginner to advanced.',
    type: 'US_FIGURE_SKATING',
    status: 'PUBLISHED',
    startDate: '2025-03-15',
    endDate: '2025-03-17',
    location: 'Ice Arena Downtown, Chicago, IL',
    isPublished: true,
    _count: { registrations: 142 },
    events: [
      { id: '1', name: 'Juvenile Girls Freestyle', entryFee: 45 },
      { id: '2', name: 'Adult Bronze Freestyle', entryFee: 35 },
      { id: '3', name: 'Novice Men Freestyle', entryFee: 50 }
    ]
  },
  {
    id: '2',
    name: 'Winter Regional 2025',
    description: 'Regional winter competition for intermediate and advanced skaters.',
    type: 'US_FIGURE_SKATING',
    status: 'DRAFT',
    startDate: '2025-02-20',
    endDate: '2025-02-22',
    location: 'Mountain View Rink, Denver, CO',
    isPublished: false,
    _count: { registrations: 0 },
    events: []
  },
  {
    id: '3',
    name: 'Summer Ice Festival',
    description: 'Fun summer competition with showcase events and traditional categories.',
    type: 'CUSTOM',
    status: 'REGISTRATION_OPEN',
    startDate: '2025-06-10',
    endDate: '2025-06-12',
    location: 'Riverside Ice Complex, Portland, OR',
    isPublished: true,
    _count: { registrations: 67 },
    events: [
      { id: '4', name: 'Adult Silver Freestyle', entryFee: 40 },
      { id: '5', name: 'Showcase Event', entryFee: 25 }
    ]
  },
  {
    id: '4',
    name: 'Holiday Classic 2024',
    description: 'Traditional holiday competition with festive atmosphere.',
    type: 'US_FIGURE_SKATING',
    status: 'COMPLETED',
    startDate: '2024-12-15',
    endDate: '2024-12-17',
    location: 'Winter Sports Center, Minneapolis, MN',
    isPublished: true,
    _count: { registrations: 89 },
    events: [
      { id: '6', name: 'Pre-Juvenile Girls', entryFee: 40 },
      { id: '7', name: 'Adult Bronze', entryFee: 35 }
    ]
  }
]

type FilterType = 'all' | 'draft' | 'published' | 'active' | 'completed'

export default function CompetitionsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [competitions, setCompetitions] = useState<any[]>([])
  const [filteredCompetitions, setFilteredCompetitions] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterType>('all')

  useEffect(() => {
    // Fetch competitions from API
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('/api/competitions')
        if (response.ok) {
          const data = await response.json()
          setCompetitions(data)
        } else {
          // Fallback to mock data if API fails
          console.warn('API failed, using mock data')
          setCompetitions(mockCompetitions)
        }
      } catch (error) {
        console.error('Error fetching competitions:', error)
        // Fallback to mock data
        setCompetitions(mockCompetitions)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompetitions()
  }, [])

  useEffect(() => {
    let filtered = competitions

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(comp =>
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(comp => {
        switch (statusFilter) {
          case 'draft':
            return comp.status === 'DRAFT'
          case 'published':
            return comp.status === 'PUBLISHED'
          case 'active':
            return comp.status === 'REGISTRATION_OPEN' || comp.status === 'IN_PROGRESS'
          case 'completed':
            return comp.status === 'COMPLETED'
          default:
            return true
        }
      })
    }

    setFilteredCompetitions(filtered)
  }, [competitions, searchQuery, statusFilter])

  const handleEditCompetition = (id: string) => {
    console.log('Edit competition:', id)
    // In real app: navigate to edit page
  }

  const handleDeleteCompetition = async (id: string) => {
    console.log('Delete competition:', id)
    // In real app: call API to delete
    setCompetitions(prev => prev.filter(comp => comp.id !== id))
  }

  const getStatusStats = () => {
    const stats = {
      total: competitions.length,
      draft: competitions.filter(c => c.status === 'DRAFT').length,
      published: competitions.filter(c => c.status === 'PUBLISHED').length,
      active: competitions.filter(c => c.status === 'REGISTRATION_OPEN' || c.status === 'IN_PROGRESS').length,
      completed: competitions.filter(c => c.status === 'COMPLETED').length
    }
    return stats
  }

  const stats = getStatusStats()

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Competitions</h1>
            <p className="text-muted-foreground">
              Manage your figure skating competitions and events
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
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Draft</p>
                  <p className="text-2xl font-bold">{stats.draft}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold">{stats.published}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search competitions or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={(value: FilterType) => setStatusFilter(value)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitions Grid */}
        {filteredCompetitions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No competitions found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first competition'
                }
              </p>
              {(!searchQuery && statusFilter === 'all') && (
                <Link href="/dashboard/competitions/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Competition
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompetitions.map((competition) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                showActions={true}
                onEdit={handleEditCompetition}
                onDelete={handleDeleteCompetition}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}