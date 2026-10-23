// Business details and shared links — single source for every component.

export const SITE = {
  name: 'Laughing Earth',
  tagline: 'Gardens that grow. Gifts that grow.',
  brandLine:
    'At Laughing Earth, we believe that plants have the power to bring joy, peace, and beauty to every space.',
  phoneDisplay: '+91 86681 96940',
  phoneHref: 'tel:+918668196940',
  whatsappNumber: '918668196940',
  email: 'info@laughingearth.in',
  instagram: 'https://www.instagram.com/laughingearth_plantshop/',
  address: {
    street: '8B, Sastha Nagar Annex, opposite Thathan Kuppam lake, Rajiv Gandhi Nagar',
    locality: 'Villivakkam',
    city: 'Chennai',
    region: 'Tamil Nadu',
    postalCode: '600049',
    country: 'IN',
  },
  credit: { name: 'Pick your Pixel', label: 'Designed & Developed by Pick your Pixel' },
} as const;

export type Theme = 'landscaping' | 'gifts';

/** Click-to-chat link with a URL-encoded, pre-filled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_MESSAGES = {
  general: "Hi Laughing Earth! I'd like to know more about your landscaping and return gifts.",
  landscaping: "Hi Laughing Earth! I'd like to discuss a landscaping project.",
  gifts: "Hi Laughing Earth! I'd like a quote for eco-friendly return gifts.",
} as const;

export const NAV = {
  landscaping: { href: '/landscaping', label: 'Landscaping' },
  gifts: { href: '/return-gifts', label: 'Return Gifts' },
  about: { href: '/about', label: 'About' },
  contact: { href: '/contact', label: 'Contact' },
} as const;

export const POLICIES = [
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/returns', label: 'Returns & Refunds' },
  { href: '/disclaimer', label: 'Disclaimer' },
] as const;
