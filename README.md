# Barnaby's Complaint Desk (Window 7) 🏛️👔

A quirky, deadpan 3D bureaucratic web toy built with **Three.js**, **WebGL**, and **Vite**. Citizens step up to Window 7 at the Department of Minor Inconveniences to file official grievances with **Barnaby P. Quibble**, Certified Bureaucrat. Barnaby examines each submission with profound indifference, slams an administrative stamp upon it, and issues a dry, serialized ticket for the Void.

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18+) & npm

### Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

### Automated End-to-End Tests
To run the automated headless browser tests:
```bash
node tests/test-e2e.cjs          # Verifies filing timeline, all 5 outcomes, theme switching, shortcuts, mobile portrait
node tests/test-fallback.cjs     # Confirms in-voice WebGL failure fallback mode
node tests/test-new-features.cjs # Verifies bell, coffee sip, surprise me generator, shredder, void ledger, and slip download
```

---

## 📁 File Structure

```
complaintdesk/
├── index.html          # Main HTML structure: 3D canvas, header, desk toolbar, and complaint form
├── styles.css          # Design tokens, responsive layout, dark/light themes, and drawer animations
├── package.json        # Dependencies (three, vite, puppeteer-core for testing)
├── src/
│   ├── main.js         # Entry point & coordinator for Barnaby, 3D props, audio, and filing flow
│   ├── scene.js        # Three.js setup, camera shake, desk props, raycasting, and theme background
│   ├── clerk.js        # Barnaby 3D model with articulated arms, blinking eyelids, eyebrows, & gestures
│   ├── paper.js        # Form 27-B/6 dynamic canvas texture with official seal, word-wrap, & PNG export
│   ├── stamp.js        # Official government stamp with wood block, brass collar, and squash physics
│   ├── audio.js        # Procedural Web Audio API sound synthesizer (bell, stamp, sip, shred, murmurs)
│   ├── outcomes.js     # The 5 bureaucratic outcomes, dialogue lines, bell/coffee reactions, & complaints
│   └── ui.js           # UI controller: desk toolbar, counter, ledger drawer, slip download, & themes
└── tests/
    ├── test-e2e.cjs          # Automated end-to-end verification suite
    ├── test-fallback.cjs     # Headless test confirming in-voice WebGL failure fallback
    └── test-new-features.cjs # Automated test verifying interactive desk features & slip export
```

---

## ✨ Features & Mechanics

1. **Meet Barnaby P. Quibble (Certified Bureaucrat)**:
   - Constructed from flat-shaded primitives with articulated shoulder, elbow, and wrist joints.
   - Natural, rhythmic eye-blinking every few seconds.
   - Expressive eyebrows that furrow in skepticism, arch high in alarm, or settle into deadpan smugness.
   - Animated mouth that speaks with charming synthesized vocal murmurs.
   - Hands that rest neatly on the wooden counter surface.

2. **Interactive 3D Desk Props (Raycast Clickable & Toolbar Buttons)**:
   - 🔔 **Brass Service Bell**: Click the 3D bell on the desk (or the toolbar button) to ding the bell. The plunger depresses, a crisp brass chime rings, and Barnaby jerks in surprise with an irked bureaucratic retort.
   - ☕ **Ceramic Coffee Mug**: Click the 3D coffee cup with animated rising steam wisps to give Barnaby a sip break. He tilts his head, sips with audio, and delivers deadpan coffee lines.
   - 👔 **Poke Barnaby**: Click directly on Barnaby to poke him. He flinches back, wobbles, and reminds citizens of the 2-foot buffer zone policy.
   - 🎲 **Surprise Me**: Generates quirky, hilarious pre-baked grievances into the 140-char complaint box.
   - ✂️ **Paper Shredder**: Voluntarily shreds the current form into the void with realistic shredding sound effects.

3. **Procedural Web Audio Engine**:
   - Zero external audio files required! 100% synthesized in real time via the Web Audio API.
   - Features crisp bell chimes, heavy wood desk thuds, paper slides, liquid slurps, shredding rustles, and cute bureaucratic vocal blips.
   - Toggleable mute button in the header, persisting across sessions in `localStorage`.

4. **The Void Ledger (Filing Cabinet Drawer)**:
   - A slide-out ledger accessible via the **Ledger** button in the header.
   - Archives previous stamped tickets with their serial number, outcome badge, complaint text, and timestamp.
   - Stored in `localStorage` so previous filings persist between page visits.

5. **Download Stamped Slip (PNG Certificate)**:
   - After Barnaby stamps your complaint, a **Save Slip** button appears on the ticket card.
   - Generates an instant high-resolution PNG image download of your stamped Form 27-B/6 to keep or share.

6. **The 5 Official Bureaucratic Outcomes**:
   - **Rejected**: `"The complaint was too complaining."` (Red)
   - **Escalated to the Department of Nothing**: `"The expected response time is geological."` (Amber)
   - **Approved, pending approval**: `"The approval is being approved by a committee of one."` (Blue)
   - **Lost**: `"The clerk found it and then lost it again, which is the process."` (Purple)
   - **Forwarded to your future self**: `"Expect delivery in several years with no tracking number."` (Green)
