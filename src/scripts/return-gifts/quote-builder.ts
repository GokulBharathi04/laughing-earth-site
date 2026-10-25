// Bulk quote builder: the form inside the morph dialog becomes a pre-filled
// WhatsApp message. No data leaves the browser until the visitor hits send.
import { whatsappLink } from '../../config/site';

export interface QuoteRequest {
  name: string;
  occasion: string;
  gifts: string[];
  quantity: string;
  eventDate: string; // yyyy-mm-dd from <input type="date">, or ''
  area: string;
  customisation: string;
}

/**
 * Turns the form into the WhatsApp message the Laughing Earth team receives.
 *
 * TODO(you): shape this message. It's the first thing the team reads for every
 * bulk enquiry, so its order and wording decide how fast they can reply with
 * a price. Things to decide:
 *  - Lead with what drives the quote (quantity? event date?), or with a greeting?
 *  - Date format: "14 Feb 2027" reads better than "2027-02-14" in a chat.
 *  - Skip empty fields entirely, or say "not decided yet" so the team knows to ask?
 *  - Tamil or English greeting ("Vanakkam")? Match how the team talks to customers.
 * Keep it short enough to read on a phone lock screen.
 */
export function composeQuoteMessage(q: QuoteRequest): string {
  const lines = [
    "Hi Laughing Earth! I'd like a quote for return gifts.",
    q.occasion && `Occasion: ${q.occasion}`,
    q.gifts.length > 0 && `Gifts: ${q.gifts.join(', ')}`,
    q.quantity && `Quantity: ${q.quantity}`,
    q.eventDate && `Event date: ${q.eventDate}`,
    q.area && `Delivery area: ${q.area}`,
    q.customisation && `Customisation: ${q.customisation}`,
    q.name && `Name: ${q.name}`,
  ];
  return lines.filter(Boolean).join('\n');
}

export function init() {
  const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const text = (key: string) => String(data.get(key) ?? '').trim();
    const message = composeQuoteMessage({
      name: text('name'),
      occasion: text('occasion'),
      gifts: data.getAll('gifts').map(String),
      quantity: text('quantity'),
      eventDate: text('event-date'),
      area: text('area'),
      customisation: text('customisation'),
    });

    window.open(whatsappLink(message), '_blank', 'noopener');
  });
}
