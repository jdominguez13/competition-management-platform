'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { RegistrationForm } from '@/components/ui/registration-form'
import { EventCard } from '@/components/ui/event-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Calendar,
  MapPin,
  Trophy,
  Users,
  DollarSign,
  Clock,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

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
  _count: {
    registrations: number
  }
}

// Mock skaters for registration form (matching database IDs)
const mockSkaters = [
  { id: 'skater1', name: 'Emma Wilson', email: 'emma@example.com' },
  { id: 'skater2', name: 'Michael Chen', email: 'michael@example.com' },
  { id: 'skater3', name: 'Sarah Davis', email: 'sarah.davis@example.com' },
]

export default function PublicCompetitionPage() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showRegistration, setShowRegistration] = useState(false)

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
      case 'registration_open': return 'bg-green-100 text-green-800'
      case 'published': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRegister = (eventId: string) => {
    const event = competition?.events.find(e => e.id === eventId)
    if (event) {
      setSelectedEvent(event)
      setShowRegistration(true)
    }
  }

  const handleRegistrationSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const registration = await response.json()
        console.log('Registration successful:', registration)
        
        // Close dialog and show success message
        setShowRegistration(false)
        setSelectedEvent(null)
        
        // TODO: Show success toast/message
        alert('Registration successful!')
        
        // Refresh competition data to update registration counts
        window.location.reload()
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    }
  }

  const isRegistrationOpen = (status: string) => {
    return status === 'PUBLISHED' || status === 'REGISTRATION_OPEN'
  }

  const getDaysUntilStart = () => {
    if (!competition) return 0
    return Math.max(0, Math.ceil((new Date(competition.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Competition not found</h3>
              <p className="text-muted-foreground mb-4">
                The competition you're looking for doesn't exist or is not available.
              </p>
              <Link href="/">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Badge className={getStatusColor(competition.status)}>
              {competition.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Competition Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{competition.name}</h1>
            {competition.description && (
              <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
                {competition.description}
              </p>
            )}
          </div>

          {/* Competition Info Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="mx-auto h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Date</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="mx-auto h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-sm text-muted-foreground">{competition.venue}</p>
                {competition.address && (
                  <p className="text-xs text-muted-foreground">{competition.address}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="mx-auto h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Events</h3>
                <p className="text-2xl font-bold text-primary">{competition._count.events}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="mx-auto h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Days Until</h3>
                <p className="text-2xl font-bold text-primary">{getDaysUntilStart()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Registration Status */}
          {!isRegistrationOpen(competition.status) && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-yellow-800 mb-2">Registration Not Open</h3>
                <p className="text-yellow-700">
                  Registration for this competition is currently {competition.status.toLowerCase().replace('_', ' ')}. 
                  Please check back later or contact the organizer for more information.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Events Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Available Events</h2>
            
            {competition.events.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No events available</h3>
                  <p className="text-muted-foreground">
                    Events for this competition haven't been published yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {competition.events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showActions={false}
                    onRegister={isRegistrationOpen(competition.status) ? handleRegister : undefined}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Competition Details */}
          <Card>
            <CardHeader>
              <CardTitle>Competition Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Organizer</h4>
                  <p className="text-muted-foreground">{competition.organizer.name}</p>
                  <p className="text-sm text-muted-foreground">{competition.organizer.email}</p>
                </div>
                
                {competition.club && (
                  <div>
                    <h4 className="font-semibold mb-2">Host Club</h4>
                    <p className="text-muted-foreground">{competition.club.name}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2">Base Entry Fee</h4>
                  <p className="text-2xl font-bold text-primary">${competition.entryFee}</p>
                  <p className="text-sm text-muted-foreground">Individual events may have different fees</p>
                </div>
                
                {competition.maxEntries && (
                  <div>
                    <h4 className="font-semibold mb-2">Total Registrations</h4>
                    <p className="text-lg">
                      {competition._count.registrations} / {competition.maxEntries}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register for {selectedEvent?.name}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <RegistrationForm
              event={selectedEvent}
              competitionId={competition.id}
              skaters={mockSkaters}
              onSubmit={handleRegistrationSubmit}
              onCancel={() => setShowRegistration(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}