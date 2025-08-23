'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarDays, MapPin, Users, DollarSign } from 'lucide-react'

interface Competition {
  id: string
  name: string
  description?: string
  type: string
  status: string
  startDate: string
  endDate: string
  location: string
  isPublished: boolean
  _count?: {
    registrations: number
  }
  events?: Array<{
    id: string
    name: string
    entryFee: number
  }>
}

interface CompetitionCardProps {
  competition: Competition
  showActions?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function CompetitionCard({ 
  competition, 
  showActions = false,
  onEdit,
  onDelete 
}: CompetitionCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'published': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(competition.id)
    }
  }

  const handleDelete = async () => {
    if (onDelete) {
      setIsLoading(true)
      await onDelete(competition.id)
      setIsLoading(false)
    }
  }

  const totalRevenue = competition.events?.reduce((sum, event) => {
    return sum + (event.entryFee * (competition._count?.registrations || 0))
  }, 0) || 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {competition.name}
          </CardTitle>
          <Badge className={getStatusColor(competition.status)}>
            {competition.status}
          </Badge>
        </div>
        {competition.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {competition.description}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-2 h-4 w-4" />
            {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            {competition.location}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            {competition._count?.registrations || 0} registrations
          </div>
          
          {totalRevenue > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="mr-2 h-4 w-4" />
              ${totalRevenue.toLocaleString()} revenue
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Link href={`/dashboard/competitions/${competition.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        
        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              disabled={isLoading}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}