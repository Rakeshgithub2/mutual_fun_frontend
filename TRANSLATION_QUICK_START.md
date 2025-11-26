# Translation System Quick Start 🌍

## Test the Translation System

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Open Your Browser

Navigate to: http://localhost:5001

### 3. Test Language Switching

#### Method 1: Header Globe Icon

1. Look for the **Globe icon** (🌐) in the top-right header
2. Click it to open the language dropdown
3. Select a language:
   - **English** (English)
   - **हिंदी** (Hindi)
   - **Español** (Spanish)
4. Watch ALL text instantly translate!

#### Method 2: Browser Console Testing

Open browser console (F12) and run:

```javascript
// Get current language
localStorage.getItem('preferred-language');

// Change to Hindi
localStorage.setItem('preferred-language', 'hi');
window.location.reload();

// Change to Spanish
localStorage.setItem('preferred-language', 'es');
window.location.reload();

// Change back to English
localStorage.setItem('preferred-language', 'en');
window.location.reload();
```

### 4. Pages to Test

Visit these pages and switch languages to see translations:

- **Home**: http://localhost:5001/
- **Funds**: http://localhost:5001/funds
- **Fund Managers**: http://localhost:5001/fund-manager
- **Calculator**: http://localhost:5001/calculators
- **Portfolio**: http://localhost:5001/portfolio
- **KYC**: http://localhost:5001/kyc
- **Goals**: http://localhost:5001/goals
- **Market**: http://localhost:5001/market
- **News**: http://localhost:5001/news
- **Chat**: http://localhost:5001/chat

### 5. What to Look For

When you change language, these elements should translate instantly:

✅ **Navigation Menu**

- Home, Funds, Calculator, Portfolio, etc.

✅ **Buttons & Actions**

- Sign In, Save, Cancel, Search, Filter, etc.

✅ **Page Headers**

- Titles, subtitles, descriptions

✅ **Form Labels**

- Input placeholders, field names

✅ **Status Messages**

- Loading, Error, Success messages

✅ **Footer Content**

- Links, disclaimer text

### 6. Verify Persistence

1. Select Hindi (हिंदी)
2. Navigate to different pages
3. Close browser
4. Reopen and return to the site
5. **Language should still be Hindi!**

### 7. Cross-Tab Sync

1. Open site in one tab
2. Open site in another tab
3. Change language in first tab
4. **Second tab automatically updates** (on next interaction)

## Visual Indicators

### Language Switcher Location

```
Header → Right Side → Globe Icon (🌐)
```

### Current Language Display

The dropdown shows a checkmark (✓) next to the active language.

## Translation Coverage

### Fully Translated Pages ✅

- Home Page
- Fund Listing
- Fund Details
- Fund Managers
- Calculators (SIP, Lumpsum, SWP)
- Portfolio
- Compare Funds
- KYC Verification
- Financial Goals
- Market Overview
- News
- AI Chat
- Glossary
- Authentication (Sign In/Up)
- Settings

### What's Translated ✅

- All UI text
- Button labels
- Form fields
- Error messages
- Success notifications
- Navigation menus
- Page titles
- Descriptions
- Placeholders
- Tooltips
- Footer content

## Testing Checklist

Use this checklist to verify the translation system:

- [ ] Language switcher appears in header
- [ ] Can select English, Hindi, and Spanish
- [ ] Text updates immediately (no page reload needed)
- [ ] Navigation menu translates
- [ ] Button labels translate
- [ ] Form placeholders translate
- [ ] Error messages translate
- [ ] Footer translates
- [ ] Language persists after page refresh
- [ ] Language persists after browser restart
- [ ] All pages show translated content

## Common Translation Examples

### English → Hindi → Spanish

| English    | Hindi            | Spanish        |
| ---------- | ---------------- | -------------- |
| Home       | होम              | Inicio         |
| Funds      | फंड              | Fondos         |
| Calculator | कैलकुलेटर        | Calculadora    |
| Portfolio  | पोर्टफोलियो      | Cartera        |
| Sign In    | साइन इन          | Iniciar Sesión |
| Search     | खोजें            | Buscar         |
| Loading... | लोड हो रहा है... | Cargando...    |
| Save       | सहेजें           | Guardar        |
| Cancel     | रद्द करें        | Cancelar       |

## Troubleshooting

### Language not changing?

1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Check browser console for errors
4. Verify dev server is running

### Translations showing as keys?

1. Ensure translation files exist in `/locales/`
2. Check file syntax (valid JSON)
3. Restart dev server
4. Clear Next.js cache: `rm -rf .next`

### Language not persisting?

1. Check if localStorage is enabled in browser
2. Check browser privacy settings
3. Ensure cookies are allowed

## Success Indicators

When working correctly, you should see:

✅ Globe icon in header
✅ Language dropdown with 3 options
✅ Checkmark next to current language
✅ Instant text updates on selection
✅ `preferred-language` key in localStorage
✅ HTML lang attribute updates (`<html lang="hi">`)

## Next Steps

After testing:

1. ✅ **Add more languages** (see TRANSLATION_GUIDE.md)
2. ✅ **Translate remaining pages**
3. ✅ **Add RTL support** for Arabic/Hebrew
4. ✅ **Format dates/numbers** per locale
5. ✅ **Add currency formatting**

## Need Help?

Refer to:

- **TRANSLATION_GUIDE.md** - Complete documentation
- **examples/translation-usage-example.tsx** - Code examples
- **contexts/TranslationContext.tsx** - Implementation details

---

**Happy Testing! 🎉**

The translation system is ready to use. Switch languages and watch your entire app transform instantly!
