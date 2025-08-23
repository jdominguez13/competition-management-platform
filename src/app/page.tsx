'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { CompetitionCard } from '@/components/ui/competition-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface Competition {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  venue: string
  status: string
  _count: {
    registrations: number
    events: number
  }
  events: Array<{
    id: string
    name: string
    entryFee: number
  }>
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('/api/competitions')
        if (response.ok) {
          const data = await response.json()
          // Only show published competitions to public
          const publishedCompetitions = data.filter((comp: Competition) => 
            comp.status === 'PUBLISHED' || comp.status === 'REGISTRATION_OPEN'
          )
          setCompetitions(publishedCompetitions)
        }
      } catch (error) {
        console.error('Error fetching competitions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompetitions()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CompeteFlow</span>
            </div>
            
            <div className="flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {session.user.name}!
                  </span>
                  {session.user.role === 'ORGANIZER' && (
                    <Link href="/dashboard">
                      <Button size="sm">Dashboard</Button>
                    </Link>
                  )}
                  <Link href="/api/auth/signout">
                    <Button variant="outline" size="sm">Sign Out</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/signin">
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Modern Figure Skating<br />Competition Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Streamline your figure skating competitions with our comprehensive platform. 
            Create competitions, manage events, and handle registrations with ease.
          </p>
          
          {!session && (
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CompeteFlow?</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy Competition Setup</h3>
                <p className="text-muted-foreground">
                  Create and manage competitions in minutes with our intuitive wizard.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Streamlined Registration</h3>
                <p className="text-muted-foreground">
                  Skaters can easily register for events with our modern registration system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Management</h3>
                <p className="text-muted-foreground">
                  Track registrations, manage events, and monitor revenue in real-time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Competitions Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Upcoming Competitions</h2>
            {session?.user.role === 'ORGANIZER' && (
              <Link href="/dashboard/competitions/new">
                <Button>
                  <Trophy className="mr-2 h-4 w-4" />
                  Create Competition
                </Button>
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : competitions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No competitions available</h3>
                <p className="text-muted-foreground">
                  Check back soon for upcoming figure skating competitions!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {competitions.map((competition) => (
                <Card key={competition.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold line-clamp-2">
                        {competition.name}
                      </h3>
                      <Badge className="bg-green-100 text-green-800">
                        Open
                      </Badge>
                    </div>
                    
                    {competition.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {competition.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {competition.venue}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Trophy className="mr-2 h-4 w-4" />
                        {competition._count.events} events available
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        {competition._count.registrations} registrations
                      </div>
                    </div>

                    <Link href={`/competitions/${competition.id}`}>
                      <Button className="w-full">
                        View & Register
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-6 w-6" />
            <span className="text-xl font-bold">CompeteFlow</span>
          </div>
          <p className="text-gray-400">
            Modern figure skating competition management platform
          </p>
        </div>
      </footer>
    </div>
  )
}