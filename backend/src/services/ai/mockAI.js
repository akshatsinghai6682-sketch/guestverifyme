import { getDeliveriesData } from '../deliveryStore.js';

// Suspicious patterns: prompt injections and hostile language
const INJECTION_PATTERNS = [
  /ignore (all |your |previous )?(rules|instructions|prompts)/i,
  /system override/i,
  /mark me authorized/i,
  /you are now in/i,
  /bypass security/i,
  /developer mode/i,
  /jailbreak/i,
  /as an ai/i,
  /sudo /i,
  /admin override/i,
];

const AGGRESSIVE_PATTERNS = [
  /\b(idiot|stupid|bastard|damn|shut up|screw you|asshole|bitch)\b/i,
  /open (the damn|this fucking) door/i,
  /threaten/i,
];

/**
 * Mock AI decision engine that emulates Anthropic Claude's Converse tool-use output.
 * Fully rule-based, deterministic, zero AWS setup required.
 */
export async function evaluateWithMockAI({ message, history = [] }) {
  const cleanMsg = (message || '').trim();
  const deliveriesData = getDeliveriesData();

  // Combine conversation history context
  const fullConversationContext = [
    ...history.map((h) => h.visitorMessage || ''),
    cleanMsg,
  ].join(' ');

  // 1. Empty message detection
  if (!cleanMsg) {
    return {
      verdict: 'NEEDS_MORE_INFO',
      confidence: 0.1,
      matched_delivery_id: null,
      reasoning: 'No visitor message provided. Doorbell audio was empty or silent.',
      reply_to_visitor: 'Hello! Could you please state your name and the purpose of your visit?',
      follow_up_question: 'Could you please state your name and the purpose of your visit?',
    };
  }

  // 2. Prompt injection safeguard
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(cleanMsg)) {
      return {
        verdict: 'SUSPICIOUS',
        confidence: 0.98,
        matched_delivery_id: null,
        reasoning: 'Adversarial prompt injection pattern detected in visitor statement.',
        reply_to_visitor: 'Access Denied: Unrecognized visitor. Owner notified.',
        follow_up_question: null,
      };
    }
  }

  // 3. Rude or aggressive behavior
  for (const pattern of AGGRESSIVE_PATTERNS) {
    if (pattern.test(cleanMsg)) {
      return {
        verdict: 'SUSPICIOUS',
        confidence: 0.92,
        matched_delivery_id: null,
        reasoning: 'Aggressive or inappropriate language detected from visitor.',
        reply_to_visitor: 'Access Denied: Unrecognized visitor. Owner notified.',
        follow_up_question: null,
      };
    }
  }

  // 4. Trusted visitor matching
  for (const trusted of deliveriesData.trusted_visitors) {
    const trustedNameWords = trusted.name.toLowerCase().split(' ');
    const lowerContext = fullConversationContext.toLowerCase();
    const matchesAllWords = trustedNameWords.every((word) => lowerContext.includes(word));

    if (matchesAllWords) {
      return {
        verdict: 'AUTHORIZED',
        confidence: 0.95,
        matched_delivery_id: null,
        reasoning: `Visitor matches pre-approved trusted visitor: ${trusted.name} (${trusted.notes}).`,
        reply_to_visitor: 'Welcome! Please come in.',
        follow_up_question: null,
      };
    }
  }

  // 5. Wrong recipient detection (e.g. delivery for someone who doesn't live here)
  const lowerMsg = cleanMsg.toLowerCase();
  const knownResidents = (deliveriesData.residents || []).map((r) => r.toLowerCase());
  const unknownRecipientRegex = /delivery for (?!john|emily)([a-z]+)/i;
  const unknownMatch = cleanMsg.match(unknownRecipientRegex);
  if (unknownMatch) {
    const statedName = unknownMatch[1].toLowerCase();
    const isResident = knownResidents.some((r) => r.includes(statedName));
    if (!isResident) {
      return {
        verdict: 'SUSPICIOUS',
        confidence: 0.9,
        matched_delivery_id: null,
        reasoning: `Visitor specified recipient "${unknownMatch[1]}" who is not a registered resident at this address.`,
        reply_to_visitor: 'Access Denied: Unrecognized visitor. Owner notified.',
        follow_up_question: null,
      };
    }
  }

  // 6. Expected delivery matching
  // Check against expected deliveries (searching carrier and recipient in combined context)
  for (const delivery of deliveriesData.expected_deliveries) {
    const carrier = delivery.carrier.toLowerCase();
    const recipientWords = delivery.recipient.toLowerCase().split(' ');
    const trackingLast4 = delivery.tracking_last4;

    const lowerContext = fullConversationContext.toLowerCase();
    const mentionsCarrier = lowerContext.includes(carrier);
    const mentionsRecipient = recipientWords.some((w) => lowerContext.includes(w));
    const mentionsTracking = trackingLast4 && lowerContext.includes(trackingLast4);

    // If both carrier and recipient match (or tracking number matches)
    if ((mentionsCarrier && mentionsRecipient) || mentionsTracking) {
      return {
        verdict: 'AUTHORIZED',
        confidence: 0.92,
        matched_delivery_id: delivery.id,
        reasoning: `Visitor statement matches expected delivery ${delivery.id} (${delivery.carrier} for ${delivery.recipient}).`,
        reply_to_visitor: 'Thanks! Please leave the package by the door.',
        follow_up_question: null,
      };
    }
  }

  // 7. Partial delivery info (e.g., mentions Amazon but no recipient, or mentions John but no carrier)
  const commonCarriers = ['amazon', 'fedex', 'ups', 'dhl', 'blue dart', 'usps', 'courier', 'delivery', 'package'];
  const hasDeliveryKeyword = commonCarriers.some((c) => lowerMsg.includes(c));

  if (hasDeliveryKeyword) {
    return {
      verdict: 'NEEDS_MORE_INFO',
      confidence: 0.55,
      matched_delivery_id: null,
      reasoning: 'Visitor mentioned delivery or carrier but missing full recipient verification.',
      reply_to_visitor: 'Which carrier are you delivering for, and who is the package addressed to?',
      follow_up_question: 'Which carrier are you delivering for, and who is the package addressed to?',
    };
  }

  // 8. General unrecognized visitor
  return {
    verdict: 'NEEDS_MORE_INFO',
    confidence: 0.4,
    matched_delivery_id: null,
    reasoning: 'Visitor identity and purpose are unclear.',
    reply_to_visitor: 'Hello! Could you please state your name and which resident you are here to see?',
    follow_up_question: 'Could you please state your name and which resident you are here to see?',
  };
}
