"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Save, Eye, EyeOff, Globe, Linkedin, Twitter, Facebook } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { ImageUploadCrop } from './ImageUploadCrop'
import { PracticeAreasSection, type PracticeArea } from './PracticeAreasSection'
import { CourtAppearancesSection, type CourtAppearance } from './CourtAppearancesSection'
import { LanguagesSection, type Language } from './LanguagesSection'
import { CertificationsSection, type Certification } from './CertificationsSection'

interface Lawyer {
  id: string
  firstName: string
  lastName: string
  bio: string | null
  photoUrl: string | null
  position: string | null
  yearsExperience: string | null
  phone: string | null
  email: string | null
  displayPhone: boolean
  displayEmail: boolean
  address: string | null
  city: string | null
  state: string | null
  postcode: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  linkedinUrl: string | null
  twitterUrl: string | null
  facebookUrl: string | null
  websiteUrl: string | null
  operatingHours: any
  user?: {
    email: string
  }
  specialisations?: Array<{
    id: string
    specialisationId: string
    yearsExperience: string | null
    description: string | null
    specialisation: {
      id: string
      name: string
    }
  }>
  courtAppearances?: Array<{
    id: string
    courtName: string
    jurisdiction: string
    appearanceCount: string
  }>
  languages?: Array<{
    id: string
    languageName: string
    proficiencyLevel: string
  }>
  certifications?: Array<{
    id: string
    name: string
    issuingBody: string
    dateEarned: Date
    expiryDate: Date | null
  }>
}

interface Specialisation {
  id: string
  name: string
  category: string
}

interface LawyerProfileFormProps {
  lawyer: Lawyer | null
  specialisations: Specialisation[]
  userId: string
}

export default function LawyerProfileForm({
  lawyer,
  specialisations,
  userId
}: LawyerProfileFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state - all fields including arrays
  const [formData, setFormData] = useState({
    firstName: lawyer?.firstName || '',
    lastName: lawyer?.lastName || '',
    position: lawyer?.position || '',
    yearsExperience: lawyer?.yearsExperience || '',
    bio: lawyer?.bio || '',
    photoUrl: lawyer?.photoUrl || '',
    phone: lawyer?.phone || '',
    email: lawyer?.email || lawyer?.user?.email || '',
    displayPhone: lawyer?.displayPhone || false,
    displayEmail: lawyer?.displayEmail || false,
    address: lawyer?.address || '',
    city: lawyer?.city || '',
    state: lawyer?.state || '',
    postcode: lawyer?.postcode || '',
    country: lawyer?.country || 'Australia',
    linkedinUrl: lawyer?.linkedinUrl || '',
    twitterUrl: lawyer?.twitterUrl || '',
    facebookUrl: lawyer?.facebookUrl || '',
    websiteUrl: lawyer?.websiteUrl || '',
    operatingHours: lawyer?.operatingHours || {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '', close: '', closed: true },
      sunday: { open: '', close: '', closed: true }
    },
    practiceAreas: lawyer?.specialisations?.map(spec => ({
      specialisationId: spec.specialisationId,
      specialisationName: spec.specialisation.name,
      yearsExperience: spec.yearsExperience || undefined,
      description: spec.description || undefined
    })) || [] as PracticeArea[],
    courtAppearances: lawyer?.courtAppearances?.map(app => ({
      id: app.id,
      courtName: app.courtName,
      jurisdiction: app.jurisdiction,
      appearanceCount: app.appearanceCount
    })) || [] as CourtAppearance[],
    languages: lawyer?.languages?.map(lang => ({
      id: lang.id,
      languageName: lang.languageName,
      proficiencyLevel: lang.proficiencyLevel
    })) || [] as Language[],
    certifications: lawyer?.certifications?.map(cert => ({
      id: cert.id,
      name: cert.name,
      issuingBody: cert.issuingBody,
      dateEarned: new Date(cert.dateEarned).toISOString().split('T')[0],
      expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : undefined
    })) || [] as Certification[]
  })

  // Debug: log what we received
  console.log('Lawyer data received:', {
    lawyer: lawyer ? 'exists' : 'null',
    specialisations: lawyer?.specialisations?.length || 0,
    courtAppearances: lawyer?.courtAppearances?.length || 0,
    languages: lawyer?.languages?.length || 0,
    certifications: lawyer?.certifications?.length || 0,
    formDataPracticeAreas: formData.practiceAreas.length,
    formDataCourtAppearances: formData.courtAppearances.length,
    formDataLanguages: formData.languages.length,
    formDataCertifications: formData.certifications.length
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName) {
        toast.error('First name and last name are required')
        setIsSubmitting(false)
        return
      }

      // Filter out empty entries before submitting
      const validPracticeAreas = formData.practiceAreas.filter(pa => pa.specialisationId)
      const validCourtAppearances = formData.courtAppearances.filter(ca => ca.courtName && ca.jurisdiction)
      const validLanguages = formData.languages.filter(lang => lang.languageName && lang.proficiencyLevel)
      const validCertifications = formData.certifications.filter(cert => cert.name && cert.issuingBody && cert.dateEarned)

      // Check if profile exists to determine correct HTTP method
      const profileCheckResponse = await fetch('/api/lawyer/profile-id')
      const profileCheck = await profileCheckResponse.json()
      const profileExists = profileCheck.profileId !== null

      const response = await fetch('/api/lawyer/profile', {
        method: profileExists ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          position: formData.position,
          bio: formData.bio,
          photoUrl: formData.photoUrl,
          yearsExperience: formData.yearsExperience || null,
          phone: formData.phone,
          email: formData.email,
          displayPhone: formData.displayPhone,
          displayEmail: formData.displayEmail,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          country: formData.country,
          linkedinUrl: formData.linkedinUrl,
          twitterUrl: formData.twitterUrl,
          facebookUrl: formData.facebookUrl,
          websiteUrl: formData.websiteUrl,
          operatingHours: formData.operatingHours,
          practiceAreas: validPracticeAreas,
          courtAppearances: validCourtAppearances,
          languages: validLanguages,
          certifications: validCertifications
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      toast.success(
        lawyer
          ? 'Profile updated successfully and submitted for approval'
          : 'Profile created successfully and submitted for approval'
      )

      // Wait a moment for database to commit, then refresh
      await new Promise(resolve => setTimeout(resolve, 500))
      router.refresh()
      router.push('/lawyer/profile')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-24">
      {/* Basic Information */}
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl mb-4">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUploadCrop
            currentImageUrl={formData.photoUrl}
            onImageUploaded={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="mb-2 ml-2">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="mb-2 ml-2">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Smith"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="position" className="mb-2 ml-2">Position / Title</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Senior Associate, Partner, Solicitor, etc."
            />
          </div>

          <div>
            <Label htmlFor="yearsExperience" className="mb-2 ml-2">Years of Experience</Label>
            <Input
              id="yearsExperience"
              name="yearsExperience"
              type="text"
              value={formData.yearsExperience}
              onChange={handleChange}
              placeholder="e.g., 10+ years, 5-10 years"
            />
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-2 ml-2">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
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
                <Label htmlFor="phone" className="mb-2 ml-2">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+61 400 000 000"
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
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Office Address</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="mb-2 ml-2">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city" className="mb-2 ml-2">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Sydney"
                  />
                </div>

                <div>
                  <Label htmlFor="state" className="mb-2 ml-2">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NSW"
                  />
                </div>

                <div>
                  <Label htmlFor="postcode" className="mb-2 ml-2">Postcode</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    placeholder="2000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country" className="mb-2 ml-2">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Australia"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl mb-4">Social Media & Online Presence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedinUrl" className="mb-2 ml-2 flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-blue-700" />
                LinkedIn Profile
              </Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <Label htmlFor="twitterUrl" className="mb-2 ml-2 flex items-center gap-2">
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter Profile
              </Label>
              <Input
                id="twitterUrl"
                name="twitterUrl"
                value={formData.twitterUrl}
                onChange={handleChange}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            <div>
              <Label htmlFor="facebookUrl" className="mb-2 ml-2 flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook Profile
              </Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/yourprofile"
              />
            </div>

            <div>
              <Label htmlFor="websiteUrl" className="mb-2 ml-2 flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-600" />
                Personal Website
              </Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl mb-4">Operating Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <div key={day} className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg">
                <div className="w-28">
                  <span className="font-medium capitalize">{day}</span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Checkbox
                    checked={!formData.operatingHours[day]?.closed}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          [day]: {
                            ...prev.operatingHours[day],
                            closed: !checked
                          }
                        }
                      }))
                    }}
                  />
                  <span className="text-sm">Open</span>
                </div>
                {!formData.operatingHours[day]?.closed && (
                  <>
                    <Input
                      type="time"
                      value={formData.operatingHours[day]?.open || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          operatingHours: {
                            ...prev.operatingHours,
                            [day]: {
                              ...prev.operatingHours[day],
                              open: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-32"
                    />
                    <span className="text-sm text-slate-600">to</span>
                    <Input
                      type="time"
                      value={formData.operatingHours[day]?.close || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          operatingHours: {
                            ...prev.operatingHours,
                            [day]: {
                              ...prev.operatingHours[day],
                              close: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-32"
                    />
                  </>
                )}
                {formData.operatingHours[day]?.closed && (
                  <span className="text-sm text-slate-500 italic">Closed</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Biography */}
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl mb-4">Professional Biography</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={8}
            placeholder="Write a compelling biography that highlights your experience, specialisations, and approach to legal practice..."
            className="resize-none text-sm md:text-base"
          />
          <p className="text-xs md:text-sm text-slate-500 mt-2">
            {formData.bio.length} characters
          </p>
        </CardContent>
      </Card>



      {/* Practice Areas */}
      <div className="shadow-md">
        <PracticeAreasSection
          availableSpecialisations={specialisations}
          value={formData.practiceAreas}
          onChange={(areas) => setFormData(prev => ({ ...prev, practiceAreas: areas }))}
        />
      </div>

      {/* Court Appearances */}
      <div className="shadow-md">
        <CourtAppearancesSection
          value={formData.courtAppearances}
          onChange={(appearances) => setFormData(prev => ({ ...prev, courtAppearances: appearances }))}
        />
      </div>

      {/* Languages */}
      <div className="shadow-md">
        <LanguagesSection
          value={formData.languages}
          onChange={(langs) => setFormData(prev => ({ ...prev, languages: langs }))}
        />
      </div>

      {/* Certifications */}
      <div className="shadow-md">
        <CertificationsSection
          value={formData.certifications}
          onChange={(certs) => setFormData(prev => ({ ...prev, certifications: certs }))}
        />
      </div>

      {/* Sticky Submit Buttons */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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