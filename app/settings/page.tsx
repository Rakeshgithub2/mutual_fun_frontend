"use client"

import type React from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { useLanguage } from "@/lib/hooks/use-language"
import { useTheme } from "@/lib/hooks/use-theme"
import { useWatchlist } from "@/lib/hooks/use-watchlist"
import { getTranslation } from "@/lib/i18n"
import type { Language } from "@/lib/i18n"

export default function SettingsPage() {
  const { language, changeLanguage, mounted: langMounted } = useLanguage()
  const { isDark, toggleTheme, mounted: themeMounted } = useTheme()
  const { watchlist, mounted: watchlistMounted } = useWatchlist()

  const t = (key: string) => getTranslation(language, key)

  if (!langMounted || !themeMounted || !watchlistMounted) {
    return <div className="flex h-screen items-center justify-center">{t("common.loading")}</div>
  }

  const handleExportWatchlist = () => {
    const data = JSON.stringify({ watchlist, exportDate: new Date().toISOString() }, null, 2)
    const element = document.createElement("a")
    element.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(data))
    element.setAttribute("download", "watchlist.json")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleImportWatchlist = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          localStorage.setItem("watchlist", JSON.stringify(data.watchlist))
          alert("Watchlist imported successfully!")
        } catch {
          alert("Error importing watchlist")
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-lg text-muted">Customize your experience and manage preferences</p>
        </div>

        <div className="space-y-8">
          {/* Appearance Settings */}
          <section className="rounded-lg border border-border bg-card p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Appearance</h2>
              <p className="mt-1 text-sm text-muted">Customize how the app looks</p>
            </div>

            <div className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-background">
                <div>
                  <p className="font-semibold text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted">Toggle between light and dark themes</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    isDark ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      isDark ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Language Settings */}
          <section className="rounded-lg border border-border bg-card p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Language</h2>
              <p className="mt-1 text-sm text-muted">Choose your preferred language</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {(["en", "hi", "kn"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`rounded-lg px-4 py-3 font-medium transition-all ${
                    language === lang
                      ? "bg-primary text-white shadow-lg"
                      : "border border-border hover:border-primary text-foreground hover:bg-background"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 English" : lang === "hi" ? "🇮🇳 हिंदी" : "🇮🇳 ಕನ್ನಡ"}
                </button>
              ))}
            </div>
          </section>

          {/* Watchlist Management */}
          <section className="rounded-lg border border-border bg-card p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Watchlist Management</h2>
              <p className="mt-1 text-sm text-muted">Manage your saved funds</p>
            </div>

            <div className="mb-6 rounded-lg bg-background p-4">
              <p className="text-sm text-muted">
                You have <span className="font-semibold text-foreground">{watchlist.length}</span> fund(s) in your
                watchlist
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleExportWatchlist}
                className="flex-1 rounded-lg border border-border px-4 py-3 font-medium text-foreground hover:bg-background transition-colors"
              >
                📥 Export Watchlist
              </button>
              <label className="flex-1 rounded-lg border border-border px-4 py-3 font-medium text-foreground hover:bg-background transition-colors cursor-pointer text-center">
                📤 Import Watchlist
                <input type="file" accept=".json" onChange={handleImportWatchlist} className="hidden" />
              </label>
            </div>
          </section>

          {/* About Section */}
          <section className="rounded-lg border border-border bg-card p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">About</h2>
              <p className="mt-1 text-sm text-muted">App information and legal</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="rounded-lg bg-background p-4">
                <p className="text-muted">
                  <strong className="text-foreground">App Version:</strong> 1.0.0
                </p>
              </div>
              <div className="rounded-lg bg-background p-4">
                <p className="text-muted">
                  <strong className="text-foreground">Last Updated:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="#" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-primary hover:underline font-medium">
                  Terms of Service
                </Link>
                <Link href="#" className="text-primary hover:underline font-medium">
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 mt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted">
            <p>&copy; 2025 MutualFunds.in. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
