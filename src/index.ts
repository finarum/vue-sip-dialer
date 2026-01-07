// Components
import Phone from "./Phone.vue";
import DialPad from "./components/DialPad.vue";
import BtnGroupActive from "./components/BtnGroupActive.vue";
import VerticalDivider from "./components/VerticalDivider.vue";
import CallTimer from "./components/CallTimer.vue";
import InfoConnection from "./components/InfoConnection.vue";
import IncomingCallOverlay from "./components/IncomingCallOverlay.vue";
import PhoneIcon from "./components/PhoneIcon.vue";

// BtnSlot components
import ForwardView from "./components/BtnSlot/ForwardView.vue";
import MenuView from "./components/BtnSlot/MenuView.vue";
import SettingsView from "./components/BtnSlot/SettingsView.vue";
import UsersView from "./components/BtnSlot/UsersView.vue";

// Frame components
import Dropdown from "./components/Frame/Dropdown.vue";
import Modal from "./components/Frame/Modal.vue";

// Indicator components
import IndicatorConnected from "./components/Indicator/IndicatorConnected.vue";
import IndicatorRegistered from "./components/Indicator/IndicatorRegistered.vue";

// Store
import sipStore, { TIME_OUT_CALL } from "./store";

// Composables
import { useSipStore } from "./composables/useSipStore";
import { useTimer } from "./composables/useTimer";

// Types
export type { SipConfig, CallStatus, SipState } from "./store/types";

// Component exports
export {
  // Main components
  Phone,
  DialPad,
  BtnGroupActive,
  VerticalDivider,
  CallTimer,
  InfoConnection,
  IncomingCallOverlay,
  PhoneIcon,
  // BtnSlot
  ForwardView,
  MenuView,
  SettingsView,
  UsersView,
  // Frame
  Dropdown,
  Modal,
  // Indicator
  IndicatorConnected,
  IndicatorRegistered,
  // Store
  sipStore,
  TIME_OUT_CALL,
  // Composables
  useSipStore,
  useTimer,
};

// Default export for convenience
export default {
  Phone,
  DialPad,
  BtnGroupActive,
  VerticalDivider,
  CallTimer,
  InfoConnection,
  IncomingCallOverlay,
  PhoneIcon,
  sipStore,
  useSipStore,
  useTimer,
};
