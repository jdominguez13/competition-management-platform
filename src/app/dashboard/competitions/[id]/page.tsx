'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { EventCard } from '@/components/ui/event-card'
import { EventForm } from '@/components/ui/event-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  Plus,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Trophy,
  Settings,
  Edit
} from 'lucide-react'
import Link from 'next/link'

// Mock user data
const mockUser = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  role: 'ORGANIZER' as const
}

interface Competition {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  venue: string
  address?: string
  status: string
  entryFee: number
  maxEntries?: number
  createdAt: string
  updatedAt: string
  organizer: {
    id: string
    name: string
    email: string
  }
  club?: {
    id: string
    name: string
  }
  events: Event[]
  _count: {
    registrations: number
    events: number
  }
}

interface Event {
  id: string
  name: string
  category: string
  ageGroup?: string
  level?: string
  entryFee: number
  maxEntries?: number
  description?: string
  requirements?: string
  startTime?: string
  endTime?: string
  createdAt: string
  updatedAt: string
  prerequisites?: string[]  // Add this for EventCard compatibility
  scheduledAt?: string      // Add this for EventCard compatibility
  earlyBirdFee?: number     // Add this for EventCard compatibility
  _count: {
    registrations: number
  }
}

export default function CompetitionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const response = await fetch(`/api/competitions/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setCompetition(data)
        } else {
          console.error('Failed to fetch competition')
        }
      } catch (error) {
        console.error('Error fetching competition:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchCompetition()
    }
  }, [params.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'published': return 'bg-blue-100 text-blue-800'
      case 'registration_open': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEditEvent = (eventId: string) => {
    console.log('Edit event:', eventId)
    // TODO: Navigate to event edit page
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })
      
      if (response.ok && competition) {
        // Remove event from state
        setCompetition({
          ...competition,
          events: competition.events.filter(e => e.id !== eventId)
        })
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const handleEventCreated = (newEvent: any) => {
    if (competition) {
      // Ensure the event has all required properties for EventCard
      const eventWithDefaults = {
        ...newEvent,
        prerequisites: newEvent.prerequisites || [],
        scheduledAt: newEvent.startTime || null,
        earlyBirdFee: newEvent.earlyBirdFee || null,
        _count: newEvent._count || { registrations: 0 }
      }
      
      setCompetition({
        ...competition,
        events: [...competition.events, eventWithDefaults],
        _count: {
          ...competition._count,
          events: competition._count.events + 1
        }
      })
    }
  }

  const calculateTotalRevenue = () => {
    if (!competition) return 0
    return competition.events.reduce((total, event) => {
      const registrations = event._count?.registrations || 0
      return total + (event.entryFee * registrations)
    }, 0)
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

  if (!competition) {
    return (
      <DashboardLayout user={mockUser}>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Competition not found</h3>
            <p className="text-muted-foreground mb-4">
              The competition you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/dashboard/competitions">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Competitions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={mockUser}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/competitions">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{competition.name}</h1>
              <p className="text-muted-foreground">
                Manage your competition details and events
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(competition.status)}>
              {competition.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Competition
            </Button>
          </div>
        </div>

        {/* Competition Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Events</p>
                  <p className="text-2xl font-bold">{competition._count.events}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Registrations</p>
                  <p className="text-2xl font-bold">{competition._count.registrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${calculateTotalRevenue()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Days Until</p>
                  <p className="text-2xl font-bold">
                    {Math.max(0, Math.ceil((new Date(competition.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events ({competition.events.length})</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Competition Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {competition.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{competition.description}</p>
                  </div>
                )}
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Date & Time</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <div>
                        <p>{competition.venue}</p>
                        {competition.address && <p>{competition.address}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Base Entry Fee</h4>
                    <p className="text-2xl font-bold">${competition.entryFee}</p>
                  </div>
                  
                  {competition.maxEntries && (
                    <div>
                      <h4 className="font-medium mb-2">Maximum Entries</h4>
                      <p className="text-2xl font-bold">{competition.maxEntries}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Events</h3>
              <EventForm 
                competitionId={competition.id} 
                onEventCreated={handleEventCreated}
              />
            </div>

            {competition.events.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No events yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by adding events to your competition
                  </p>
                  <EventForm 
                    competitionId={competition.id} 
                    onEventCreated={handleEventCreated}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {competition.events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showActions={true}
                    onEdit={handleEditEvent}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="registrations">
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Registrations</h3>
                <p className="text-muted-foreground">
                  Registration management coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-8 text-center">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Settings</h3>
                <p className="text-muted-foreground">
                  Competition settings coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}