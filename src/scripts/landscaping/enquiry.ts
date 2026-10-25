// Landscaping enquiry form: posts to Formspree in the background and reports
// the result in a live region. Without JS the form still posts natively.
import { FORMSPREE_ENDPOINT, whatsappLink } from '../../config/site';

export interface Enquiry {
  name: string;
  phone: string;
  email: string;
  property: string;
  area: string;
  message: string;
}

/** The same details as a WhatsApp message, for when the form can't be sent. */
export function composeEnquiryMessage(e: Enquiry): string {
  return [
    "Hi Laughing Earth! I'd like to discuss a landscaping project.",
    e.property && `Property: ${e.property}`,
    e.area && `Area: ${e.area}`,
    e.message && `About the project: ${e.message}`,
    e.name && `Name: ${e.name}`,
    e.phone && `Phone: ${e.phone}`,
  ]
    .filter(Boolean)
    .join('\n');
}

type Status = { tone: 'ok' | 'error'; text: string; whatsapp?: string };

/**
 * What the visitor sees when the enquiry could not be delivered: Formspree is
 * not configured yet, the network dropped, or Formspree returned an error.
 *
 * TODO(you): decide the recovery. The default below explains the problem and
 * offers a WhatsApp link with their details already filled in. Alternatives:
 *  - open WhatsApp straight away (fewer taps, but a surprise new tab)
 *  - lead with "Call us" instead, for visitors who don't use WhatsApp
 *  - word it differently for "not configured" (our fault) vs a network drop (retry)
 */
export function onSendFailed(enquiry: Enquiry, reason: 'not-configured' | 'network' | 'rejected'): Status {
  const whatsapp = whatsappLink(composeEnquiryMessage(enquiry));
  return {
    tone: 'error',
    text:
      reason === 'network'
        ? "We couldn't send your enquiry. Check your connection and try again, or send it on WhatsApp."
        : "Our form isn't taking enquiries right now. Your details are ready to send on WhatsApp instead.",
    whatsapp,
  };
}

export function init() {
  const form = document.querySelector<HTMLFormElement>('[data-enquiry-form]');
  const status = document.querySelector<HTMLElement>('[data-enquiry-status]');
  if (!form || !status) return;

  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');

  const show = ({ tone, text, whatsapp }: Status) => {
    status.dataset.tone = tone;
    status.replaceChildren(text);
    if (whatsapp) {
      const link = Object.assign(document.createElement('a'), {
        href: whatsapp,
        target: '_blank',
        rel: 'noopener noreferrer',
        textContent: 'Send on WhatsApp',
      });
      link.dataset.event = 'whatsapp_click';
      link.dataset.eventLabel = 'landscaping_form_fallback';
      status.append(' ', link);
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const text = (key: string) => String(data.get(key) ?? '').trim();
    const enquiry: Enquiry = {
      name: text('name'),
      phone: text('phone'),
      email: text('email'),
      property: text('property'),
      area: text('area'),
      message: text('message'),
    };

    if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
      show(onSendFailed(enquiry, 'not-configured'));
      return;
    }

    submit?.setAttribute('aria-busy', 'true');
    if (submit) submit.disabled = true;
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        show(onSendFailed(enquiry, 'rejected'));
        return;
      }
      form.reset();
      show({ tone: 'ok', text: `Thank you, ${enquiry.name}. We have your enquiry and will call you soon.` });
    } catch {
      show(onSendFailed(enquiry, 'network'));
    } finally {
      submit?.removeAttribute('aria-busy');
      if (submit) submit.disabled = false;
    }
  });
}
