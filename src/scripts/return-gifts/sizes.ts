// Size choice on catalogue cards that come in several sizes (the thamboolam
// bag): the price, the note under the menu and the WhatsApp quote all follow
// the chosen size. Without JavaScript the card still reads correctly: "from"
// the smallest price, and the quote link names the first size.
import { whatsappLink } from '../../config/site';

const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export function init() {
  document.querySelectorAll<HTMLElement>('[data-size-card]').forEach((card) => {
    const select = card.querySelector<HTMLSelectElement>('[data-size-select]');
    const price = card.querySelector<HTMLElement>('[data-size-price]');
    if (!select || !price) return;
    const from = card.querySelector<HTMLElement>('[data-size-from]');
    const note = card.querySelector<HTMLElement>('[data-size-note]');
    const quote = card.querySelector<HTMLAnchorElement>('[data-size-quote]');
    const template = card.dataset.quoteTemplate ?? '';

    const show = () => {
      const option = select.selectedOptions[0];
      if (!option) return;
      const amount = rupees(Number(option.dataset.price));
      price.textContent = amount;
      if (from) from.hidden = true; // a size is chosen, so the price is exact
      if (note) note.textContent = option.dataset.note ?? '';
      if (quote && template) quote.href = whatsappLink(template.replace('{size}', option.value).replace('{price}', amount));
    };
    select.addEventListener('change', show);
    // Also right after Back: browsers restore the earlier choice in the menu.
    show();
  });
}
