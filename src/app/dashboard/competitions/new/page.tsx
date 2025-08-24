'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar,
  MapPin,
  Trophy,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

// Mock user data
const mockUser = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  role: 'ORGANIZER' as const
}

// Form validation schemas for each step
const basicInfoSchema = z.object({
  name: z.string().min(1, 'Competition name is required').max(100, 'Name too long'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  venue: z.string().min(1, 'Venue is required'),
  address: z.string().optional(),
})

const settingsSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  entryFee: z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0)),
  maxEntries: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
})

// Form input types (before transformation)
const settingsFormSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  entryFee: z.string(),
  maxEntries: z.string().optional(),
})

type BasicInfoData = z.infer<typeof basicInfoSchema>
type SettingsData = z.infer<typeof settingsSchema>
type SettingsFormData = z.infer<typeof settingsFormSchema>

type CompetitionData = BasicInfoData & SettingsData & {
  organizerId: string
}

const steps = [
  { id: 1, name: 'Basic Information', description: 'Competition details and dates' },
  { id: 2, name: 'Settings', description: 'Entry fees and limits' },
  { id: 3, name: 'Review', description: 'Review and create' },
]

export default function NewCompetitionPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [competitionData, setCompetitionData] = useState<Partial<CompetitionData>>({})

  // Form for step 1 - Basic Information
  const basicInfoForm = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      venue: '',
      address: '',
    }
  })

  // Form for step 2 - Settings
  const settingsForm = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      status: 'DRAFT',
      entryFee: '0',
      maxEntries: '',
    }
  })

  const handleStep1Submit = (data: BasicInfoData) => {
    // Validate dates
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      basicInfoForm.setError('endDate', {
        message: 'End date must be after start date'
      })
      return
    }

    setCompetitionData(prev => ({ ...prev, ...data }))
    setCurrentStep(2)
  }

  const handleStep2Submit = (data: SettingsFormData) => {
    // Transform form data to the proper types
    const transformedData: SettingsData = {
      status: data.status,
      entryFee: parseFloat(data.entryFee),
      maxEntries: data.maxEntries ? parseInt(data.maxEntries) : undefined,
    }
    setCompetitionData(prev => ({ ...prev, ...transformedData }))
    setCurrentStep(3)
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const finalData: CompetitionData = {
        ...competitionData as BasicInfoData & SettingsData,
        organizerId: mockUser.id
      }

      console.log('Creating competition:', finalData)
      
      // Make real API call to create competition
      const response = await fetch('/api/competitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      })

      if (!response.ok) {
        throw new Error('Failed to create competition')
      }

      const createdCompetition = await response.json()
      console.log('Competition created:', createdCompetition)

      // Navigate to competitions page
      router.push('/dashboard/competitions')
    } catch (error) {
      console.error('Error creating competition:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={basicInfoForm.handleSubmit(handleStep1Submit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Competition Name *</Label>
                <Input
                  id="name"
                  {...basicInfoForm.register('name')}
                  placeholder="e.g., Spring Championships 2025"
                />
                {basicInfoForm.formState.errors.name && (
                  <p className="text-sm text-red-600">
                    {basicInfoForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...basicInfoForm.register('description')}
                  placeholder="Brief description of the competition..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...basicInfoForm.register('startDate')}
                  />
                  {basicInfoForm.formState.errors.startDate && (
                    <p className="text-sm text-red-600">
                      {basicInfoForm.formState.errors.startDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...basicInfoForm.register('endDate')}
                  />
                  {basicInfoForm.formState.errors.endDate && (
                    <p className="text-sm text-red-600">
                      {basicInfoForm.formState.errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue *</Label>
                <Input
                  id="venue"
                  {...basicInfoForm.register('venue')}
                  placeholder="e.g., Ice Arena Downtown"
                />
                {basicInfoForm.formState.errors.venue && (
                  <p className="text-sm text-red-600">
                    {basicInfoForm.formState.errors.venue.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  {...basicInfoForm.register('address')}
                  placeholder="e.g., 123 Main St, Chicago, IL 60601"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        )

      case 2:
        return (
          <form onSubmit={settingsForm.handleSubmit(handleStep2Submit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Competition Status</Label>
                <Select
                  value={settingsForm.watch('status')}
                  onValueChange={(value: 'DRAFT' | 'PUBLISHED') => settingsForm.setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft - Not visible to public</SelectItem>
                    <SelectItem value="PUBLISHED">Published - Open for registration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryFee">Base Entry Fee ($)</Label>
                <Input
                  id="entryFee"
                  type="number"
                  min="0"
                  step="0.01"
                  {...settingsForm.register('entryFee')}
                  placeholder="0.00"
                />
                <p className="text-sm text-muted-foreground">
                  This is the base fee - individual events can have different fees
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxEntries">Maximum Entries (Optional)</Label>
                <Input
                  id="maxEntries"
                  type="number"
                  min="1"
                  {...settingsForm.register('maxEntries')}
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You can add specific events and customize settings after creating the competition.
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Your Competition</h3>
              
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Trophy className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">{competitionData.name}</h4>
                      {competitionData.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {competitionData.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {formatDate(competitionData.startDate!)} - {formatDate(competitionData.endDate!)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{competitionData.venue}</p>
                      {competitionData.address && (
                        <p className="text-sm text-muted-foreground">{competitionData.address}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <Badge variant={competitionData.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                        {competitionData.status}
                      </Badge>
                      <span className="text-sm">
                        Base Fee: ${Number(competitionData.entryFee || 0).toFixed(2)}
                      </span>
                    </div>
                    {competitionData.maxEntries && (
                      <span className="text-sm text-muted-foreground">
                        Max Entries: {competitionData.maxEntries}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Create Competition
                  </>
                )}
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <DashboardLayout user={mockUser}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Competition</h1>
            <p className="text-muted-foreground">
              Set up a new figure skating competition in just a few steps
            </p>
          </div>

          {/* Progress Steps */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                          ${currentStep >= step.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                          }`}
                      >
                        {currentStep > step.id ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${
                          currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {step.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-4 ${
                        currentStep > step.id ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].name}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}