import type { CutoutData } from '@/types'

export const CUTOUT_OPTIONS: CutoutData[] = [
  {
    id: 'solid',
    label: 'Solid top',
    description: 'No cutouts. Maximum work surface for pop-ups, markets, events.',
    features: ['Continuous surface'],
    price: 0,
    layout: [],
    info: {
      paragraphs: [
        'The solid top gives you the full 48″ × 24″ work surface uninterrupted by holes or fixtures. Best for events that don\'t need plumbed-in fixtures: pop-ups, weddings, markets where you can use a portable knock-box and work from a separate water source.',
        'Note: espresso machines need a knock-box cutout to be functional on the cart, so they\'ll be hidden from the 3D preview and the price total while this top is selected. Pick any service top to bring them back.',
      ],
      facts: [
        { label: 'Cutouts', value: 'None' },
        { label: 'Work area', value: '48" × 24"' },
        { label: 'Best for', value: 'Pop-ups, markets, weddings' },
      ],
    },
  },
  {
    id: 'basic',
    label: 'Basic service',
    description: 'Knock box + pitcher rinser. Minimum viable espresso station.',
    features: ['Knock box', 'Rinser'],
    price: 199,
    layout: [
      { kind: 'rect', x: 26, y: 14, w: 6, h: 6, label: 'Knock Box' },
      { kind: 'rect', x: 26, y: 4, w: 6.8, h: 6.2, label: 'Rinser' },
    ],
    info: {
      paragraphs: [
        'The minimum viable espresso station: a 6″ × 6″ knock box for spent pucks and a 6.8″ × 6.2″ pitcher rinser for cleaning steam wands and milk pitchers between drinks.',
        'Without a sink, you\'ll need to handle hand-washing through a separate setup or off-site. Many catering setups operate this way when paired with a commissary kitchen.',
      ],
      facts: [
        { label: 'Knock box', value: '6" × 6"' },
        { label: 'Rinser', value: '6.8" × 6.2"' },
        { label: 'Sink', value: '—' },
      ],
    },
  },
  {
    id: 'with-sink',
    label: 'With sink',
    description: 'Adds an inset hand sink — required for most health-code permits.',
    features: ['Hand sink', 'Knock box', 'Rinser'],
    price: 399,
    layout: [
      { kind: 'rect', x: 3, y: 5.7, w: 10.3, h: 12.6, label: 'Sink' },
      { kind: 'rect', x: 26, y: 14, w: 6, h: 6, label: 'Knock Box' },
      { kind: 'rect', x: 26, y: 4, w: 6.8, h: 6.2, label: 'Rinser' },
    ],
    info: {
      paragraphs: [
        'Adds a 10.3″ × 12.6″ inset hand sink with chrome faucet and pull-out spray head. This is the configuration most US health departments require to issue a permit for serving the public.',
        'Sink position leaves room for the faucet and spray arm above the rim. Plumbed off the cart\'s onboard water tank and pump (no external hookup required for short shifts).',
      ],
      facts: [
        { label: 'Sink', value: '10.3" × 12.6", 6" deep' },
        { label: 'Knock box', value: '6" × 6"' },
        { label: 'Rinser', value: '6.8" × 6.2"' },
        { label: 'Permits', value: 'Health-code compatible' },
      ],
    },
  },
  {
    id: 'full',
    label: 'Full service',
    description: 'Everything plus 8 oz & 12 oz cup dispensers. Full barista setup.',
    features: ['Sink', 'Knock box', 'Rinser', '8 oz + 12 oz cups'],
    price: 549,
    layout: [
      { kind: 'rect', x: 3, y: 5.7, w: 10.3, h: 12.6, label: 'Sink' },
      { kind: 'rect', x: 26, y: 14, w: 6, h: 6, label: 'Knock Box' },
      { kind: 'rect', x: 26, y: 4, w: 6.8, h: 6.2, label: 'Rinser' },
      { kind: 'circle', x: 42, y: 17, r: 2, label: '8 oz Cup' },
      { kind: 'circle', x: 42, y: 7, r: 2, label: '12 oz Cup' },
    ],
    info: {
      paragraphs: [
        'Everything from the With-sink option, plus two recessed cup dispenser holes — 4″-diameter chrome rims with cup tubes underneath the worktop holding 8 oz and 12 oz paper cups. The barista pulls one cup at a time straight up through the rim.',
        'Best for full-service operations where workflow speed matters: morning rush, corporate catering, anything > 100 drinks/day.',
      ],
      facts: [
        { label: 'Cups', value: '8 oz + 12 oz' },
        { label: 'Capacity', value: '~50 cups each' },
        { label: 'Sink', value: '10.3" × 12.6"' },
        { label: 'Best for', value: '100+ drinks/day' },
      ],
    },
  },
  {
    id: 'cups-no-sink',
    label: 'Compact pro',
    description: 'Service plus cup dispensers, no sink. For permitted commissary use.',
    features: ['Knock box', 'Rinser', '8 oz + 12 oz cups'],
    price: 299,
    layout: [
      { kind: 'rect', x: 26, y: 14, w: 6, h: 6, label: 'Knock Box' },
      { kind: 'rect', x: 26, y: 4, w: 6.8, h: 6.2, label: 'Rinser' },
      { kind: 'circle', x: 42, y: 17, r: 2, label: '8 oz Cup' },
      { kind: 'circle', x: 42, y: 7, r: 2, label: '12 oz Cup' },
    ],
    info: {
      paragraphs: [
        'Service workflow without the sink. Use this when you have a permitted commissary kitchen on-site doing the dish work, or when local code allows hand-sanitizer stations in lieu of a sink for short-shift events.',
        'Free-form left side of the cart top stays clear for laptop ordering, POS terminals, or signage.',
      ],
      facts: [
        { label: 'Knock box', value: '6" × 6"' },
        { label: 'Rinser', value: '6.8" × 6.2"' },
        { label: 'Cups', value: '8 oz + 12 oz' },
        { label: 'Sink', value: '—' },
      ],
    },
  },
]
