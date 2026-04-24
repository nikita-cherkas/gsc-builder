import type { CartType, PricedOption } from '@/types'

export const CART_TYPE_OPTIONS: PricedOption<CartType>[] = [
  {
    id: 'knockdown',
    label: 'Knockdown',
    description:
      'Ships flat in panels. Assembles in under an hour with basic tools. Easier to transport and store.',
    price: 0,
    highlights: ['Flat-pack shipping', '1-hour assembly', 'Lower freight cost'],
    info: {
      paragraphs: [
        'Knockdown carts ship completely flat in a single crate. The back wall is the only fixed piece — the side walls hinge to it like a book, and the worktop sits on top like a hat. A two-person crew can put a cart together in 45–60 minutes with a Phillips screwdriver and the included Allen key.',
        'Best for buyers who want lower freight, easier off-season storage, or who plan to relocate the cart between venues. The hinge mechanism is the same hardware we put on solid carts, so day-to-day rigidity is identical.',
      ],
      facts: [
        { label: 'Shipping', value: 'Flat-pack, single crate' },
        { label: 'Assembly', value: '45–60 min, 2 people' },
        { label: 'Tools', value: 'Phillips + Allen (included)' },
        { label: 'Crate dim.', value: '52" × 28" × 6"' },
      ],
    },
  },
  {
    id: 'solid',
    label: 'Solid one-piece',
    description:
      'Welded and glued for a rock-solid frame. Arrives fully built on a crate. Sturdiest build.',
    price: 399,
    highlights: ['Pre-assembled frame', 'Maximum rigidity', 'Ready day-of'],
    info: {
      paragraphs: [
        'Solid carts are bonded and braced at the factory. The frame is glued and screwed (not just hinged), with corner gussets behind every joint. Best for high-volume operations or for an espresso machine that vibrates at peak service.',
        'Arrives fully assembled on a custom pallet. Roll it off the lift, plug in, and start serving. The trade-off is bigger freight: it ships in its full footprint rather than flat-pack.',
      ],
      facts: [
        { label: 'Shipping', value: 'Pre-assembled on pallet' },
        { label: 'Assembly', value: 'None' },
        { label: 'Joints', value: 'Glued + screwed + bracketed' },
        { label: 'Best for', value: 'High-vibration machines' },
      ],
    },
  },
]
