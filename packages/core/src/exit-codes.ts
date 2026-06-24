export const EXIT_CODES = {
  passed: 0,
  failed: 1,
  usage: 2,
  provider: 3,
  internal: 4,
} as const

export type ExitCode = (typeof EXIT_CODES)[keyof typeof EXIT_CODES]
