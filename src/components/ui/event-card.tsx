'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, DollarSign, Clock, Trophy } from 'lucide-react'

interface Event {
  id: string
  name: string
  description?: string
  category: string
  level: string
  ageGroup: string
  entryFee: number
  earlyBirdFee?: number
  maxParticipants?: number
  maxEntries?: number
  prerequisites?: string[]
  requirements?: string
  scheduledAt?: string
  _count?: {
    registrations: number
  }
  competition?: {
    id: string
    name: string
  }
}

interface EventCardProps {
  event: Event
  showActions?: boolean
  onRegister?: (id: string) => void
  onEdit?: (id: string) => void
  isRegistered?: boolean
}

export function EventCard({ 
  event, 
  showActions = false,
  onRegister,
  onEdit,
  isRegistered = false
}: EventCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'freestyle': return 'bg-blue-100 text-blue-800'
      case 'moves': return 'bg-green-100 text-green-800'
      case 'dance': return 'bg-purple-100 text-purple-800'
      case 'synchronized': return 'bg-pink-100 text-pink-800'
      case 'pairs': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRegister = async () => {
    if (onRegister) {
      setIsLoading(true)
      await onRegister(event.id)
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event.id)
    }
  }

  const isEarlyBird = event.earlyBirdFee && event.earlyBirdFee < event.entryFee
  const maxEntries = event.maxParticipants || event.maxEntries
  const isFull = maxEntries && (event._count?.registrations || 0) >= maxEntries
  const spotsLeft = maxEntries ? maxEntries - (event._count?.registrations || 0) : null

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {event.name}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
            {isRegistered && (
              <Badge className="bg-green-100 text-green-800">
                Registered
              </Badge>
            )}
          </div>
        </div>
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Level:</span>
            <span className="font-medium">{event.level}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Age Group:</span>
            <span className="font-medium">{event.ageGroup}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Entry Fee:</span>
            <span className="font-medium">
              ${event.entryFee}
              {isEarlyBird && (
                <span className="text-green-600 ml-1">
                  (Early bird: ${event.earlyBirdFee})
                </span>
              )}
            </span>
          </div>
          
          {event.scheduledAt && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              {formatDate(event.scheduledAt)} at {formatTime(event.scheduledAt)}
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            {event._count?.registrations || 0} registered
            {spotsLeft !== null && (
              <span className={`ml-1 ${spotsLeft <= 5 ? 'text-orange-600' : ''}`}>
                ({spotsLeft} spots left)
              </span>
            )}
          </div>
          
          {((event.prerequisites && event.prerequisites.length > 0) || event.requirements) && (
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">
                {event.prerequisites ? 'Prerequisites:' : 'Requirements:'}
              </span>
              <div className="flex flex-wrap gap-1">
                {event.prerequisites ? (
                  event.prerequisites.map((prereq, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {prereq}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {event.requirements}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        {!showActions ? (
          <>
            <Button
              variant={isRegistered ? "outline" : "default"}
              size="sm"
              onClick={handleRegister}
              disabled={isLoading || isFull || isRegistered}
            >
              {isRegistered ? 'Registered' : isFull ? 'Full' : 'Register'}
            </Button>
            
            {isFull && (
              <Badge variant="destructive">
                Full
              </Badge>
            )}
          </>
        ) : (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              disabled={isLoading}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="flex-1"
            >
              View Registrations
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}