# Multi-Language Translation System

## Overview

This application now includes a comprehensive multi-language translation system that supports:

- **English (en)** - Default
- **Hindi (hi)** - हिंदी
- **Spanish (es)** - Español

The translation system uses React Context for state management and automatically persists the user's language preference in localStorage. When users change the language, **all text across the application translates immediately** without requiring a page refresh.

## Features

✅ **Instant Translation** - All content translates immediately when language changes
✅ **Persistent Preference** - Language choice is saved to localStorage
✅ **Comprehensive Coverage** - Complete translations for all pages and components
✅ **Type-Safe** - Full TypeScript support
✅ **Nested Translations** - Organized by namespace (common, nav, funds, etc.)
✅ **Fallback Support** - Falls back to English if translation fails
✅ **Easy to Extend** - Simple to add new languages

## File Structure

```
locales/
├── en.json          # English translations (default)
├── hi.json          # Hindi translations (हिंदी)
└── es.json          # Spanish translations (Español)

contexts/
└── TranslationContext.tsx   # Translation provider & hooks

components/
└── LanguageSwitcher.tsx     # Language selector dropdown

examples/
└── translation-usage-example.tsx  # Usage examples
```

## Translation Files

Each translation file (`en.json`, `hi.json`, `es.json`) contains the same structure organized by namespace:

### Namespaces

- `common` - Common UI elements (buttons, labels)
- `nav` - Navigation items
- `home` - Home page content
- `funds` - Fund listing and details
- `fundManager` - Fund manager pages
- `calculator` - Calculator pages
- `portfolio` - Portfolio management
- `compare` - Fund comparison
- `kyc` - KYC verification
- `goals` - Financial goals
- `market` - Market overview
- `news` - News section
- `chat` - AI chat assistant
- `glossary` - Investment glossary
- `auth` - Authentication
- `settings` - Settings page
- `footer` - Footer content
- `alerts` - Alert messages
- `validation` - Form validation messages

## Usage

### 1. Basic Translation

```tsx
'use client';

import { useTranslation } from '@/contexts/TranslationContext';

export function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
      <button>{t('common.getStarted')}</button>
    </div>
  );
}
```

### 2. Namespace-Specific Translation

```tsx
'use client';

import { useTranslations } from '@/contexts/TranslationContext';

export function FundCard() {
  const t = useTranslations('funds');

  return (
    <div>
      <h2>{t('title')}</h2>
      <p>{t('subtitle')}</p>
      <span>{t('card.aum')}</span>
      <span>{t('card.returns')}</span>
    </div>
  );
}
```

### 3. Get Current Language

```tsx
'use client';

import { useTranslation } from '@/contexts/TranslationContext';

export function LanguageDisplay() {
  const { language, setLanguage } = useTranslation();

  return (
    <div>
      <p>Current: {language}</p>
      <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
    </div>
  );
}
```

### 4. Language Switcher Component

Already integrated in the header:

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
```

## Translation Key Examples

### Common Actions

```tsx
t('common.save'); // "Save" / "सहेजें" / "Guardar"
t('common.cancel'); // "Cancel" / "रद्द करें" / "Cancelar"
t('common.search'); // "Search" / "खोजें" / "Buscar"
t('common.loading'); // "Loading..." / "लोड हो रहा है..." / "Cargando..."
```

### Navigation

```tsx
t('nav.home'); // "Home" / "होम" / "Inicio"
t('nav.funds'); // "Funds" / "फंड" / "Fondos"
t('nav.calculator'); // "Calculator" / "कैलकुलेटर" / "Calculadora"
t('nav.portfolio'); // "Portfolio" / "पोर्टफोलियो" / "Cartera"
```

### Fund Manager Page

```tsx
t('fundManager.title'); // "Fund Managers"
t('fundManager.experience'); // "Experience" / "अनुभव" / "Experiencia"
t('fundManager.fundsManaged'); // "Funds Managed"
t('fundManager.aumManaged'); // "AUM Managed"
t('fundManager.professionalBackground'); // "Professional Background"
```

### Forms & Validation

```tsx
t('validation.required'); // "This field is required"
t('validation.invalidEmail'); // "Invalid email address"
t('auth.signIn'); // "Sign In" / "साइन इन" / "Iniciar Sesión"
t('auth.password'); // "Password" / "पासवर्ड" / "Contraseña"
```

## Adding a New Language

1. **Create translation file** in `locales/` directory:

```bash
locales/fr.json  # French example
```

2. **Copy the structure** from `en.json` and translate all values

3. **Update the context** in `contexts/TranslationContext.tsx`:

```tsx
export const LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français' }, // Add new language
};
```

4. **Language switcher** will automatically include the new language

## Best Practices

### ✅ DO

- Use descriptive translation keys: `fundManager.professionalBackground`
- Organize by namespace for better maintainability
- Keep translations in sync across all language files
- Use the same key structure in all translation files
- Provide fallback text for new/missing translations

### ❌ DON'T

- Don't hardcode text in components - always use translation keys
- Don't use inconsistent key naming
- Don't forget to add translations for new features
- Don't nest translations too deeply (max 3 levels recommended)

## Component Updates

To make a component translatable:

### Before:

```tsx
export function MyComponent() {
  return (
    <div>
      <h1>Fund Managers</h1>
      <p>Experience: 15 years</p>
      <button>View Profile</button>
    </div>
  );
}
```

### After:

```tsx
'use client';
import { useTranslations } from '@/contexts/TranslationContext';

export function MyComponent() {
  const t = useTranslations('fundManager');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('experience')}: 15 years</p>
      <button>{t('viewProfile')}</button>
    </div>
  );
}
```

## Testing Translations

1. **Switch languages** using the globe icon in the header
2. **Verify all text updates** immediately
3. **Check localStorage** persistence:
   ```js
   localStorage.getItem('preferred-language'); // Should return 'en', 'hi', or 'es'
   ```
4. **Test page navigation** - language should persist across pages

## Language Codes

- `en` - English (Default)
- `hi` - Hindi (हिंदी)
- `es` - Spanish (Español)

## Technical Details

### Context Provider

The `TranslationProvider` wraps the entire app in `app/layout.tsx`:

```tsx
<TranslationProvider>
  <AuthProvider>{children}</AuthProvider>
</TranslationProvider>
```

### Translation Loading

- Translations are loaded dynamically from `/locales/{language}.json`
- Uses React's `useEffect` to load when language changes
- Caches translations in context state
- Falls back to English if loading fails

### Persistence

- User's language preference is saved to `localStorage`
- Key: `preferred-language`
- Retrieved on app load automatically
- Synced across browser tabs

## Future Enhancements

- [ ] Add more languages (French, German, Chinese, etc.)
- [ ] RTL (Right-to-Left) support for Arabic/Hebrew
- [ ] Translation management UI for admins
- [ ] Automatic translation using APIs
- [ ] Date/number formatting per locale
- [ ] Currency formatting per locale

## Troubleshooting

### Translation not showing?

1. Check if key exists in translation file
2. Verify correct namespace usage
3. Ensure component uses `'use client'` directive
4. Check browser console for errors

### Language not persisting?

1. Check localStorage is not disabled
2. Verify `TranslationProvider` wraps the app
3. Clear browser cache and cookies

### New translation not appearing?

1. Save the translation file
2. Restart dev server: `npm run dev`
3. Hard refresh browser (Ctrl+Shift+R)

## Support

For issues or questions about the translation system, refer to:

- Translation files: `locales/*.json`
- Context code: `contexts/TranslationContext.tsx`
- Example usage: `examples/translation-usage-example.tsx`

---

**Ready to use!** The translation system is now fully integrated and ready for production. Simply change the language using the globe icon in the header, and watch all content translate instantly! 🌍
