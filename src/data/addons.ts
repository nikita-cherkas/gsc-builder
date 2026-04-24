export const ADDON_OPTIONS = {
  foldableFlaps: {
    label: 'Foldable side flaps',
    description:
      'Hinged flaps fold outward to extend the work surface — great for outdoor events and rush periods.',
    price: 299,
    info: {
      paragraphs: [
        'Two 14″-wide hinged side panels that fold up flat to the cart top for an extra ~28″ of combined work surface. Self-supporting — the hinge mechanism uses a torsion-bar design, no fold-out floor legs to deploy.',
        'Useful when you need a staging area for orders, a milk-pitcher row, or a charcuterie tray during events. Fold them down for transport and they sit flush against the cart sides.',
      ],
      facts: [
        { label: 'Width each', value: '14"' },
        { label: 'Extra surface', value: '~28″ combined' },
        { label: 'Support', value: 'Torsion-bar, no legs' },
        { label: 'Material', value: 'Matches your top' },
      ],
    },
  },
  shelfInsert: {
    label: 'Interior shelf insert',
    description:
      'Mid-height shelf in the left compartment for cups, syrups, and dry goods above the water system.',
    price: 149,
    info: {
      paragraphs: [
        'A removable mid-height shelf inside the LEFT compartment of the cart. Lifts on cleat strips so you can pull it out for cleaning or to fit taller items underneath.',
        'Perfect for syrup bottles, sleeves of cups, or branded merchandise. Doesn\'t conflict with the right compartment which holds the water tank and pump.',
      ],
      facts: [
        { label: 'Compartment', value: 'Left' },
        { label: 'Removable', value: 'Lifts off cleats' },
        { label: 'Capacity', value: '~10 lb' },
      ],
    },
  },
  extraShelves: {
    label: 'Additional shelves',
    description: "Each shelf adds $59 — up to 3 extra mounted on the cart's exterior side walls.",
    pricePerUnit: 59,
    max: 3,
    info: {
      paragraphs: [
        'Side-mounted exterior shelves with brushed-metal brackets — accessible without opening the cabinet. Alternates left and right side as you add more (1 = right, 2 = both sides, 3 = right + left + right stack).',
        '6″ deep × the cart\'s full depth. Perfect for the items the barista grabs every minute: tampers, knock-box of accessories, milk pitchers warming, branded sample cups.',
      ],
      facts: [
        { label: 'Depth', value: '6"' },
        { label: 'Mount', value: 'Exterior side walls' },
        { label: 'Brackets', value: 'Brushed steel' },
        { label: 'Max', value: '3 shelves' },
      ],
    },
  },
} as const
