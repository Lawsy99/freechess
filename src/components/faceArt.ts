// Draws an illustrated face (data/faces.ts) with an expression, as an image
// address the page can show. Each face and expression is drawn once, then
// remembered.
import { createAvatar } from '@dicebear/core'
import * as micah from '@dicebear/micah'
import type { Face } from '../data/faces'
import type { Expression } from '../logic/dialogue'

type Look = { mouth: string; eyes: string; brows: 'up' | 'down' }

const LOOKS: Record<Expression, Look> = {
  neutral: { mouth: 'smirk', eyes: 'eyes', brows: 'up' },
  pleased: { mouth: 'laughing', eyes: 'smiling', brows: 'up' },
  annoyed: { mouth: 'frown', eyes: 'eyes', brows: 'down' },
  surprised: { mouth: 'surprised', eyes: 'round', brows: 'up' },
  smug: { mouth: 'smirk', eyes: 'smilingShadow', brows: 'down' },
}

const INK = '1c1a1a'
const drawn = new Map<string, string>()

export function faceUri(id: string, face: Face, expression: Expression): string {
  const key = `${id}:${expression}`
  const known = drawn.get(key)
  if (known) return known
  const look = LOOKS[expression] ?? LOOKS.neutral
  const mouth = face.tightSmile && expression === 'annoyed' ? 'nervous' : look.mouth
  const brows = face.lashes ? (look.brows === 'up' ? 'eyelashesUp' : 'eyelashesDown') : look.brows
  const uri = createAvatar(micah, {
    seed: id,
    radius: 50,
    backgroundColor: [face.bg],
    baseColor: [face.skin],
    hair: [face.hair],
    hairColor: [face.hairColour ?? INK],
    hairProbability: 100,
    // (Brows match the hair, but never so pale they vanish on light skin.)
    eyebrowsColor: [INK],
    mouth: [mouth as 'smile'],
    eyes: [look.eyes as 'eyes'],
    eyebrows: [brows],
    shirt: [face.shirt],
    shirtColor: [face.shirtColour],
    glasses: face.glasses ? [face.glasses] : undefined,
    glassesProbability: face.glasses ? 100 : 0,
    glassesColor: [INK],
    facialHair: face.beard ? [face.beard] : undefined,
    facialHairProbability: face.beard ? 100 : 0,
    facialHairColor: [face.hairColour ?? INK],
    earrings: face.earrings ? [face.earrings] : undefined,
    earringsProbability: face.earrings ? 100 : 0,
    earringColor: ['f2c14e'],
  }).toDataUri()
  drawn.set(key, uri)
  return uri
}
