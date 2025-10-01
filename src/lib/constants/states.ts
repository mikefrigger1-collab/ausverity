// Australian states and territories
export const AUSTRALIAN_STATES = [
  { code: 'nsw', name: 'New South Wales', shortName: 'NSW' },
  { code: 'vic', name: 'Victoria', shortName: 'VIC' },
  { code: 'qld', name: 'Queensland', shortName: 'QLD' },
  { code: 'wa', name: 'Western Australia', shortName: 'WA' },
  { code: 'sa', name: 'South Australia', shortName: 'SA' },
  { code: 'tas', name: 'Tasmania', shortName: 'TAS' },
  { code: 'act', name: 'Australian Capital Territory', shortName: 'ACT' },
  { code: 'nt', name: 'Northern Territory', shortName: 'NT' },
] as const

export type StateCode = typeof AUSTRALIAN_STATES[number]['code']

export function isValidStateCode(code: string): code is StateCode {
  return AUSTRALIAN_STATES.some(state => state.code === code.toLowerCase())
}

export function getStateByCode(code: string) {
  return AUSTRALIAN_STATES.find(state => state.code === code.toLowerCase())
}

export function normalizeStateCode(state: string): StateCode | null {
  const normalized = state.toLowerCase()
  const stateObj = AUSTRALIAN_STATES.find(s =>
    s.code === normalized ||
    s.shortName.toLowerCase() === normalized ||
    s.name.toLowerCase() === normalized
  )
  return stateObj ? stateObj.code : null
}
