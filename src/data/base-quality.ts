import type { BaseQuality, PricedOption } from '@/types'

export const BASE_QUALITY_OPTIONS: PricedOption<BaseQuality>[] = [
  {
    id: 'standard',
    label: 'Standard cabinet',
    description:
      'Commercial-grade MDF with sealed edges. Natural finish only. Reliable and cost-effective.',
    price: 0,
    highlights: ['Sealed MDF', 'Natural finish', 'Indoor-friendly'],
    info: {
      paragraphs: [
        'Standard carts use 3/4″ commercial-grade MDF with sealed edges and a clear satin finish. It\'s our value option — built for indoor venues like hotel lobbies, office cafés, and event halls where the cart isn\'t exposed to weather.',
        'Avoid prolonged outdoor use or wet wash-downs. For weather-resistant builds and color choices, step up to the Premium cabinet.',
      ],
      facts: [
        { label: 'Material', value: '3/4" commercial MDF' },
        { label: 'Finish', value: 'Sealed, satin clear' },
        { label: 'Use', value: 'Indoor / sheltered' },
        { label: 'Color', value: 'Natural only' },
      ],
    },
  },
  {
    id: 'premium',
    label: 'Premium cabinet',
    description:
      'Marine-grade plywood with full waterproof film wrap. Choose any accent color in the next step.',
    price: 449,
    highlights: ['Marine-grade ply', 'Waterproof wrap', '7 colors'],
    info: {
      paragraphs: [
        'Premium uses 18 mm marine-grade plywood — the same stuff used in boat builds — sealed and wrapped in a waterproof PVC film. Wash it down with a hose without a worry.',
        'Includes a 7-color palette (next step) plus heavier-duty corner protectors and stainless drip lips inside the cabinet. Recommended for outdoor markets, festivals, and any venue where the cart sees moisture.',
      ],
      facts: [
        { label: 'Material', value: '18 mm marine ply' },
        { label: 'Wrap', value: 'Waterproof PVC film' },
        { label: 'Use', value: 'Indoor + outdoor' },
        { label: 'Colors', value: '7 options' },
      ],
    },
  },
]
