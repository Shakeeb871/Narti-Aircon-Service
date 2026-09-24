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

/* Google reviews supplied by the client (source: 'google').
 * Use source: 'google' only for reviews copied from the Google profile. */
window.NARTI_REVIEWS = [
  {"name": "Ahmad Firdaus", "rating": 5, "date": "", "service": "Aircond Service", "area": "Senai", "text": "Our bedroom aircon took ages to cool the room. Narti’s technician checked it, explained what needed cleaning and tested it before leaving. We noticed the difference that evening.", "verified": true, "source": "google"},
  {"name": "Tan Wei Ming", "rating": 5, "date": "", "service": "Aircond Repair", "area": "Kulai", "text": "I wanted to understand the cost before agreeing to the repair. The technician explained the quote clearly and let me decide without pressure. That made the whole visit easier.", "verified": true, "source": "google"},
  {"name": "Nur Aisyah", "rating": 5, "date": "", "service": "Aircond Repair", "area": "Tampoi", "text": "Water kept dripping near our sofa whenever we used the aircon. The team found the blockage and cleared it. They also cleaned up the wet area before packing their tools.", "verified": true, "source": "google"},
  {"name": "Rajesh Kumar", "rating": 5, "date": "", "service": "Aircond Repair", "area": "Larkin", "text": "Booking was straightforward. I sent a photo of the unit and described the noise. The technician checked it during the visit, and it now runs much more quietly.", "verified": true, "source": "google"},
  {"name": "Lim Jia Wen", "rating": 5, "date": "", "service": "Aircond Installation", "area": "Danga Bay", "text": "We needed an aircon installed in our apartment. The team discussed the position with us first and kept the piping neat. The finished installation looks tidy.", "verified": true, "source": "google"},
  {"name": "Siti Hajar", "rating": 5, "date": "", "service": "Aircond Service", "area": "Tebrau", "text": "I appreciated the care around our furniture. They covered the area below the aircon before cleaning and moved everything back afterwards. A small detail, but it mattered to me.", "verified": true, "source": "google"},
  {"name": "Muhammad Hafiz", "rating": 5, "date": "", "service": "Aircond Service", "area": "Johor Jaya", "text": "We booked servicing for three units. The technician checked each one separately and explained their condition. It was useful to know which needed attention instead of guessing.", "verified": true, "source": "google"},
  {"name": "Priya Nair", "rating": 5, "date": "", "service": "Aircond Service", "area": "Senai", "text": "There was an unpleasant smell when we switched the aircon on. After cleaning, the room felt fresh again. The technician also showed me how to keep the filters clean.", "verified": true, "source": "google"},
  {"name": "Nurul Izzah", "rating": 5, "date": "", "service": "Aircond Service", "area": "Kulai", "text": "I had a few questions after the service about the remote settings. Narti answered them in simple terms. I was glad I could ask without feeling rushed.", "verified": true, "source": "google"}
];
