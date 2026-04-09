export type TRegion = 'domestic' | 'international'

export type TDifficulty = 'starter' | 'advanced' | 'challenge'

export interface TStory {
  id: string
  region: TRegion
  difficulty: TDifficulty
  title: string
  soupSurface: string
  canonicalAnswer: string
  sourceWork: string
  outfitAnalysis: string
  imageUrl: string
  keyHint: string
}
