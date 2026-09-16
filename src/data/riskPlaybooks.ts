export interface RiskPlaybook {
  riskTitle: string;
  severity: 'Critical' | 'High' | 'Moderate';
  category: 'Logistics SLA' | 'Customer Trust' | 'Payment & Chargebacks' | 'Support Capacity';
  metricsImpact: {
    npsImpact: string;
    chargebackRisk: string;
    repeatPurchaseDrop: string;
  };
  rootCauses: string[];
  immediateActionPlan: {
    step: string;
    owner: string;
    sla: string;
  }[];
  automatedMitigationRule: string;
  customerApologyTemplate: string;
}

export const RISK_PLAYBOOKS: Record<string, RiskPlaybook> = {
  'Carrier tracking blackouts during peak volume weeks severely damage buyer trust.': {
    riskTitle: 'Carrier tracking blackouts during peak volume weeks severely damage buyer trust.',
    severity: 'Critical',
    category: 'Customer Trust',
    metricsImpact: {
      npsImpact: '-18 points on post-purchase surveys',
      chargebackRisk: '4.2x increase in "Order Not Received" inquiries',
      repeatPurchaseDrop: '-22% 60-day re-order probability',
    },
    rootCauses: [
      'Regional carrier sorting hubs scan parcels into container batches without firing individual EDI 214 / API webhook event pings.',
      'Customer-facing order status pages lack predictive estimated delivery time (EDD) ranges when status is "Label Created" or "In Transit" > 36 hours.',
      'Siloed notifications: buyers receive zero proactive check-ins until they open an escalation ticket or file a dispute with their bank.',
    ],
    immediateActionPlan: [
      {
        step: 'Deploy 36-Hour Stalled Transit Webhook Trigger: Flag any package without physical checkpoint scans within 36 hours of dispatch.',
        owner: 'Logistics Engineering',
        sla: '24 Hours',
      },
      {
        step: 'Automate Proactive Micro-Updates: Send automated SMS/email informing the buyer that their order is actively on the carrier line-haul truck before they notice the tracking freeze.',
        owner: 'CRM & Communications',
        sla: 'Immediate',
      },
      {
        step: 'Multi-Carrier Failover Routing: Re-route high-density delivery zip codes from overloaded regional hubs to priority national carriers.',
        owner: 'Fulfillment Operations',
        sla: '48 Hours',
      },
    ],
    automatedMitigationRule: 'IF (current_time - last_scan_timestamp > 36h) THEN trigger ProactiveTransitCheckinEmail() AND issue $10 courtesy credit towards next order.',
    customerApologyTemplate: 'Hi {{customer_name}}, we noticed your package #{{order_id}} has been delayed at the regional transfer center. You do not need to do anything—our logistics team is tracking it actively. Here is a $10 credit as a token of our appreciation for your patience.',
  },
  'Expedited shipping chargebacks when 2-day paid orders arrive on Day 6.': {
    riskTitle: 'Expedited shipping chargebacks when 2-day paid orders arrive on Day 6.',
    severity: 'Critical',
    category: 'Payment & Chargebacks',
    metricsImpact: {
      npsImpact: '-34 points among paid expedited tier customers',
      chargebackRisk: '$15 fee + $25 merchant bank penalty + inventory loss',
      repeatPurchaseDrop: '-41% lifetime value retention',
    },
    rootCauses: [
      'Customers pay a premium ($15–$25) expecting guaranteed delivery within 48 business hours.',
      'When holiday carrier congestion delays the package to Day 5 or 6, buyers feel cheated and initiate Visa/Mastercard "Service Not Rendered" chargebacks.',
      'Merchants rarely auto-refund the shipping surcharge proactively, forcing the customer into a contentious support confrontation.',
    ],
    immediateActionPlan: [
      {
        step: 'Instant Shipping Surcharge Refund: Automate proactive refund of the $15–$25 expedited shipping fee the second Day 3 starts without a doorstep delivery scan.',
        owner: 'Finance & Payments API',
        sla: 'Immediate / Automated',
      },
      {
        step: 'Carrier SLA Guarantee Clawback: Automatically aggregate all late 2-day parcels and submit batch contractual breach refund claims to FedEx/UPS/DHL.',
        owner: 'Carrier Relations',
        sla: 'Weekly Batch',
      },
      {
        step: 'Dynamic Checkout Delivery Guarantees: Switch checkout promise dates dynamically based on real-time carrier terminal congestion metrics rather than static calendar days.',
        owner: 'Frontend Checkout Team',
        sla: '72 Hours',
      },
    ],
    automatedMitigationRule: 'IF (shipping_tier == "EXPEDITED_2DAY" AND transit_days >= 3 AND status != "DELIVERED") THEN executeStripeRefund(shipping_fee) AND sendNotification("Shipping fee refunded due to carrier delay").',
    customerApologyTemplate: 'Hi {{customer_name}}, we noticed your 2-Day order #{{order_id}} did not arrive within the promised window. While the package is still en route, we have immediately refunded your {{shipping_fee}} shipping surcharge. You should see it back in your account in 2-3 business days.',
  },
};
