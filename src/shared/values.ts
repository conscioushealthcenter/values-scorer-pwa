export const VALUES = [
  { id: 'personal_growth', label: 'Personal Growth', blurb: 'Developing skills, habits, and self-understanding.' },
  { id: 'authentic_relationships', label: 'Authentic Relationships', blurb: 'Genuine, honest connection with others.' },
  { id: 'mental_health', label: 'Mental Health Awareness', blurb: 'Caring for and talking openly about mental wellbeing.' },
  { id: 'social_justice', label: 'Social Justice', blurb: 'Fairness, equity, and standing up for others.' },
  { id: 'environment', label: 'Environmental Consciousness', blurb: 'Protecting the planet and living sustainably.' },
  { id: 'creative_expression', label: 'Creative Expression', blurb: 'Making and appreciating art, ideas, and craft.' },
  { id: 'mindful_consumption', label: 'Mindful Consumption', blurb: 'Intentional use of attention, money, and media.' },
  { id: 'community_building', label: 'Community Building', blurb: 'Showing up for and strengthening local and shared communities.' },
  { id: 'learning', label: 'Learning / Education', blurb: 'Curiosity, knowledge, and teaching others.' },
  { id: 'empathy', label: 'Empathy / Compassion', blurb: 'Understanding and caring about others’ experiences.' },
] as const;

export type ValueId = (typeof VALUES)[number]['id'];
export type ValuesVector = Record<ValueId, 1 | 2 | 3 | 4 | 5>;

export function defaultVector(rating: 1 | 2 | 3 | 4 | 5 = 3): ValuesVector {
  return Object.fromEntries(VALUES.map((v) => [v.id, rating])) as ValuesVector;
}
