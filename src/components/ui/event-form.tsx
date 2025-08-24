'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Plus } from 'lucide-react'

const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(100, 'Name too long'),
  category: z.string().min(1, 'Category is required'),
  ageGroup: z.string().optional(),
  level: z.string().optional(),
  entryFee: z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0)),
  maxEntries: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
  description: z.string().optional(),
  requirements: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

// Form input schema (before transformation)
const eventFormSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(100, 'Name too long'),
  category: z.string().min(1, 'Category is required'),
  ageGroup: z.string().optional(),
  level: z.string().optional(),
  entryFee: z.string(),
  maxEntries: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

type EventData = z.infer<typeof eventSchema>
type EventFormData = z.infer<typeof eventFormSchema>

interface EventFormProps {
  competitionId: string
  onEventCreated: (event: any) => void
}

const categories = [
  'Freestyle',
  'Moves in the Field', 
  'Dance',
  'Synchronized',
  'Pairs',
  'Showcase',
  'Dramatic',
  'Other'
]

const levels = [
  'Pre-Alpha',
  'Alpha', 
  'Beta',
  'Gamma',
  'Delta',
  'Freestyle 1',
  'Freestyle 2', 
  'Freestyle 3',
  'Freestyle 4',
  'Freestyle 5',
  'Freestyle 6',
  'Pre-Preliminary',
  'Preliminary',
  'Pre-Juvenile',
  'Juvenile',
  'Intermediate',
  'Novice',
  'Junior',
  'Senior'
]

const ageGroups = [
  'Tot (4 and under)',
  'Pre-Alpha (4-5)',
  'Alpha (6-7)', 
  'Beta (8-9)',
  'Gamma (10-11)',
  'Delta (12-13)',
  'Adult Bronze (18+)',
  'Adult Silver (18+)',
  'Adult Gold (18+)',
  'Adult Championship (18+)',
  'Masters (50+)',
  'Open'
]

export function EventForm({ competitionId, onEventCreated }: EventFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      category: '',
      ageGroup: '',
      level: '',
      entryFee: '0',
      maxEntries: '',
      description: '',
      requirements: '',
      startTime: '',
      endTime: '',
    }
  })

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)
    
    try {
      // Transform form data to proper types
      const transformedData: EventData = {
        name: data.name,
        category: data.category,
        ageGroup: data.ageGroup,
        level: data.level,
        entryFee: parseFloat(data.entryFee),
        maxEntries: data.maxEntries ? parseInt(data.maxEntries) : undefined,
        description: data.description,
        requirements: data.requirements,
        startTime: data.startTime,
        endTime: data.endTime,
      }

      const eventData = {
        ...transformedData,
        competitionId
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      const createdEvent = await response.json()
      onEventCreated(createdEvent)
      
      // Reset form and close dialog
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error('Error creating event:', error)
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Event Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="e.g., Juvenile Girls Freestyle"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Category and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.watch('category')}
                  onValueChange={(value) => form.setValue('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={form.watch('level') || ''}
                  onValueChange={(value) => form.setValue('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Age Group */}
            <div className="space-y-2">
              <Label htmlFor="ageGroup">Age Group</Label>
              <Select
                value={form.watch('ageGroup') || ''}
                onValueChange={(value) => form.setValue('ageGroup', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select age group (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((ageGroup) => (
                    <SelectItem key={ageGroup} value={ageGroup}>
                      {ageGroup}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Entry Fee and Max Entries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryFee">Entry Fee ($) *</Label>
                <Input
                  id="entryFee"
                  type="number"
                  min="0"
                  step="0.01"
                  {...form.register('entryFee')}
                  placeholder="0.00"
                />
                {form.formState.errors.entryFee && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.entryFee.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxEntries">Maximum Entries</Label>
                <Input
                  id="maxEntries"
                  type="number"
                  min="1"
                  {...form.register('maxEntries')}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Brief description of the event..."
                rows={3}
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                {...form.register('requirements')}
                placeholder="Prerequisites or special requirements..."
                rows={2}
              />
            </div>

            {/* Time Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  {...form.register('startTime')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  {...form.register('endTime')}
                />
              </div>
            </div>

            <Alert>
              <AlertDescription>
                You can always edit these details later from the event management page.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Event...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}