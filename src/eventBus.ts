import mitt from 'mitt';

// Define SIP event types for type safety
export type SipEvents = {
  'sip:pause': void;
  'sip:forward': void;
  'sip:keyboard': void;
  'sip:circle': void;
  'sip:users': void;
  'sip:menu': void;
  'sip:mic': void;
  'sip:settings': void;
  'sip:closeOverlay': void;
};

// Create and export the SIP event bus
export const sipBus = mitt<SipEvents>();
