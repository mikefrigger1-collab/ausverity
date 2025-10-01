'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X, Gavel } from 'lucide-react'

export interface CourtAppearance {
  id?: string
  courtName: string
  jurisdiction: string
  appearanceCount: string
}

interface CourtAppearancesSectionProps {
  value: CourtAppearance[]
  onChange: (appearances: CourtAppearance[]) => void
}

const COURT_TYPES = [
  'Supreme Court',
  'District Court',
  'County Court',
  'Magistrates Court',
  'Local Court',
  'Federal Court',
  'Family Court',
  'High Court',
  'Tribunal',
  'Other'
]

const AUSTRALIAN_STATES = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'ACT',
  'NT',
  'Federal'
]

export function CourtAppearancesSection({
  value,
  onChange
}: CourtAppearancesSectionProps) {
  const handleAddAnother = () => {
    const newAppearance: CourtAppearance = {
      id: `temp-${Date.now()}`,
      courtName: '',
      jurisdiction: '',
      appearanceCount: ''
    }
    onChange([...value, newAppearance])
  }

  const handleRemoveAppearance = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleUpdateAppearance = (index: number, field: keyof CourtAppearance, fieldValue: any) => {
    onChange(value.map((app, i) =>
      i === index ? { ...app, [field]: fieldValue } : app
    ))
  }

  // Start with at least one entry
  if (value.length === 0) {
    onChange([{
      id: `temp-${Date.now()}`,
      courtName: '',
      jurisdiction: '',
      appearanceCount: ''
    }])
  }

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-3 mb-4 text-xl md:text-2xl">
          <Gavel className="w-6 h-6 text-blue-600" />
          Court Appearances
        </CardTitle>
        <CardDescription>
          Add the types of courts you practice in
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Court Appearance Entries */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {value.map((app, index) => (
            <div key={app.id || index} className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor={`court-${index}`} className="text-xs mb-2 ml-2">Type of Court *</Label>
                    <Select
                      value={app.courtName}
                      onValueChange={(value) => handleUpdateAppearance(index, 'courtName', value)}
                    >
                      <SelectTrigger id={`court-${index}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {COURT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`jurisdiction-${index}`} className="text-xs mb-2 ml-2">State *</Label>
                    <Select
                      value={app.jurisdiction}
                      onValueChange={(value) => handleUpdateAppearance(index, 'jurisdiction', value)}
                    >
                      <SelectTrigger id={`jurisdiction-${index}`}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {AUSTRALIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`count-${index}`} className="text-xs mb-2 ml-2">Appearances</Label>
                    <Input
                      id={`count-${index}`}
                      value={app.appearanceCount}
                      onChange={(e) => handleUpdateAppearance(index, 'appearanceCount', e.target.value)}
                      placeholder="e.g., 50+, 100+, Frequent"
                    />
                  </div>
                </div>
                {value.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAppearance(index)}
                    className="mt-5 text-red-500 hover:text-red-700 hover:bg-red-50"
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
          Add Another Court Appearance
        </Button>
      </CardContent>
    </Card>
  )
}