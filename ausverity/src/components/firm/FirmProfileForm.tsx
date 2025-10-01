"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2, Save, Eye, EyeOff, Globe, Linkedin, Twitter, Facebook, Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { ImageUploadCrop } from '../lawyer/ImageUploadCrop'
import { PracticeAreasSection, type PracticeArea } from '../lawyer/PracticeAreasSection'
import { LanguagesSection, type Language } from '../lawyer/LanguagesSection'

// Court appearance type for firm (with string count)
export interface FirmCourtAppearance {
  id?: string
  courtName: string
  jurisdiction: string
  appearanceCount: string
}

interface LawFirm {
  id: string
  name: string
  description: string | null
  website: string | null
  email: string
  phone: string
  displayPhone: boolean
  displayEmail: boolean
  logoUrl: string | null
  galleryImages: any
  operatingHours: any
  locations?: any[]
  practiceAreas?: any[]
  courtAppearances?: any[]
  languages?: any[]
  isPaidUser?: boolean
}

interface Specialisation {
  id: string
  name: string
  category: string
}

interface FirmProfileFormProps {
  firm: LawFirm | null
  specialisations: Specialisation[]
  userId: string
}

export default function FirmProfileForm({
  firm,
  specialisations,
  userId
}: FirmProfileFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)

  // Form state
  const [formData, setFormData] = useState({
    name: firm?.name || '',
    description: firm?.description || '',
    email: firm?.email || '',
    phone: firm?.phone || '',
    displayPhone: firm?.displayPhone || false,
    displayEmail: firm?.displayEmail || false,
    website: firm?.website || '',
    logoUrl: firm?.logoUrl || '',
    galleryImages: (firm?.galleryImages as string[]) || [],
    operatingHours: firm?.operatingHours || {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '', close: '', closed: true },
      sunday: { open: '', close: '', closed: true }
    },
    practiceAreas: firm?.practiceAreas?.map(area => ({
      specialisationId: area.specialisationId,
      specialisationName: area.specialisation.name,
      yearsExperience: undefined,
      description: undefined
    })) || [] as PracticeArea[],
    courtAppearances: firm?.courtAppearances?.map(app => ({
      id: app.id,
      courtName: app.courtName,
      jurisdiction: app.jurisdiction,
      appearanceCount: app.appearanceCount
    })) || [] as FirmCourtAppearance[],
    languages: firm?.languages?.map(lang => ({
      id: lang.id,
      languageName: lang.languageName,
      proficiencyLevel: lang.proficiencyLevel
    })) || [] as Language[]
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddGalleryImage = (url: string) => {
    if (formData.galleryImages.length >= 10) {
      toast.error('Maximum 10 gallery images allowed')
      return
    }
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, url]
    }))
  }

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone) {
        toast.error('Firm name, email, and phone are required')
        setIsSubmitting(false)
        return
      }

      // Filter out empty entries
      const validPracticeAreas = formData.practiceAreas.filter(pa => pa.specialisationId)
      const validCourtAppearances = formData.courtAppearances.filter(ca => ca.courtName && ca.jurisdiction)
      const validLanguages = formData.languages.filter(lang => lang.languageName && lang.proficiencyLevel)

      const response = await fetch('/api/firm/profile', {
        method: firm ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          practiceAreas: validPracticeAreas,
          courtAppearances: validCourtAppearances,
          languages: validLanguages
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      toast.success(
        firm
          ? 'Firm profile updated successfully and submitted for approval'
          : 'Firm profile created successfully and submitted for approval'
      )

      await new Promise(resolve => setTimeout(resolve, 500))
      router.refresh()
      router.push('/firm/profile')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCourtAppearance = () => {
    const newAppearance: FirmCourtAppearance = {
      id: `temp-${Date.now()}`,
      courtName: '',
      jurisdiction: '',
      appearanceCount: ''
    }
    setFormData(prev => ({
      ...prev,
      courtAppearances: [...prev.courtAppearances, newAppearance]
    }))
  }

  const handleRemoveCourtAppearance = (index: number) => {
    setFormData(prev => ({
      ...prev,
      courtAppearances: prev.courtAppearances.filter((_, i) => i !== index)
    }))
  }

  const handleUpdateCourtAppearance = (index: number, field: keyof FirmCourtAppearance, value: any) => {
    setFormData(prev => ({
      ...prev,
      courtAppearances: prev.courtAppearances.map((app, i) =>
        i === index ? { ...app, [field]: value } : app
      )
    }))
  }

  // Auto-save function
  const autoSave = async () => {
    console.log('[AUTO-SAVE] Starting auto-save at', new Date().toISOString())
    setIsSaving(true)

    try {
      // Filter out empty entries
      const validPracticeAreas = formData.practiceAreas.filter(pa => pa.specialisationId)
      const validCourtAppearances = formData.courtAppearances.filter(ca => ca.courtName && ca.jurisdiction)
      const validLanguages = formData.languages.filter(lang => lang.languageName && lang.proficiencyLevel)

      console.log('[AUTO-SAVE] Saving data:', {
        name: formData.name,
        practiceAreasCount: validPracticeAreas.length,
        courtAppearancesCount: validCourtAppearances.length,
        languagesCount: validLanguages.length
      })

      const response = await fetch('/api/firm/profile', {
        method: firm ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          practiceAreas: validPracticeAreas,
          courtAppearances: validCourtAppearances,
          languages: validLanguages
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('[AUTO-SAVE] Failed:', data.error)
        throw new Error(data.error || 'Failed to auto-save')
      }

      console.log('[AUTO-SAVE] Success:', data)
      setLastSaved(new Date())
    } catch (error) {
      console.error('[AUTO-SAVE] Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Debounced auto-save effect
  useEffect(() => {
    // Skip auto-save on initial load
    if (initialLoadRef.current) {
      initialLoadRef.current = false
      console.log('[AUTO-SAVE] Skipping initial load')
      return
    }

    // Only auto-save if we have required fields
    if (!formData.name || !formData.email || !formData.phone) {
      console.log('[AUTO-SAVE] Skipping - missing required fields')
      return
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout for 2 seconds after last change
    console.log('[AUTO-SAVE] Setting timeout for 2 seconds')
    saveTimeoutRef.current = setTimeout(() => {
      autoSave()
    }, 2000)

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [formData])

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-24">
      {/* Basic Information */}
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl mb-4">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div>
            <ImageUploadCrop
              currentImageUrl={formData.logoUrl}
              onImageUploaded={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
            />
          </div>

          <div>
            <Label htmlFor="name" className="mb-2 ml-2">
              Firm Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Smith & Associates Legal"
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2 ml-2">Firm Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              placeholder="Write a compelling description of your firm, including its history, areas of expertise, values, and what sets you apart from other firms..."
              className="resize-none"
            />
            <p className="text-xs text-slate-500 mt-2">
              {formData.description.length} characters
            </p>
          </div>

          <div>
            <Label htmlFor="website" className="mb-2 ml-2">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.smithlaw.com.au"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl mb-4">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="email" className="mb-2 ml-2">
              Contact Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="contact@smithlaw.com.au"
            />
            <div className="flex items-center justify-between mt-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                {formData.displayEmail ? (
                  <Eye className="h-4 w-4 text-blue-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                )}
                <span className="text-sm font-medium text-slate-700">
                  {formData.displayEmail ? 'Visible on profile (tap to reveal)' : 'Hidden from profile'}
                </span>
              </div>
              <Switch
                checked={formData.displayEmail}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, displayEmail: checked }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="mb-2 ml-2">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+61 2 9999 9999"
            />
            <div className="flex items-center justify-between mt-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                {formData.displayPhone ? (
                  <Eye className="h-4 w-4 text-blue-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                )}
                <span className="text-sm font-medium text-slate-700">
                  {formData.displayPhone ? 'Visible on profile (tap to reveal)' : 'Hidden from profile'}
                </span>
              </div>
              <Switch
                checked={formData.displayPhone}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, displayPhone: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Images */}
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-600" />
            Gallery Images
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Add up to 10 images showcasing your firm, office, and team (optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {formData.galleryImages.map((imageUrl, index) => (
              <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={imageUrl}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {formData.galleryImages.length < 10 && (
            <ImageUploadCrop
              currentImageUrl=""
              onImageUploaded={handleAddGalleryImage}
            />
          )}

          <p className="text-xs text-slate-500">
            {formData.galleryImages.length} of 10 images added
          </p>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl mb-4">Operating Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(formData.operatingHours).map(([day, hours]: [string, any]) => (
            <div key={day} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-medium capitalize w-28">{day}</span>
                <Switch
                  checked={!hours.closed}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      operatingHours: {
                        ...prev.operatingHours,
                        [day]: { ...hours, closed: !checked }
                      }
                    }))
                  }}
                />
              </div>
              {!hours.closed && (
                <div className="flex items-center gap-3">
                  <Input
                    type="time"
                    value={hours.open}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          [day]: { ...hours, open: e.target.value }
                        }
                      }))
                    }}
                    className="w-32"
                  />
                  <span className="text-slate-600">to</span>
                  <Input
                    type="time"
                    value={hours.close}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          [day]: { ...hours, close: e.target.value }
                        }
                      }))
                    }}
                    className="w-32"
                  />
                </div>
              )}
              {hours.closed && (
                <span className="text-slate-500 italic">Closed</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Practice Areas */}
      <PracticeAreasSection
        value={formData.practiceAreas}
        onChange={(areas) => setFormData(prev => ({ ...prev, practiceAreas: areas }))}
        availableSpecialisations={specialisations}
      />

      {/* Court Appearances */}
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl mb-4">Court Appearances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.courtAppearances.map((appearance, index) => (
            <div key={appearance.id || index} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor={`court-${index}`} className="text-xs mb-2 ml-2">Court Name</Label>
                    <Input
                      id={`court-${index}`}
                      value={appearance.courtName}
                      onChange={(e) => handleUpdateCourtAppearance(index, 'courtName', e.target.value)}
                      placeholder="e.g., NSW Supreme Court"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`jurisdiction-${index}`} className="text-xs mb-2 ml-2">Jurisdiction</Label>
                    <Input
                      id={`jurisdiction-${index}`}
                      value={appearance.jurisdiction}
                      onChange={(e) => handleUpdateCourtAppearance(index, 'jurisdiction', e.target.value)}
                      placeholder="e.g., New South Wales"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`count-${index}`} className="text-xs mb-2 ml-2">Appearances</Label>
                    <Input
                      id={`count-${index}`}
                      value={appearance.appearanceCount}
                      onChange={(e) => handleUpdateCourtAppearance(index, 'appearanceCount', e.target.value)}
                      placeholder="e.g., 50+ cases"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCourtAppearance(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAddCourtAppearance}>
            + Add Court Appearance
          </Button>
        </CardContent>
      </Card>

      {/* Languages */}
      <LanguagesSection
        value={formData.languages}
        onChange={(langs) => setFormData(prev => ({ ...prev, languages: langs }))}
      />

      {/* Info About Additional Fields */}
      <Card className="border-blue-200 bg-blue-50 shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl text-blue-900">Additional Profile Sections</CardTitle>
          <CardDescription className="text-sm text-blue-700">
            After saving your profile, you'll also be able to:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
            <li>Manage office locations (multiple addresses with Google Maps links)</li>
            <li>Invite and manage team members (lawyers)</li>
            <li>View and respond to client reviews</li>
          </ul>
        </CardContent>
      </Card>

      {/* Sticky Submit Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Auto-save status */}
          <div className="flex justify-center items-center gap-2 text-sm mb-3">
            {isSaving && (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-slate-600">Saving changes...</span>
              </>
            )}
            {!isSaving && lastSaved && (
              <>
                <span className="text-green-600">✓</span>
                <span className="text-slate-600">
                  Last saved at {lastSaved.toLocaleTimeString()}
                </span>
              </>
            )}
          </div>

          <div className="flex justify-between items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="text-sm md:text-base"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-sm md:text-base">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting for Approval...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Submit for Approval
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}