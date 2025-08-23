'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

const registrationSchema = z.object({
  eventId: z.string().min(1, 'Event is required'),
  skaterId: z.string().min(1, 'Skater is required'),
  competitionId: z.string().min(1, 'Competition is required'),
  notes: z.string().optional(),
})

type RegistrationFormData = z.infer<typeof registrationSchema>

interface Event {
  id: string
  name: string
  entryFee: number
  maxEntries?: number
  _count?: { registrations: number }
}

interface Skater {
  id: string
  name: string
  email: string
}

interface Coach {
  id: string
  name: string
  email: string
}

interface Club {
  id: string
  name: string
}

interface RegistrationFormProps {
  event: Event
  competitionId: string
  skaters: Skater[]
  onSubmit: (data: RegistrationFormData) => Promise<void>
  onCancel?: () => void
}

export function RegistrationForm({
  event,
  competitionId,
  skaters,
  onSubmit,
  onCancel
}: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      eventId: event.id,
      competitionId: competitionId
    }
  })

  const watchedSkaterId = watch('skaterId')

  const calculateTotal = () => {
    return event.entryFee
  }

  const onFormSubmit = async (data: RegistrationFormData) => {
    try {
      setIsLoading(true)
      await onSubmit(data)
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isEventFull = event.maxEntries && 
    (event._count?.registrations || 0) >= event.maxEntries

  if (isEventFull) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              This event is currently full. Please check back later or contact the organizer.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register for {event.name}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <CardContent className="space-y-4">
          {/* Skater Selection */}
          <div className="space-y-2">
            <Label htmlFor="skaterId">Skater *</Label>
            <Select
              value={watchedSkaterId}
              onValueChange={(value) => setValue('skaterId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a skater" />
              </SelectTrigger>
              <SelectContent>
                {skaters.map((skater) => (
                  <SelectItem key={skater.id} value={skater.id}>
                    {skater.name} ({skater.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.skaterId && (
              <p className="text-sm text-red-600">{errors.skaterId.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              {...register('notes')}
              placeholder="Any special requirements or notes..."
              rows={3}
            />
          </div>

          {/* Total Cost */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Cost:</span>
              <span className="text-lg font-bold">${calculateTotal()}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Entry fee: ${event.entryFee}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register & Pay ${calculateTotal()}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}