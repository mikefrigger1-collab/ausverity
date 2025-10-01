'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Plus, X, Award } from 'lucide-react'

export interface Certification {
  id?: string
  name: string
  issuingBody: string
  dateEarned: string
  expiryDate?: string
}

interface CertificationsSectionProps {
  value: Certification[]
  onChange: (certifications: Certification[]) => void
}

export function CertificationsSection({
  value,
  onChange
}: CertificationsSectionProps) {
  const handleAddAnother = () => {
    const newCertification: Certification = {
      id: `temp-${Date.now()}`,
      name: '',
      issuingBody: '',
      dateEarned: '',
      expiryDate: undefined
    }
    onChange([...value, newCertification])
  }

  const handleRemoveCertification = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleUpdateCertification = (index: number, field: keyof Certification, fieldValue: any) => {
    onChange(value.map((cert, i) =>
      i === index ? { ...cert, [field]: fieldValue } : cert
    ))
  }

  // Start with at least one entry
  if (value.length === 0) {
    onChange([{
      id: `temp-${Date.now()}`,
      name: '',
      issuingBody: '',
      dateEarned: '',
      expiryDate: undefined
    }])
  }

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-3 text-xl md:text-2xl mb-4">
          <Award className="w-6 h-6 text-blue-600" />
          Certifications & Professional Memberships
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Certification Entries */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {value.map((cert, index) => (
            <div key={cert.id || index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`cert-name-${index}`} className="text-xs mb-2 ml-2">Certification Name *</Label>
                      <Input
                        id={`cert-name-${index}`}
                        value={cert.name}
                        onChange={(e) => handleUpdateCertification(index, 'name', e.target.value)}
                        placeholder="e.g., Accredited Specialist in Family Law"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`cert-issuer-${index}`} className="text-xs mb-2 ml-2">Issuing Body *</Label>
                      <Input
                        id={`cert-issuer-${index}`}
                        value={cert.issuingBody}
                        onChange={(e) => handleUpdateCertification(index, 'issuingBody', e.target.value)}
                        placeholder="e.g., Law Society of NSW"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`cert-date-${index}`} className="text-xs mb-2 ml-2">Date Earned *</Label>
                      <Input
                        id={`cert-date-${index}`}
                        type="date"
                        value={cert.dateEarned}
                        onChange={(e) => handleUpdateCertification(index, 'dateEarned', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`cert-expiry-${index}`} className="text-xs mb-2 ml-2">Expiry Date (Optional)</Label>
                      <Input
                        id={`cert-expiry-${index}`}
                        type="date"
                        value={cert.expiryDate || ''}
                        onChange={(e) => handleUpdateCertification(index, 'expiryDate', e.target.value || undefined)}
                      />
                    </div>
                  </div>
                </div>
                {value.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCertification(index)}
                    className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Another Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddAnother}
          className="w-full md:w-auto text-sm md:text-base"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Certification
        </Button>
      </CardContent>
    </Card>
  )
}