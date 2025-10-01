import { normalizeStateCode } from "@/lib/constants/states"

interface LawyerUrlParams {
  slug: string | null | undefined
  state: string | null | undefined
}

interface FirmUrlParams {
  slug: string | null | undefined
  locations?: Array<{ state: string }> | null
}

/**
 * Generates the URL for a lawyer profile with state-based routing
 */
export function getLawyerUrl(params: LawyerUrlParams): string | null {
  if (!params.slug || !params.state) return null

  const stateCode = normalizeStateCode(params.state)
  if (!stateCode) return null

  return `/${stateCode}/lawyer/${params.slug}`
}

/**
 * Generates the URL for a firm profile with state-based routing
 * Uses the primary location or first location's state
 */
export function getFirmUrl(params: FirmUrlParams): string | null {
  if (!params.slug || !params.locations || params.locations.length === 0) {
    return null
  }

  // Use the first location's state
  const stateCode = normalizeStateCode(params.locations[0].state)
  if (!stateCode) return null

  return `/${stateCode}/firm/${params.slug}`
}

/**
 * Generates the URL for a state page
 */
export function getStateUrl(state: string): string | null {
  const stateCode = normalizeStateCode(state)
  if (!stateCode) return null

  return `/${stateCode}`
}
