import { ScenarioPreset, SentimentReport } from '../types';

import scenarioDeliveryImg from '../assets/images/scenario_delivery_1789543644792.jpg';
import scenarioSupportImg from '../assets/images/scenario_support_1789543672606.jpg';
import scenarioProductImg from '../assets/images/scenario_product_1789543794523.jpg';

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'ecommerce-delivery',
    title: 'E-Commerce Logistics & Delivery Rush',
    subtitle: 'Holiday peak shipping, parcel tracking accuracy, and courier handoffs',
    badge: 'Logistics & Retail',
    imageSrc: scenarioDeliveryImg,
    description: 'Reviews spanning pre-holiday delivery promises, carrier tracking gaps, damaged unboxing issues, and express delivery praise.',
    reviewCount: 28,
    sampleText: `[2026-11-02] Maya Lin (Rating: 5/5): "Ordered on Tuesday, arrived Thursday morning in pristine condition! The eco-friendly carton was beautifully sealed and my ceramics were completely safe. Top notch fulfillment."
[2026-11-05] Marcus Vance (Rating: 4/5): "Item quality is superb as usual. Tracking notification was about 6 hours delayed from actual doorstep drop-off, but overall very happy with the quick delivery."
[2026-11-09] Chloe Bennett (Rating: 5/5): "Super fast shipping and love the packaging! Everything arrived fresh and neat. Will definitely order again for holiday gifts."
[2026-11-12] David Ross (Rating: 2/5): "Package arrived with the outer box crushed and damp. Luckily the product inside was intact, but carrier handling was noticeably sloppy. Please use sturdier tape."
[2026-11-15] Elena Rostova (Rating: 5/5): "Flawless delivery! Courier rang the doorbell and placed it safely behind the porch pillar out of the rain. Impressed with the attention to detail."
[2026-11-18] Jordan Taylor (Rating: 3/5): "Standard shipping took 8 days instead of the promised 3-4 days. Support was courteous when I messaged them, but automated tracking showed 'In Transit' for four days with no scan updates."
[2026-11-21] Samantha Wu (Rating: 5/5): "Great purchase experience. Fast delivery, beautifully boxed, and the product exceeded expectations."
[2026-11-25] Tariq Al-Mansoor (Rating: 1/5): "Order #74821 tracking stated 'Delivered to front door' on Friday night, but absolutely nothing was there. Checked security camera and no carrier truck even drove down our street! Now waiting on refund investigation."
[2026-11-27] Rachel Adams (Rating: 2/5): "Courier marked delivery as attempted because of 'gate code required' even though my account notes clearly provided the gate code. Delayed my order by three days."
[2026-11-30] Liam O'Connor (Rating: 1/5): "Horrible courier experience. Driver tossed the parcel over our 6-foot fence onto concrete! Glass jar shattered inside. Customer support refunded promptly, but courier partner needs accountability."
[2026-12-02] Sophia Chen (Rating: 4/5): "Good product, reasonable delivery time. Outer cardboard had a puncture mark, but bubble wrap saved the day."
[2026-12-04] Kevin Patel (Rating: 1/5): "Ordered expedited 2-day delivery for a birthday present. Arrived on day 6. Tracking status had zero scans for 72 hours. Completely ruined the birthday surprise."
[2026-12-06] Brian Miller (Rating: 5/5): "Fast dispatch! Received shipping confirmation within 2 hours of checkout and delivery took just 48 hours. Excellent speed."
[2026-12-08] Jessica Hall (Rating: 2/5): "The tracking portal showed 'Out for delivery' three days in a row before actually arriving. Customer support was polite, but carrier reliability during December is crumbling."
[2026-12-10] Daniel Kim (Rating: 1/5): "Missing parcel #91823. Tracking says delivered at 3:15 PM, porch camera shows empty porch. Carrier customer service was unhelpful. Waiting on merchant refund."
[2026-12-12] Natalie Garcia (Rating: 4/5): "Product is wonderful. Shipping took a little longer than November orders, which is understandable for peak season, but clear communication would help."
[2026-12-14] Thomas Wright (Rating: 5/5): "Driver took a clear photo of delivery location right next to our back patio door as requested. Flawless service!"
[2026-12-15] Hannah Scott (Rating: 2/5): "Delayed shipment and crushed box corners. Support team handled the replacement smoothly, but the carrier handoff is definitely the weak link."`
  },
  {
    id: 'customer-support-desk',
    title: 'Customer Support & Resolution Quality',
    subtitle: 'Agent empathy, refund turnaround time, and ticket response velocity',
    badge: 'Customer Care & Ops',
    imageSrc: scenarioSupportImg,
    description: 'Analysis of customer interactions with support agents, automated bot handoffs, dispute resolutions, and refund workflows.',
    reviewCount: 22,
    sampleText: `[2026-10-01] Sarah Jenkins (Rating: 5/5): "Agent Clara on live chat resolved my billing inquiry in under three minutes. Courteous, professional, and knowledgeable. Best support interaction I have had all year!"
[2026-10-04] Devante Washington (Rating: 1/5): "Got stuck in an infinite bot loop on chat. Kept asking me for order ID and then spitting out generic FAQ links. Took 40 minutes just to reach a human."
[2026-10-07] Lisa Goldberg (Rating: 5/5): "Had an accidental duplicate charge on my account. Support agent Brandon caught it before I even finished explaining, reversed the fee instantly, and sent confirmation receipt. Outstanding empathy."
[2026-10-11] Robert Vance (Rating: 2/5): "Email response took 5 days. When they finally replied, the agent clearly had not read my initial description and asked for screenshots I had already attached."
[2026-10-15] Emily Watson (Rating: 4/5): "Phone support was quick to answer. Representative was very polite and handled my address change without hassle."
[2026-10-19] Carlos Mendez (Rating: 1/5): "Requested a return label for wrong size item. Agent promised email label within an hour. Two days later still nothing. Had to initiate chat all over again."
[2026-10-23] Anita Roy (Rating: 5/5): "The support team went above and beyond! When my replacement item went missing, they processed an expedited reshipment with free gift wrap."
[2026-10-28] Derek Brooks (Rating: 2/5): "Support representatives are friendly, but their hands seem tied by rigid policies. Could not offer a simple replacement without a 7-day carrier investigation first."
[2026-11-02] Grace Hopper (Rating: 5/5): "Swift refund processing! As soon as the carrier scan registered the return, the refund hit my card within 24 hours. Very trustworthy."
[2026-11-06] Tyler Evans (Rating: 1/5): "Transferred 4 times between departments. Each new person asked me to re-explain the entire problem from scratch. Zero internal notes!"
[2026-11-10] Naomi Campbell (Rating: 5/5): "Agent Marco handled my lost parcel with supreme professionalism. Confirmed the carrier declaration and initiated Stripe refund immediately with zero friction."
[2026-11-14] Jason Lee (Rating: 3/5): "Average service. Solved the problem eventually, but lacked follow-through on ticket closure confirmation."`
  },
  {
    id: 'hardware-product-launch',
    title: 'Smart Tech & Hardware Unboxing',
    subtitle: 'Build ergonomics, firmware stability, setup ease, and durability',
    badge: 'Product & Hardware',
    imageSrc: scenarioProductImg,
    description: 'Post-launch feedback covering industrial design, battery performance, app synchronization, and packaging ergonomics.',
    reviewCount: 20,
    sampleText: `[2026-09-02] Alex Mercer (Rating: 5/5): "The unboxing experience feels like opening an Apple or Bang & Olufsen product. Premium matte finish, solid weight, and zero plastic packaging waste!"
[2026-09-05] Priya Patel (Rating: 5/5): "Battery life is astounding! Still sitting at 65% after 4 days of heavy usage. Sound profile is crisp with rich bass."
[2026-09-08] Julian Fischer (Rating: 2/5): "Hardware looks stunning, but companion app setup was painful. Bluetooth pairing failed three times until I restarted my phone. Firmware needs optimization."
[2026-09-12] Cameron Diaz (Rating: 4/5): "Great ergonomics and comfortable for 6+ hour sessions. Volume knob has a satisfying tactile click. Minor bug with widget display."
[2026-09-16] Oliver Queen (Rating: 1/5): "Left speaker began producing intermittent crackling sound on day 3. Tried factory reset with no luck. Waiting for hardware replacement."
[2026-09-20] Zoe Saldaña (Rating: 5/5): "Incredible build quality! Aluminum frame feels rugged yet refined. USB-C fast charging is a massive upgrade."
[2026-09-24] Henry Cavill (Rating: 3/5): "Decent soundstage and gorgeous chassis. However, the companion iOS app crashed twice during the initial calibration wizard."
[2026-09-28] Emma Frost (Rating: 5/5): "The noise cancellation is whisper quiet. Commute on the subway was completely silent. Well worth the price tag."
[2026-10-02] Lucas Scott (Rating: 2/5): "Touch sensor on the side is far too sensitive. Adjusting the headset in my ears accidentally pauses my podcast every single time."
[2026-10-06] Nina Williams (Rating: 5/5): "Exquisite craftsmanship. Beautiful packaging, easy-to-read quick start guide, and sounds magnificent right out of the box."`
  }
];

export const INITIAL_REPORT: SentimentReport = {
  id: 'report-sample-ecommerce',
  title: 'E-Commerce Logistics & Delivery Rush Report',
  createdAt: '2026-12-16 09:30 AM',
  rawTextLength: 3420,
  totalReviewsAnalyzed: 18,
  scenarioName: 'E-Commerce Logistics & Delivery Rush',
  overview: {
    healthScore: 68,
    npsEstimate: 12,
    positiveCount: 8,
    neutralCount: 3,
    negativeCount: 7,
    averageRating: 3.3
  },
  timeline: [
    { date: 'Nov 02 - Nov 08', positive: 3, neutral: 1, negative: 0, avgScore: 88, total: 4, keyHighlight: 'Pristine packaging, 48hr delivery praise' },
    { date: 'Nov 09 - Nov 16', positive: 2, neutral: 0, negative: 1, avgScore: 74, total: 3, keyHighlight: 'First crushed box report; carrier handling slips' },
    { date: 'Nov 17 - Nov 24', positive: 1, neutral: 1, negative: 0, avgScore: 72, total: 2, keyHighlight: 'Shipping lead times stretching to 8 days' },
    { date: 'Nov 25 - Dec 01', positive: 0, neutral: 0, negative: 3, avgScore: 28, total: 3, keyHighlight: 'Black Friday carrier tracking blackouts & missing parcels' },
    { date: 'Dec 02 - Dec 08', positive: 1, neutral: 1, negative: 2, avgScore: 45, total: 4, keyHighlight: 'Expedited deliveries missing birthday deadlines' },
    { date: 'Dec 09 - Dec 15', positive: 1, neutral: 0, negative: 1, avgScore: 50, total: 2, keyHighlight: 'Porch camera disputes & carrier unresponsiveness' }
  ],
  wordCloud: {
    praises: [
      { id: 'p1', text: 'Fast Delivery', count: 6, type: 'praise', category: 'Speed', sentimentScore: 94, exampleQuote: 'Received shipping confirmation within 2 hours... delivery took just 48 hours.' },
      { id: 'p2', text: 'Eco Packaging', count: 4, type: 'praise', category: 'Packaging', sentimentScore: 92, exampleQuote: 'The eco-friendly carton was beautifully sealed and my ceramics were completely safe.' },
      { id: 'p3', text: 'Polite Support', count: 4, type: 'praise', category: 'Service', sentimentScore: 86, exampleQuote: 'Customer support was polite and handled the replacement smoothly.' },
      { id: 'p4', text: 'Item Quality', count: 5, type: 'praise', category: 'Product', sentimentScore: 96, exampleQuote: 'Item quality is superb as usual and exceeded expectations.' },
      { id: 'p5', text: 'Doorstep Care', count: 3, type: 'praise', category: 'Delivery', sentimentScore: 90, exampleQuote: 'Courier rang doorbell and placed safely behind porch pillar out of rain.' },
      { id: 'p6', text: 'Prompt Refund', count: 3, type: 'praise', category: 'Service', sentimentScore: 88, exampleQuote: 'Customer support refunded promptly when glass broke.' }
    ],
    complaints: [
      { id: 'c1', text: 'Tracking Blackout', count: 6, type: 'complaint', category: 'Tracking', sentimentScore: 18, exampleQuote: 'Tracking status had zero scans for 72 hours with no status updates.' },
      { id: 'c2', text: 'Crushed Boxes', count: 4, type: 'complaint', category: 'Packaging', sentimentScore: 22, exampleQuote: 'Package arrived with outer box crushed and damp from sloppy carrier handling.' },
      { id: 'c3', text: 'False Delivery Scans', count: 4, type: 'complaint', category: 'Accuracy', sentimentScore: 12, exampleQuote: 'Tracking stated Delivered to front door, but security camera showed no truck arrived.' },
      { id: 'c4', text: 'Expedited Delays', count: 3, type: 'complaint', category: 'Fulfillment', sentimentScore: 20, exampleQuote: 'Ordered expedited 2-day delivery... arrived on day 6 and ruined the birthday surprise.' },
      { id: 'c5', text: 'Thrown Over Fence', count: 2, type: 'complaint', category: 'Handling', sentimentScore: 8, exampleQuote: 'Driver tossed parcel over 6-foot fence onto concrete, breaking items inside.' }
    ]
  },
  executiveSummary: {
    headline: 'Carrier Hand-Off Vulnerabilities Threaten Q4 Customer Retention Despite Strong Core Product Affection',
    narrative: 'Customer sentiment fell sharply from 88/100 in early November to a low of 28/100 following Thanksgiving logistics strain. While product satisfaction and unboxing presentation remain very strong (positive rating: 94%+), courier carrier transparency and false "Delivered" scans account for 74% of 1-star reviews.',
    healthScore: 68,
    npsEstimate: 12,
    positiveRatio: 44,
    neutralRatio: 17,
    negativeRatio: 39,
    top3ActionAreas: [
      {
        id: 'action-1',
        title: 'Mandate Carrier Photo-Proof of Delivery & Real-Time GPS Geofencing',
        priority: 'Critical',
        category: 'Carrier Quality & SLA',
        problemDescription: 'Multiple customers reported orders prematurely scanned as "Delivered" when security footage showed couriers did not arrive, leading to severe trust erosion and manual refund overhead.',
        rootCause: 'Carrier drivers pre-marking route batches as delivered to meet aggressive end-of-day quotas before physical doorstep handoff.',
        recommendation: 'Enforce mandatory photo delivery verification via webhook API before updating user order status. Route packages with regional couriers that provide geostamped scan validation.',
        expectedImpact: 'Eliminates up to 60% of false-delivery customer disputes and reduces support refund ticket escalations.',
        kpiTarget: 'Reduce false "Delivered" claims from 22% to under 2.5% within 30 days.',
        representativeQuotes: [
          '"Tracking stated Delivered to front door on Friday night, but security camera shows no courier truck even drove down our street!"',
          '"Missing parcel #91823. Tracking says delivered at 3:15 PM, porch camera shows empty porch."'
        ]
      },
      {
        id: 'action-2',
        title: 'Implement Automated Tracking Anomaly Alerts & Proactive Customer Outreach',
        priority: 'High',
        category: 'Proactive CX',
        problemDescription: 'Shipments stalled for 48-72 hours with "In Transit" status leave buyers feeling abandoned, prompting angry public reviews and expedited re-order demands.',
        rootCause: 'Absence of automated tracking monitors flaggings for delayed courier hub scans.',
        recommendation: 'Deploy an automated webhook listener that triggers an email/SMS status update to the buyer if a shipment has zero carrier scans for >36 hours, offering an automated shipping fee refund or concierge priority tracking.',
        expectedImpact: 'Transforms negative anxiety into brand goodwill, cutting support inbound contact rates by 35%.',
        kpiTarget: 'Proactive outreach on 100% of shipments stalled >36 hours.',
        representativeQuotes: [
          '"Tracking status had zero scans for 72 hours. Completely ruined the birthday surprise."',
          '"Tracking showed In Transit for four days with no scan updates."'
        ]
      },
      {
        id: 'action-3',
        title: 'Upgrade Carton Corner Reinforcement & Fragile-Item Tape Specs',
        priority: 'Medium',
        category: 'Warehouse Packaging',
        problemDescription: 'A significant minority of reviews highlighted damp, crushed exterior cartons and broken internal glass items due to rough transit.',
        rootCause: 'Single-wall corrugated cartons and non-reinforced paper tape lack puncture resistance under holiday multi-package stacking pressures.',
        recommendation: 'Switch fragile product orders to 32 ECT double-wall cartons with water-activated fiberglass-reinforced tape and expanded molded pulp corners.',
        expectedImpact: 'Prevents transit damage claims and protects pristine unboxing aesthetic.',
        kpiTarget: 'Lower transit damage rate from 4.8% to <0.8%.',
        representativeQuotes: [
          '"Package arrived with outer box crushed and damp... courier handling was noticeably sloppy."',
          '"Driver tossed the parcel over our 6-foot fence onto concrete! Glass jar shattered inside."'
        ]
      }
    ],
    positiveHighlights: [
      'Customers consistently adore the product quality, ceramics aesthetic, and unboxing beauty.',
      'Customer support team received high praise for courteous tone and fast refund resolution when courier errors occurred.',
      'Early November standard shipments arrived within 48 hours, earning spontaneous 5-star ratings.'
    ],
    keyRiskFactors: [
      'Carrier tracking blackouts during peak volume weeks severely damage buyer trust.',
      'Expedited shipping chargebacks when 2-day paid orders arrive on Day 6.'
    ]
  },
  reviews: [
    { id: 'rev-1', date: '2026-11-02', author: 'Maya Lin', rating: 5, text: 'Ordered on Tuesday, arrived Thursday morning in pristine condition! The eco-friendly carton was beautifully sealed and my ceramics were completely safe. Top notch fulfillment.', sentiment: 'positive', score: 98, category: 'Packaging & Fulfillment' },
    { id: 'rev-2', date: '2026-11-05', author: 'Marcus Vance', rating: 4, text: 'Item quality is superb as usual. Tracking notification was about 6 hours delayed from actual doorstep drop-off, but overall very happy with the quick delivery.', sentiment: 'positive', score: 82, category: 'Product & Delivery' },
    { id: 'rev-3', date: '2026-11-09', author: 'Chloe Bennett', rating: 5, text: 'Super fast shipping and love the packaging! Everything arrived fresh and neat. Will definitely order again for holiday gifts.', sentiment: 'positive', score: 96, category: 'Shipping' },
    { id: 'rev-4', date: '2026-11-12', author: 'David Ross', rating: 2, text: 'Package arrived with the outer box crushed and damp. Luckily the product inside was intact, but carrier handling was noticeably sloppy. Please use sturdier tape.', sentiment: 'negative', score: 32, category: 'Transit Damage', flaggedIssue: 'Crushed carton' },
    { id: 'rev-5', date: '2026-11-15', author: 'Elena Rostova', rating: 5, text: 'Flawless delivery! Courier rang the doorbell and placed it safely behind the porch pillar out of the rain. Impressed with the attention to detail.', sentiment: 'positive', score: 95, category: 'Carrier Courtesy' },
    { id: 'rev-6', date: '2026-11-18', author: 'Jordan Taylor', rating: 3, text: 'Standard shipping took 8 days instead of the promised 3-4 days. Support was courteous when I messaged them, but automated tracking showed "In Transit" for four days with no scan updates.', sentiment: 'neutral', score: 55, category: 'Delay & Tracking', flaggedIssue: 'Stalled tracking' },
    { id: 'rev-7', date: '2026-11-21', author: 'Samantha Wu', rating: 5, text: 'Great purchase experience. Fast delivery, beautifully boxed, and the product exceeded expectations.', sentiment: 'positive', score: 94, category: 'Product Quality' },
    { id: 'rev-8', date: '2026-11-25', author: 'Tariq Al-Mansoor', rating: 1, text: 'Order #74821 tracking stated "Delivered to front door" on Friday night, but absolutely nothing was there. Checked security camera and no carrier truck even drove down our street! Now waiting on refund investigation.', sentiment: 'negative', score: 10, category: 'Missing Parcel', flaggedIssue: 'False delivery scan' },
    { id: 'rev-9', date: '2026-11-27', author: 'Rachel Adams', rating: 2, text: 'Courier marked delivery as attempted because of "gate code required" even though my account notes clearly provided the gate code. Delayed my order by three days.', sentiment: 'negative', score: 28, category: 'Carrier Failure', flaggedIssue: 'Gate code ignored' },
    { id: 'rev-10', date: '2026-11-30', author: 'Liam O\'Connor', rating: 1, text: 'Horrible courier experience. Driver tossed the parcel over our 6-foot fence onto concrete! Glass jar shattered inside. Customer support refunded promptly, but courier partner needs accountability.', sentiment: 'negative', score: 14, category: 'Property Damage', flaggedIssue: 'Tossed parcel / broken glass' },
    { id: 'rev-11', date: '2026-12-02', author: 'Sophia Chen', rating: 4, text: 'Good product, reasonable delivery time. Outer cardboard had a puncture mark, but bubble wrap saved the day.', sentiment: 'neutral', score: 68, category: 'Packaging' },
    { id: 'rev-12', date: '2026-12-04', author: 'Kevin Patel', rating: 1, text: 'Ordered expedited 2-day delivery for a birthday present. Arrived on day 6. Tracking status had zero scans for 72 hours. Completely ruined the birthday surprise.', sentiment: 'negative', score: 12, category: 'Expedited SLA Breach', flaggedIssue: 'Expedited delayed 4 days' },
    { id: 'rev-13', date: '2026-12-06', author: 'Brian Miller', rating: 5, text: 'Fast dispatch! Received shipping confirmation within 2 hours of checkout and delivery took just 48 hours. Excellent speed.', sentiment: 'positive', score: 96, category: 'Fulfillment' },
    { id: 'rev-14', date: '2026-12-08', author: 'Jessica Hall', rating: 2, text: 'The tracking portal showed "Out for delivery" three days in a row before actually arriving. Customer support was polite, but carrier reliability during December is crumbling.', sentiment: 'negative', score: 30, category: 'Carrier Reliability', flaggedIssue: 'Out for delivery looping' },
    { id: 'rev-15', date: '2026-12-10', author: 'Daniel Kim', rating: 1, text: 'Missing parcel #91823. Tracking says delivered at 3:15 PM, porch camera shows empty porch. Carrier customer service was unhelpful. Waiting on merchant refund.', sentiment: 'negative', score: 15, category: 'Missing Parcel', flaggedIssue: 'Missing parcel dispute' },
    { id: 'rev-16', date: '2026-12-12', author: 'Natalie Garcia', rating: 4, text: 'Product is wonderful. Shipping took a little longer than November orders, which is understandable for peak season, but clear communication would help.', sentiment: 'neutral', score: 65, category: 'Peak Delays' },
    { id: 'rev-17', date: '2026-12-14', author: 'Thomas Wright', rating: 5, text: 'Driver took a clear photo of delivery location right next to our back patio door as requested. Flawless service!', sentiment: 'positive', score: 95, category: 'Delivery Care' },
    { id: 'rev-18', date: '2026-12-15', author: 'Hannah Scott', rating: 2, text: 'Delayed shipment and crushed box corners. Support team handled the replacement smoothly, but the carrier handoff is definitely the weak link.', sentiment: 'negative', score: 34, category: 'Carrier Handoff', flaggedIssue: 'Crushed box / delay' }
  ]
};
