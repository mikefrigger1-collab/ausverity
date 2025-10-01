'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Scale } from 'lucide-react'

export interface PracticeArea {
  specialisationId: string
  specialisationName: string
  yearsExperience?: string
  description?: string
}

interface PracticeAreasSectionProps {
  availableSpecialisations: { id: string; name: string; category: string }[]
  value: PracticeArea[]
  onChange: (areas: PracticeArea[]) => void
}

export function PracticeAreasSection({
  availableSpecialisations,
  value,
  onChange
}: PracticeAreasSectionProps) {
  const handleAddAnother = () => {
    // Add a blank entry
    const newArea: PracticeArea = {
      specialisationId: '',
      specialisationName: '',
      yearsExperience: undefined,
      description: undefined
    }
    onChange([...value, newArea])
  }

  const handleRemoveArea = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleUpdateArea = (index: number, field: keyof PracticeArea, newValue: any) => {
    const updated = value.map((pa, i) => {
      if (i !== index) return pa

      // If updating specialisation, also update the name
      if (field === 'specialisationId') {
        const spec = availableSpecialisations.find(s => s.id === newValue)
        return {
          ...pa,
          specialisationId: newValue,
          specialisationName: spec?.name || ''
        }
      }

      return { ...pa, [field]: newValue }
    })

    // Auto-add new row if the last row is being filled
    if (field === 'specialisationId' && newValue && index === value.length - 1) {
      updated.push({
        specialisationId: '',
        specialisationName: '',
        yearsExperience: undefined,
        description: undefined
      })
    }

    onChange(updated)
  }

  // Start with at least one entry
  useEffect(() => {
    if (value.length === 0) {
      onChange([{
        specialisationId: '',
        specialisationName: '',
        yearsExperience: undefined,
        description: undefined
      }])
    }
  }, [value.length, onChange])

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-3 text-xl md:text-2xl mb-4">
          <Scale className="w-6 h-6 text-blue-600" />
          Practice Areas & Specialisations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Practice Area Entries */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {value.map((area, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`area-spec-${index}`} className="text-xs mb-2 ml-2">Practice Area *</Label>
                      <Select
                        value={area.specialisationId}
                        onValueChange={(val) => handleUpdateArea(index, 'specialisationId', val)}
                      >
                        <SelectTrigger id={`area-spec-${index}`}>
                          <SelectValue placeholder="Select practice area" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSpecialisations.map((spec) => (
                            <SelectItem key={spec.id} value={spec.id}>
                              {spec.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`area-years-${index}`} className="text-xs mb-2 ml-2">Years Experience (Optional)</Label>
                      <Input
                        id={`area-years-${index}`}
                        type="text"
                        value={area.yearsExperience || ''}
                        onChange={(e) => handleUpdateArea(
                          index,
                          'yearsExperience',
                          e.target.value || undefined
                        )}
                        placeholder="e.g., 5+ years, 3-5 years"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`area-desc-${index}`} className="text-xs mb-2 ml-2">Description (Optional)</Label>
                    <Textarea
                      id={`area-desc-${index}`}
                      value={area.description || ''}
                      onChange={(e) => handleUpdateArea(index, 'description', e.target.value)}
                      placeholder="Describe your experience and expertise in this area..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                {value.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveArea(index)}
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
          Add Another Practice Area
        </Button>
      </CardContent>
    </Card>
  )
}