// src/components/review-submission-form.tsx

"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Star, Loader2, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Rating component
function StarRating({ 
  rating, 
  onRatingChange, 
  label 
}: { 
  rating: number
  onRatingChange: (rating: number) => void
  label: string 
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hover || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <p className="text-sm text-slate-600">{rating} out of 5 stars</p>
      )}
    </div>
  )
}

export function ReviewSubmissionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get pre-filled data from URL params
  const targetType = searchParams.get('type') as 'lawyer' | 'firm' | null
  const targetId = searchParams.get('id')
  const targetName = searchParams.get('name')
  const targetSlug = searchParams.get('slug')

  // Form state
  const [reviewerName, setReviewerName] = useState('')
  const [reviewerEmail, setReviewerEmail] = useState('')
  const [selectedType, setSelectedType] = useState<'lawyer' | 'firm'>(targetType || 'lawyer')
  const [selectedTarget, setSelectedTarget] = useState(targetId || '')
  const [searchQuery, setSearchQuery] = useState(targetName || '')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Ratings
  const [communicationRating, setCommunicationRating] = useState(0)
  const [expertiseRating, setExpertiseRating] = useState(0)
  const [valueRating, setValueRating] = useState(0)
  const [outcomeRating, setOutcomeRating] = useState(0)

  // Additional fields
  const [comment, setComment] = useState('')
  const [caseType, setCaseType] = useState('')
  const [serviceDate, setServiceDate] = useState('')
  
  // Agreement checkboxes
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToVeracity, setAgreedToVeracity] = useState(false)
  
  // Captcha (simple math question for spam prevention)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 })
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Generate captcha on mount
  useEffect(() => {
    generateCaptcha()
  }, [])

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 })
    setCaptchaAnswer('')
  }

  // Search for lawyers/firms
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `/api/search-profiles?type=${selectedType}&query=${encodeURIComponent(query)}`
      )
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && !targetId) {
        handleSearch(searchQuery)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedType])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!reviewerName.trim()) errors.reviewerName = 'Please enter your name'
    if (!reviewerEmail.trim() || !reviewerEmail.includes('@')) errors.reviewerEmail = 'Please enter a valid email'
    if (!selectedTarget) errors.selectedTarget = 'Please select a lawyer or firm to review'
    if (communicationRating === 0) errors.communicationRating = 'Please rate communication'
    if (expertiseRating === 0) errors.expertiseRating = 'Please rate expertise'
    if (valueRating === 0) errors.valueRating = 'Please rate value'
    if (comment.length < 50) errors.comment = 'Please provide a detailed review (at least 50 characters)'
    if (!agreedToTerms) errors.agreedToTerms = 'Please agree to the terms and conditions'
    if (!agreedToVeracity) errors.agreedToVeracity = 'Please confirm your review is truthful'
    if (parseInt(captchaAnswer) !== captchaQuestion.answer) errors.captchaAnswer = 'Please solve the math problem correctly'
    
    setFieldErrors(errors)
    
    // Scroll to first error
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0]
      const element = document.getElementById(firstErrorKey)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }
    
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const overallRating = (communicationRating + expertiseRating + valueRating + (outcomeRating || 0)) / 
                           (outcomeRating > 0 ? 4 : 3)

      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerName,
          reviewerEmail,
          targetType: selectedType,
          targetId: selectedTarget,
          communicationRating,
          expertiseRating,
          valueRating,
          outcomeRating: outcomeRating || null,
          overallRating,
          comment,
          caseType: caseType || null,
          serviceDate: serviceDate || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      setSuccess(true)
      
      // Reset form
      setTimeout(() => {
        router.push('/')
      }, 3000)

    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your review')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Thank You for Your Review!
        </h3>
        <p className="text-slate-600 mb-4">
          Your review has been submitted and will be reviewed by our team before being published.
        </p>
        <p className="text-sm text-slate-500">
          Redirecting to homepage...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Reviewer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Your Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reviewerName">Your Name *</Label>
            <Input
              id="reviewerName"
              type="text"
              value={reviewerName}
              onChange={(e) => {
                setReviewerName(e.target.value)
                if (fieldErrors.reviewerName) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.reviewerName
                    return newErrors
                  })
                }
              }}
              placeholder="John Smith"
              required
              className={fieldErrors.reviewerName ? 'border-red-500' : ''}
            />
            {fieldErrors.reviewerName && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.reviewerName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="reviewerEmail">Your Email *</Label>
            <Input
              id="reviewerEmail"
              type="email"
              value={reviewerEmail}
              onChange={(e) => {
                setReviewerEmail(e.target.value)
                if (fieldErrors.reviewerEmail) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.reviewerEmail
                    return newErrors
                  })
                }
              }}
              placeholder="john@example.com"
              required
              className={fieldErrors.reviewerEmail ? 'border-red-500' : ''}
            />
            {fieldErrors.reviewerEmail && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.reviewerEmail}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Used for verification only, not published
            </p>
          </div>
        </div>
      </div>

      {/* Who are you reviewing? */}
      <div className="space-y-4" id="selectedTarget">
        <h3 className="text-lg font-semibold text-slate-900">Who Are You Reviewing? *</h3>
        
        <div className="flex gap-4">
          <Button
            type="button"
            variant={selectedType === 'lawyer' ? 'default' : 'outline'}
            onClick={() => {
              setSelectedType('lawyer')
              setSelectedTarget('')
              setSearchResults([])
              if (fieldErrors.selectedTarget) {
                setFieldErrors(prev => {
                  const newErrors = { ...prev }
                  delete newErrors.selectedTarget
                  return newErrors
                })
              }
            }}
          >
            Individual Lawyer
          </Button>
          <Button
            type="button"
            variant={selectedType === 'firm' ? 'default' : 'outline'}
            onClick={() => {
              setSelectedType('firm')
              setSelectedTarget('')
              setSearchResults([])
              if (fieldErrors.selectedTarget) {
                setFieldErrors(prev => {
                  const newErrors = { ...prev }
                  delete newErrors.selectedTarget
                  return newErrors
                })
              }
            }}
          >
            Law Firm
          </Button>
        </div>

        {!targetId && (
          <div>
            <Label htmlFor="search">Search for {selectedType === 'lawyer' ? 'Lawyer' : 'Firm'}</Label>
            <Input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Start typing a ${selectedType} name...`}
              className={fieldErrors.selectedTarget ? 'border-red-500' : ''}
            />
            
            {isSearching && (
              <p className="text-sm text-slate-500 mt-2">Searching...</p>
            )}

            {searchResults.length > 0 && (
              <div className="mt-2 border rounded-lg divide-y max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      setSelectedTarget(result.id)
                      setSearchQuery(result.name)
                      setSearchResults([])
                      if (fieldErrors.selectedTarget) {
                        setFieldErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.selectedTarget
                          return newErrors
                        })
                      }
                    }}
                    className="w-full p-3 text-left hover:bg-slate-50 transition-colors"
                  >
                    <p className="font-medium text-slate-900">{result.name}</p>
                    {result.location && (
                      <p className="text-sm text-slate-600">{result.location}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {(selectedTarget || targetId) && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Reviewing: <strong>{searchQuery || targetName}</strong>
            </AlertDescription>
          </Alert>
        )}
        
        {fieldErrors.selectedTarget && (
          <p className="text-sm text-red-600">{fieldErrors.selectedTarget}</p>
        )}
      </div>

      {/* Ratings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Rate Your Experience *</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div id="communicationRating">
            <StarRating
              rating={communicationRating}
              onRatingChange={(rating) => {
                setCommunicationRating(rating)
                if (fieldErrors.communicationRating) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.communicationRating
                    return newErrors
                  })
                }
              }}
              label="Communication & Responsiveness"
            />
            {fieldErrors.communicationRating && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.communicationRating}</p>
            )}
          </div>
          
          <div id="expertiseRating">
            <StarRating
              rating={expertiseRating}
              onRatingChange={(rating) => {
                setExpertiseRating(rating)
                if (fieldErrors.expertiseRating) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.expertiseRating
                    return newErrors
                  })
                }
              }}
              label="Legal Expertise & Knowledge"
            />
            {fieldErrors.expertiseRating && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.expertiseRating}</p>
            )}
          </div>
          
          <div id="valueRating">
            <StarRating
              rating={valueRating}
              onRatingChange={(rating) => {
                setValueRating(rating)
                if (fieldErrors.valueRating) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.valueRating
                    return newErrors
                  })
                }
              }}
              label="Value for Money"
            />
            {fieldErrors.valueRating && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.valueRating}</p>
            )}
          </div>
          
          <StarRating
            rating={outcomeRating}
            onRatingChange={setOutcomeRating}
            label="Case Outcome (Optional)"
          />
        </div>
      </div>

      {/* Written Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Your Review *</h3>
        
        <div id="comment">
          <Label htmlFor="reviewComment">Detailed Review</Label>
          <Textarea
            id="reviewComment"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
              if (fieldErrors.comment) {
                setFieldErrors(prev => {
                  const newErrors = { ...prev }
                  delete newErrors.comment
                  return newErrors
                })
              }
            }}
            placeholder="Please share your experience in detail. What went well? What could have been better? This helps others make informed decisions."
            rows={6}
            required
            className={fieldErrors.comment ? 'border-red-500' : ''}
          />
          <div className="flex justify-between items-center mt-1">
            <p className={`text-xs ${comment.length < 50 ? 'text-red-600' : 'text-slate-500'}`}>
              {comment.length} / 50 characters minimum
            </p>
          </div>
          {fieldErrors.comment && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.comment}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="caseType">Type of Legal Matter (Optional)</Label>
            <Select value={caseType} onValueChange={setCaseType}>
              <SelectTrigger>
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family">Family Law</SelectItem>
                <SelectItem value="criminal">Criminal Law</SelectItem>
                <SelectItem value="property">Property Law</SelectItem>
                <SelectItem value="commercial">Commercial Law</SelectItem>
                <SelectItem value="personal-injury">Personal Injury</SelectItem>
                <SelectItem value="wills-estates">Wills & Estates</SelectItem>
                <SelectItem value="employment">Employment Law</SelectItem>
                <SelectItem value="immigration">Immigration Law</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="serviceDate">Service Date (Optional)</Label>
            <Input
              id="serviceDate"
              type="month"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              max={new Date().toISOString().slice(0, 7)}
            />
          </div>
        </div>
      </div>

      {/* Captcha */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Verification *</h3>
        
        <Card className="p-4 bg-slate-50" id="captchaAnswer">
          <Label htmlFor="captchaInput">
            What is {captchaQuestion.num1} + {captchaQuestion.num2}?
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="captchaInput"
              type="number"
              value={captchaAnswer}
              onChange={(e) => {
                setCaptchaAnswer(e.target.value)
                if (fieldErrors.captchaAnswer) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.captchaAnswer
                    return newErrors
                  })
                }
              }}
              placeholder="Enter answer"
              className={`max-w-32 ${fieldErrors.captchaAnswer ? 'border-red-500' : ''}`}
              required
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateCaptcha}
            >
              New Question
            </Button>
          </div>
          {fieldErrors.captchaAnswer && (
            <p className="text-sm text-red-600 mt-2">{fieldErrors.captchaAnswer}</p>
          )}
        </Card>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Terms & Agreements *</h3>
        
        <div className="space-y-3">
          <div id="agreedToTerms">
            <div className="flex items-start gap-3">
              <Checkbox
                id="termsCheckbox"
                checked={agreedToTerms}
                onCheckedChange={(checked) => {
                  setAgreedToTerms(checked as boolean)
                  if (fieldErrors.agreedToTerms) {
                    setFieldErrors(prev => {
                      const newErrors = { ...prev }
                      delete newErrors.agreedToTerms
                      return newErrors
                    })
                  }
                }}
              />
              <label htmlFor="termsCheckbox" className="text-sm text-slate-700 cursor-pointer">
                I agree to the{' '}
                <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {fieldErrors.agreedToTerms && (
              <p className="text-sm text-red-600 mt-1 ml-7">{fieldErrors.agreedToTerms}</p>
            )}
          </div>

          <div id="agreedToVeracity">
            <div className="flex items-start gap-3">
              <Checkbox
                id="veracityCheckbox"
                checked={agreedToVeracity}
                onCheckedChange={(checked) => {
                  setAgreedToVeracity(checked as boolean)
                  if (fieldErrors.agreedToVeracity) {
                    setFieldErrors(prev => {
                      const newErrors = { ...prev }
                      delete newErrors.agreedToVeracity
                      return newErrors
                    })
                  }
                }}
              />
              <label htmlFor="veracityCheckbox" className="text-sm text-slate-700 cursor-pointer">
                I confirm that this review is based on my genuine experience and is truthful and accurate to the best of my knowledge
              </label>
            </div>
            {fieldErrors.agreedToVeracity && (
              <p className="text-sm text-red-600 mt-1 ml-7">{fieldErrors.agreedToVeracity}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </Button>
      </div>
    </form>
  )
}