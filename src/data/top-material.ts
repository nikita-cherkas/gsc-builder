import type { PricedOption, TopMaterial } from '@/types'

export const TOP_MATERIAL_OPTIONS: PricedOption<TopMaterial>[] = [
  {
    id: 'laminate',
    label: 'HPL Laminate',
    description: 'Scratch- and stain-resistant. Easy to clean. Wide color range. Commercial-grade.',
    price: 0,
    highlights: ['Stain-proof', 'Scratch-resistant', '6 colors'],
    info: {
      paragraphs: [
        'High-pressure laminate (HPL) bonded over an MDF substrate. Same surface technology used on commercial kitchen counters and lab benches — coffee, syrup, espresso oils all wipe off without staining. Heat-resistant up to ~180°C.',
        'Cleans with any food-safe sanitizer (Cafiza, Sanitabs, etc.). No sealing or oiling required. Lifespan in commercial use: 8–12 years before visible wear.',
      ],
      facts: [
        { label: 'Substrate', value: 'MDF + HPL bonded' },
        { label: 'Heat', value: 'Stable to 180 °C' },
        { label: 'Care', value: 'Wipe with sanitizer' },
        { label: 'Lifespan', value: '8–12 years' },
      ],
    },
  },
  {
    id: 'hardwood',
    label: 'Solid hardwood',
    description: 'Sealed oak or walnut with food-safe finish. Warmer, premium look.',
    price: 349,
    highlights: ['Real wood', 'Food-safe finish', '4 tones'],
    info: {
      paragraphs: [
        '1.5″ solid white oak or walnut, edge-glued and finished with a food-safe hard-wax oil (Osmo Polyx, Rubio Monocoat). Warmer feel and ages with use — minor dings give it character rather than ruin it.',
        'Re-oil once a year for service-heavy use, every 2–3 years for lighter use. Avoid leaving standing water for hours at a time.',
      ],
      facts: [
        { label: 'Wood', value: 'White oak / walnut' },
        { label: 'Finish', value: 'Food-safe hard-wax oil' },
        { label: 'Care', value: 'Re-oil yearly' },
        { label: 'Patina', value: 'Develops with use' },
      ],
    },
  },
  {
    id: 'stainless',
    label: 'Stainless steel',
    description: 'Brushed 18-gauge stainless. Hygienic and indestructible. Pro kitchen feel.',
    price: 499,
    highlights: ['18-gauge steel', 'Pro kitchen', 'Hygienic'],
    info: {
      paragraphs: [
        '1.2 mm (18-gauge) brushed 304 stainless steel, fully welded around the cutouts and rolled at the edges. NSF-equivalent surface — what you\'d find in a real commercial kitchen. Indestructible, completely impervious to coffee oils and acids.',
        'Will show fingerprints and minor scuffs that polish out with a stainless cleaner. The brushed grain hides daily wear well.',
      ],
      facts: [
        { label: 'Material', value: '304 stainless, 18-ga' },
        { label: 'Hygiene', value: 'NSF-equivalent surface' },
        { label: 'Edges', value: 'Rolled / welded' },
        { label: 'Care', value: 'Stainless polish weekly' },
      ],
    },
  },
]
