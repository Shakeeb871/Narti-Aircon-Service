/* NARTI Aircon Service — customer reviews shown in the Testimonials slider.
 *
 * Paste REAL reviews from the NARTI Google Business Profile here, word for word.
 * Do not write or edit reviews yourself: showing made-up reviews is against
 * Google's rules and consumer protection law.
 *
 * While this list is empty the Testimonials section shows a 'Read Google Reviews /
 * Leave a Review' card. As soon as it has reviews, the sliding cards replace it.
 *
 * Fields:
 *   name     reviewer name as shown on Google (first name + initial is fine)
 *   rating   1 to 5
 *   date     as shown on Google, e.g. "2 weeks ago" or "Sep 2026"
 *   service  optional tag, e.g. "Aircond Service"
 *   area     optional, e.g. "Skudai"
 *   text     the review text
 *   verified true only for reviews copied from Google
 *
 * Example:
 *   { name: 'Aisyah R.', rating: 5, date: '1 month ago', service: 'Aircond Service',
 *     area: 'Skudai', text: '...', verified: true },
 */
/* Paste the 'Ask for reviews' link from the Google Business Profile here. */
window.NARTI_REVIEW_LINK = '';

/* Shown in the same slider until real reviews are added above.
 * These describe how NARTI works; they are not customer quotes. */
window.NARTI_HIGHLIGHTS = [
  { icon: 'doc',   tag: 'Every Job',            title: 'Written quote first',          text: 'You see the price in writing after the check. Work starts only once you agree to it.' },
  { icon: 'temp',  tag: 'Every Job',            title: 'Cooling tested before we leave', text: 'We measure the air temperature at the louvres, so you feel the unit cooling before we pack up.' },
  { icon: 'drop',  tag: 'Gas Top-Up',           title: 'Leak repaired before gas',     text: 'Gas runs in a sealed loop. We find and fix the leak first, so the new gas stays in.' },
  { icon: 'chat',  tag: 'Every Job',            title: 'Explained in plain words',     text: 'Our technician shows you which part failed and why, without jargon.' },
  { icon: 'home',  tag: 'Every Job',            title: 'Your room kept clean',         text: 'We cover the floor below the unit and put furniture back where it stood.' },
  { icon: 'gauge', tag: 'Gas Top-Up',           title: 'The right gas for your unit',  text: 'R32, R410A or R22: we top up only the refrigerant shown on your unit label.' },
  { icon: 'unit',  tag: 'Aircond Installation', title: 'Piping vacuumed on installs',  text: 'Air and moisture come out of the pipes before the gas valves open, which protects the compressor.' },
  { icon: 'fan',   tag: 'Aircond Service',      title: 'Drain flushed on every service', text: 'We clear the drain pan and pipe, the most common cause of water dripping from the unit.' },
  { icon: 'pin',   tag: 'Skudai, Johor',        title: 'Local team in Skudai',         text: 'Based in Taman Pulai Utama and covering Johor Bahru, Iskandar Puteri, Kulai, Pasir Gudang and more.' }
];

window.NARTI_REVIEWS = [
];
