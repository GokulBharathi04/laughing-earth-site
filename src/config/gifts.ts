// Return Gifts page content that the client still has to confirm.
// Anything with `placeholder: true` renders a visible "To be confirmed" tag
// so it can't slip into launch unnoticed (see BRIEF.md §4, "Still to come").

export interface BulkRule {
  icon: 'boxes' | 'pen' | 'clock' | 'truck';
  title: string;
  value: string;
  detail: string;
  placeholder: boolean;
}

export const BULK_RULES: BulkRule[] = [
  {
    icon: 'boxes',
    title: 'Minimum quantity',
    value: '50 pieces per design',
    detail: 'Smaller orders for intimate functions on request.',
    placeholder: true,
  },
  {
    icon: 'pen',
    title: 'Customisation',
    value: 'Names, dates & logos',
    detail: 'Printed on bags, tags and thank-you cards to match your event.',
    placeholder: true,
  },
  {
    icon: 'clock',
    title: 'Lead time',
    value: '7–10 days',
    detail: 'Order 2–3 weeks ahead for large or fully customised orders.',
    placeholder: true,
  },
  {
    icon: 'truck',
    title: 'Delivery areas',
    value: 'Across Chennai',
    detail: 'Pick-up from Villivakkam, or delivery outside Chennai on request.',
    placeholder: true,
  },
];

export const GIFT_FAQS = [
  {
    q: 'What is the minimum order for return gifts?',
    a: 'Most of our return gifts start at 50 pieces per design. For smaller family functions, message us on WhatsApp and we will do our best to help.',
  },
  {
    q: 'Can you print our names, wedding date or logo?',
    a: 'Yes. Thamboolam bags, saplings with customised bags and seed-paper invitations can carry your names, date, a short message or a company logo. We share a design preview on WhatsApp before printing.',
  },
  {
    q: 'How early should we place a bulk order?',
    a: 'Give us at least 7–10 days for standard orders and 2–3 weeks for large or fully customised orders, especially during the wedding season.',
  },
  {
    q: 'Do you deliver outside Chennai?',
    a: 'We deliver across Chennai and you are welcome to pick up from our Villivakkam store. Delivery to other cities is possible on request; we will confirm the cost with your quote.',
  },
  {
    q: 'How do seed-paper invitations grow?',
    a: 'Soak the card for a few hours, plant it in a pot of soil just under the surface, keep it in light shade and water gently every day. Sprouts usually appear in one to two weeks.',
  },
  {
    q: 'Will the plants survive until the event?',
    a: 'We pick hardy succulents, jade and saplings, and deliver them close to your date with simple care instructions. Keep them in bright, indirect light and water lightly until the event.',
  },
];
