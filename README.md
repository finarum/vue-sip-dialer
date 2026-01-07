# @finarum/sip-phone-dial

A modern, high-quality SIP phone dialer component for Vue 3 applications. Built with JsSIP, Vuex, and Vite.

![SIP Phone Dialer](https://raw.githubusercontent.com/finarum/vue-sip-dialer/main/screenshot.png) <!-- Note: Replace with actual image if available -->

## Features

- **Vue 3 & TypeScript**: Native support for modern Vue applications.
- **Glassmorphism Design**: Premium, modern UI with smooth animations.
- **JsSIP Integration**: Robust SIP handling for reliable VoIP calls.
- **Component-Based**: Exported as reusable components (`Phone`, `DialPad`, etc.).
- **I18n Support**: Ready for internationalization.

## Installation

```bash
npm install @finarum/sip-phone-dial
```

### Peer Dependencies

Ensure you have the following packages installed in your project:

```bash
npm install vue vuex jssip vue-i18n
```

## Setup

### 1. Vuex Store Requirements

The component relies on a specific Vuex module structure. You should register the SIP module in your Vuex store.

```typescript
import { createStore } from 'vuex';
// Note: You may need to export the store logic from the package if it's not internal only
// In the current version, the store logic is bundled.
```

### 2. Styles

Import the CSS in your main entry file:

```javascript
import '@finarum/sip-phone-dial/dist/style.css';
```

## Usage

### Using the `Phone` Component

The `Phone.vue` component provides a complete SIP client UI.

```vue
<script setup>
import { Phone } from '@finarum/sip-phone-dial';
</script>

<template>
  <Phone 
    domain="your-sip-domain.com"
    ws_servers="wss://your-sip-wss-server.com"
    user="1001"
    password="your-password"
    displayName="John Doe"
  />
</template>
```

### API Reference

#### `Phone` Props

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `domain` | `String` | Yes | - | Your SIP domain. |
| `ws_servers` | `String` | Yes | - | WebSocket server URL (e.g., `wss://...`). |
| `user` | `String` | Yes | - | SIP user extension. |
| `password` | `String` | Yes | - | SIP password. |
| `displayName` | `String` | No | `"User"` | Caller ID name. |

## Development

If you want to contribute or modify the package:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## CI/CD

This project uses GitHub Actions for continuous integration and deployment. See [CI-CD.md](CI-CD.md) for details on:

- Automated testing and type checking
- Build verification
- Automatic NPM publishing on releases
- Setting up required secrets

## License

MIT
