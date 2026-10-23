// Return Gifts catalogue: types, categories and helpers around data/products.json.
import productData from '../../data/products.json';
import { whatsappLink } from '../config/site';

export const CATEGORIES = [
  {
    id: 'seeded-gifts',
    label: 'Seeded return gifts',
    blurb: 'Saplings and seeded favours your guests plant and grow.',
    icon: 'sprout',
    colourway: 'sage',
  },
  {
    id: 'seed-paper-invitations',
    label: 'Seed-paper invitations',
    blurb: 'Wedding cards on paper that grows into flowers.',
    icon: 'card',
    colourway: 'earth',
  },
  {
    id: 'thamboolam-bags',
    label: 'Thamboolam bags',
    blurb: 'Eco-friendly bags, customised with names and dates.',
    icon: 'bag',
    colourway: 'earth',
  },
  {
    id: 'plants',
    label: 'Plants in jute & ceramic',
    blurb: 'Succulents and jade in jute-wrapped and ceramic pots.',
    icon: 'pot',
    colourway: 'sand',
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export interface Product {
  name: string;
  slug: string;
  category: CategoryId;
  price: number;
  mrp: number;
  image: string;
  description: string;
  descriptionNeedsReview?: boolean;
}

export const PRODUCTS = productData as Product[];

export const categoryLabel = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const productCount = (id: CategoryId) => PRODUCTS.filter((p) => p.category === id).length;

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const formatPrice = (amount: number) => inr.format(amount);

export const discountPercent = (p: Product) => (p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0);

/** Pre-filled WhatsApp quote request naming the product. */
export const productQuoteLink = (p: Product) =>
  whatsappLink(
    `Hi Laughing Earth! I'd like a quote for "${p.name}" (${formatPrice(p.price)} each).\n` +
      'Quantity: \nEvent date: \nCustomisation (names / date / logo): ',
  );
