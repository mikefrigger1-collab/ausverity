'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Languages as LanguagesIcon } from 'lucide-react'

export interface Language {
  id?: string
  languageName: string
  proficiencyLevel: string
}

interface LanguagesSectionProps {
  value: Language[]
  onChange: (languages: Language[]) => void
}

const PROFICIENCY_LEVELS = [
  { value: 'Native', label: 'Native / Bilingual' },
  { value: 'Fluent', label: 'Fluent' },
  { value: 'Professional', label: 'Professional Working' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Basic', label: 'Basic' }
]

const COMMON_LANGUAGES = [
  'English',
  'Mandarin',
  'Cantonese',
  'Arabic',
  'Vietnamese',
  'Italian',
  'Greek',
  'Hindi',
  'Punjabi',
  'Spanish',
  'Tagalog',
  'German',
  'Korean',
  'French',
  'Tamil',
  'Other'
]

export function LanguagesSection({
  value,
  onChange
}: LanguagesSectionProps) {
  const handleAddAnother = () => {
    const newLanguage: Language = {
      id: `temp-${Date.now()}`,
      languageName: '',
      proficiencyLevel: ''
    }
    onChange([...value, newLanguage])
  }

  const handleRemoveLanguage = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleUpdateLanguage = (index: number, field: keyof Language, fieldValue: any) => {
    const updated = value.map((lang, i) =>
      i === index ? { ...lang, [field]: fieldValue } : lang
    )

    // Auto-add new row if the last row is being filled (when selecting a language or proficiency)
    if (fieldValue && index === value.length - 1) {
      const currentLang = updated[index]
      // Add new row if both fields are filled
      if (currentLang.languageName && currentLang.proficiencyLevel) {
        updated.push({
          id: `temp-${Date.now()}`,
          languageName: '',
          proficiencyLevel: ''
        })
      }
    }

    onChange(updated)
  }

  // Start with at least one entry
  useEffect(() => {
    if (value.length === 0) {
      onChange([{
        id: `temp-${Date.now()}`,
        languageName: '',
        proficiencyLevel: ''
      }])
    }
  }, [value.length, onChange])

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-3 mb-4 text-xl md:text-2xl">
          <LanguagesIcon className="w-6 h-6 text-blue-600" />
          Languages Spoken
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Language Entries */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {value.map((lang, index) => (
            <div key={lang.id || index} className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`lang-name-${index}`} className="text-xs mb-2 ml-2">Language *</Label>
                    <Select
                      value={lang.languageName}
                      onValueChange={(value) => handleUpdateLanguage(index, 'languageName', value)}
                    >
                      <SelectTrigger id={`lang-name-${index}`}>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_LANGUAGES.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`lang-prof-${index}`} className="text-xs mb-2 ml-2">Proficiency Level *</Label>
                    <Select
                      value={lang.proficiencyLevel}
                      onValueChange={(value) => handleUpdateLanguage(index, 'proficiencyLevel', value)}
                    >
                      <SelectTrigger id={`lang-prof-${index}`}>
                        <SelectValue placeholder="Select proficiency" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROFICIENCY_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {value.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLanguage(index)}
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
          Add Another Language
        </Button>
      </CardContent>
    </Card>
  )
}