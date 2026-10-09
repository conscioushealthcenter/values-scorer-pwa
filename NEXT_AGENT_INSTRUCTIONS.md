# PWA Values Scorer - Next Agent Instructions

## 🎯 **Project Status**
**Location:** `/home/ubuntu/chrome-extension-project`  
**Budget Used:** $1.34 of $15.00 (plenty remaining)  
**Type:** Progressive Web App (PWA) - works on mobile & desktop  
**Foundation:** ✅ COMPLETE - fully converted from Chrome extension

## 📱 **What We Built: PWA Conversion**

✅ **Complete PWA Infrastructure:**
- Web App Manifest (`public/manifest.webmanifest`)
- Service Worker with offline caching (`public/sw.js`)
- Mobile-responsive UI with tab navigation
- Install prompts for "Add to Home Screen"
- iOS Safari + Android Chrome compatible

✅ **Technical Foundation:**
- TypeScript + React + Vite (no more Chrome extension APIs)
- IndexedDB storage layer (same privacy-first approach)
- Values framework (10 values quiz: Personal Growth, Mental Health, etc.)
- Mobile-optimized UI (44px touch targets, safe areas)

✅ **PWA Features Working:**
- **Offline Support** - service worker caches app shell
- **Installable** - can be added to phone home screen  
- **Responsive** - works on mobile and desktop
- **Fast** - precached resources load instantly

## 🔥 **What's Still Missing (Your Focus)**

### **1. Manual Post Input System (HIGH PRIORITY)**
Since PWAs can't inject into Facebook like browser extensions, we need:

**User Flow:**
1. User copies a Facebook post 
2. Pastes it into our PWA
3. AI scores it against their values
4. Shows alignment badge/score

**Files to Create:**
```
src/app/components/PostInput.tsx     ← Paste text area + submit
src/app/services/scoring.ts         ← AI API calls (OpenAI/Anthropic)  
src/app/utils/postParser.ts         ← Extract author, clean text
```

### **2. AI Scoring Pipeline (CORE FEATURE)**
**Same logic as Chrome extension plan:**
- Batch multiple posts for efficiency
- Call user's AI API (OpenAI or Anthropic) 
- Prompt: "Score alignment with user values: [valuesVector]"
- Return: `{alignment_score: 0-100, brief_reason: "..."}`
- Store in IndexedDB with timestamp

**API Integration Notes:**
- **OpenAI:** `Authorization: Bearer ${apiKey}`
- **Anthropic:** `x-api-key: ${apiKey}` + `anthropic-dangerous-direct-browser-access: true`
- Handle rate limits, errors, cost caps

### **3. Real Dashboard Analytics**
Replace Chart.js placeholder with:
- Weekly alignment trends
- Per-value breakdowns  
- "Most/least aligned" post examples
- Daily/weekly averages

### **4. Web Share Target (Mobile Enhancement)**
Add to manifest.webmanifest:
```json
"share_target": {
  "action": "/share/",
  "method": "POST", 
  "params": {
    "text": "shared_text"
  }
}
```
Lets users share posts directly from Facebook → our PWA

## 📁 **Key Files & Structure**

```
public/
  manifest.webmanifest     ← PWA configuration
  sw.js                   ← Service worker (offline caching)
  icons/                  ← Placeholder icons (replace with real artwork)

src/app/
  App.tsx                 ← Main app with tab navigation  
  screens/
    Home.tsx              ← Landing page (needs post input)
    Dashboard.tsx         ← Analytics (needs real data)
    Values.tsx            ← Quiz (complete)
    Settings.tsx          ← API key, preferences (complete)

src/db/index.ts          ← IndexedDB layer (same as before)
src/shared/
  types.ts               ← Data structures
  values.ts              ← 10 values framework
```

## 🛠 **Commands & Testing**

```bash
cd ~/chrome-extension-project

# Development  
npm run dev              # http://localhost:5173

# Production build
npm run build            # Creates dist/ 
npx vite preview         # Test built PWA at http://localhost:4173

# Testing
npm test                 # Unit tests (DB layer)

# Icons (placeholder)
node scripts/make-icons.mjs
```

## 📱 **PWA Testing Checklist**

1. **Install Test:**
   - Open in Chrome/Safari on phone
   - Look for "Add to Home Screen" prompt
   - Install and launch from home screen

2. **Offline Test:**
   - Install PWA 
   - Turn off internet
   - App should still load (service worker cache)

3. **Mobile UX:**
   - Touch targets large enough (44px minimum)
   - No horizontal scrolling
   - Safe area insets on iPhone

## 🎯 **Success Criteria**

1. ✅ PWA installs on mobile devices
2. ✅ Manual post input working  
3. ✅ AI scoring functional (OpenAI or Anthropic)
4. ✅ Posts stored with alignment scores
5. ✅ Real dashboard showing trends
6. ✅ Offline functionality working

## 💡 **Facebook Integration Strategy**

**Current Reality:** Facebook blocks iframe embedding (X-Frame-Options)

**Available Options:**
1. **Manual Copy/Paste** (easiest, implement first)
2. **Web Share Target** (Android Chrome only) 
3. **Browser Extension** (back to Chrome-only)
4. **Facebook Graph API** (limited, requires app approval)

**Recommendation:** Start with manual copy/paste, add Web Share Target later.

## 💰 **Budget Remaining: ~$13.66**
Plenty left to complete all features. Focus on the manual post input + AI scoring - that's the core value.

---

**Start Command:** `cd ~/chrome-extension-project && npm run dev`  
**Test PWA:** Build and test installation on a real mobile device  
**Priority:** Manual post input → AI scoring → real dashboard