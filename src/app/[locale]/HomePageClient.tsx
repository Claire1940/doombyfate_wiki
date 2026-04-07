'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Coins,
  Copy,
  ExternalLink,
  Gift,
  Map,
  Palette,
  ShoppingCart,
  Shield,
  Skull,
  Sparkles,
  Star,
  Sword,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (linkData) {
    const href = locale === 'en' ? linkData.url : `/${locale}${linkData.url}`
    return (
      <Link
        href={href}
        className={`${className || ''} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    )
  }
  return <>{children}</>
}

// Accordion item for Tix Guide sections
function AccordionItem({ section }: { section: any }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-[hsl(var(--nav-theme)/0.04)] hover:bg-[hsl(var(--nav-theme)/0.08)] transition-colors text-left"
      >
        <div>
          <p className="font-semibold">{section.section}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{section.summary}</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-[hsl(var(--nav-theme-light))] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-border p-4">
          {section.type === 'codes' && (
            <div className="space-y-3">
              {section.entries.map((e: any, i: number) => (
                <div key={i} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-card border border-border">
                  <div>
                    <span className="font-mono text-sm font-bold text-[hsl(var(--nav-theme-light))]">{e.code}</span>
                    <p className="text-sm text-muted-foreground mt-0.5">{e.reward}</p>
                    {e.notes && <p className="text-xs text-muted-foreground mt-1">{e.notes}</p>}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">{e.status}</span>
                </div>
              ))}
            </div>
          )}
          {section.type === 'characters' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.entries.map((e: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-card border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{e.name}</span>
                    <span className="text-xs text-[hsl(var(--nav-theme-light))] font-medium">
                      {e.cost_tix === 0 ? 'Free' : `${e.cost_tix} Tix`}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{e.role || e.tier}</p>
                  <p className="text-xs text-muted-foreground mt-1">{e.why_buy}</p>
                </div>
              ))}
            </div>
          )}
          {section.type === 'paths' && (
            <div className="space-y-2">
              {section.entries.map((e: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border">
                  <span className="text-sm font-bold text-[hsl(var(--nav-theme-light))] shrink-0 w-20 text-right">{e.target_tix} Tix</span>
                  <span className="text-sm text-muted-foreground">{e.plan}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
}

export default function HomePageClient({ latestArticles, moduleLinkMap, locale }: HomePageClientProps) {
  const t = useMessages() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.doombyfate.wiki'

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: "Doom By Fate Wiki",
        description: "Doom By Fate Wiki tracks active codes, killer and survivor guides, tier lists, maps, skins, and update notes for Roblox's asymmetrical horror hit.",
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Doom By Fate - Asymmetrical Roblox Horror",
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: "Doom By Fate Wiki",
        alternateName: "Doom By Fate",
        url: siteUrl,
        description: "Doom By Fate Wiki resource hub for codes, killers, survivors, tier lists, maps, skins, and update guides",
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Doom By Fate Wiki - Asymmetrical Roblox Horror",
        },
        sameAs: [
          'https://www.roblox.com/games/79738202045183/Doom-By-Fate',
          'https://discord.gg/doombyfate',
          'https://www.reddit.com/r/doombyfate/',
          'https://www.youtube.com/@DoomByFateRBLX',
        ],
      },
      {
        '@type': 'VideoGame',
        name: "Doom By Fate",
        gamePlatform: ['Roblox'],
        applicationCategory: 'Game',
        genre: ['Horror', 'Asymmetrical', 'Multiplayer', 'Survival'],
        numberOfPlayers: {
          minValue: 2,
          maxValue: 6,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://www.roblox.com/games/79738202045183/Doom-By-Fate',
        },
      },
    ],
  }

  // Copy feedback state
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => scrollToSection('doom-by-fate-codes')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/79738202045183/Doom-By-Fate"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="oAmFoNVDH0s"
              title="Doom By Fate: Withered Prayer Trailer"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID
              const sectionIds = [
                'doom-by-fate-codes', 'doom-by-fate-tier-list', 'doom-by-fate-survivors', 'doom-by-fate-killers',
                'doom-by-fate-beginner-guide', 'doom-by-fate-maps', 'doom-by-fate-survivors-tier-list', 'doom-by-fate-killers-tier-list',
                'doom-by-fate-tix-guide', 'doom-by-fate-skins', 'doom-by-fate-shop-prices', 'doom-by-fate-update-log'
              ]
              const sectionId = sectionIds[index]

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group p-6 rounded-xl border border-border
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors">
                    <DynamicIcon
                      name={card.icon}
                      className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Doom By Fate Codes */}
      <section id="doom-by-fate-codes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Gift className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">Free Rewards</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['doomByFateCodes']} locale={locale}>
                {t.modules.doomByFateCodes.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.doomByFateCodes.intro}</p>
          </div>

          {/* Redeem Steps */}
          <div className="scroll-reveal mb-10 p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">How to Redeem Doom By Fate Codes</h3>
            </div>
            <ol className="space-y-3">
              {t.modules.doomByFateCodes.redeemSteps.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center text-xs font-bold text-[hsl(var(--nav-theme-light))]">{i + 1}</span>
                  <span className="text-muted-foreground text-sm pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Active Codes */}
          <h3 className="font-bold text-xl mb-4 scroll-reveal">{t.modules.doomByFateCodes.activeTitle}</h3>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {t.modules.doomByFateCodes.items.filter((c: any) => c.status === 'Active').map((code: any, i: number) => (
              <div key={i} className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                    <code className="font-mono font-bold text-[hsl(var(--nav-theme-light))] text-sm break-all">{code.code}</code>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(code.code); setCopiedCode(code.code); setTimeout(() => setCopiedCode(null), 2000) }}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                  >
                    {copiedCode === code.code ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedCode === code.code ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Active</span>
                  <span className="text-sm text-muted-foreground">{code.reward}</span>
                </div>
                {code.highlight && <p className="text-xs text-muted-foreground">{code.highlight}</p>}
              </div>
            ))}
          </div>

          {/* Expired Codes */}
          <h3 className="font-bold text-lg mb-4 scroll-reveal text-muted-foreground">{t.modules.doomByFateCodes.inactiveTitle}</h3>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-3">
            {t.modules.doomByFateCodes.items.filter((c: any) => c.status === 'Inactive').map((code: any, i: number) => (
              <div key={i} className="p-4 bg-white/[0.02] border border-border rounded-xl opacity-60">
                <div className="flex items-center gap-2 mb-1">
                  <code className="font-mono text-sm text-muted-foreground line-through">{code.code}</code>
                  <span className="text-xs px-2 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/30 text-zinc-400">Expired</span>
                </div>
                <p className="text-xs text-muted-foreground">{code.reward}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Doom By Fate Tier List */}
      <section id="doom-by-fate-tier-list" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Trophy className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">Meta Snapshot</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['doomByFateTierList']} locale={locale}>
                {t.modules.doomByFateTierList.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.doomByFateTierList.intro}</p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-8">
            {t.modules.doomByFateTierList.factions.map((faction: any, fi: number) => (
              <div key={fi} className="bg-white/5 border border-border rounded-xl overflow-hidden">
                {/* Faction Header */}
                <div className="flex items-center gap-3 px-6 py-4 bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  {fi === 0
                    ? <Shield className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    : <Skull className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  }
                  <h3 className="font-bold text-lg">{faction.faction}</h3>
                </div>
                {/* Tier Rows */}
                <div className="divide-y divide-border">
                  {faction.tiers.map((row: any, ri: number) => (
                    <div key={ri} className="flex gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 ${
                        row.tier === 'S' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                        row.tier === 'A' ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' :
                        'bg-zinc-500/20 border-zinc-500/50 text-zinc-400'
                      }`}>{row.tier}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-1">
                          {row.units.map((unit: string, ui: number) => (
                            <span key={ui} className="text-sm font-semibold text-foreground">{unit}</span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{row.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 3: Doom By Fate Survivors */}
      <section id="doom-by-fate-survivors" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Users className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">Roster Guide</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['doomByFateSurvivors']} locale={locale}>
                {t.modules.doomByFateSurvivors.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.doomByFateSurvivors.intro}</p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.doomByFateSurvivors.items.map((survivor: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <h3 className="font-bold text-lg">{survivor.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${
                    survivor.role === 'Newest' ? 'bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]' :
                    survivor.role === 'Support' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    'bg-zinc-500/10 border-zinc-500/30 text-zinc-400'
                  }`}>{survivor.role}</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.2)]">{survivor.cost}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border">{survivor.hp}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 flex-1">{survivor.overview}</p>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-[hsl(var(--nav-theme-light))] font-medium">{survivor.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Doom By Fate Killers */}
      <section id="doom-by-fate-killers" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Skull className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">Hunter Roster</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['doomByFateKillers']} locale={locale}>
                {t.modules.doomByFateKillers.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.doomByFateKillers.intro}</p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.doomByFateKillers.items.map((killer: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Sword className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <h3 className="font-bold text-lg">{killer.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${
                    killer.role === 'Newest' ? 'bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]' :
                    killer.role === 'Tank' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                    killer.role === 'Beginner' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    'bg-zinc-500/10 border-zinc-500/30 text-zinc-400'
                  }`}>{killer.role}</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.2)]">{killer.cost}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border">{killer.hp}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 flex-1">{killer.overview}</p>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-[hsl(var(--nav-theme-light))] font-medium">{killer.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Doom By Fate Beginner Guide */}
      <section id="doom-by-fate-beginner-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.doomByFateBeginnerGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['doomByFateBeginnerGuide']} locale={locale}>
                {t.modules.doomByFateBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.doomByFateBeginnerGuide.subtitle}</p>
          </div>

          <p className="scroll-reveal text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{t.modules.doomByFateBeginnerGuide.intro}</p>

          <div className="scroll-reveal space-y-4">
            {t.modules.doomByFateBeginnerGuide.steps.map((step: any, i: number) => (
              <div key={i} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.4)] transition-colors">
                {/* Step number */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center font-bold text-[hsl(var(--nav-theme-light))] text-sm">
                  {step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                  {step.highlights && (
                    <ul className="space-y-1">
                      {step.highlights.map((h: string, hi: number) => (
                        <li key={hi} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Doom By Fate Maps */}
      <section id="doom-by-fate-maps" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Map className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.doomByFateMaps.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['doomByFateMaps']} locale={locale}>
                {t.modules.doomByFateMaps.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.doomByFateMaps.subtitle}</p>
          </div>

          <p className="scroll-reveal text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{t.modules.doomByFateMaps.intro}</p>

          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.08)] border-b border-border">
                  {t.modules.doomByFateMaps.tableHeaders.map((h: string, i: number) => (
                    <th key={i} className="px-4 py-3 text-left font-semibold text-[hsl(var(--nav-theme-light))]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {t.modules.doomByFateMaps.items.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-4 font-semibold">{row.map}</td>
                    <td className="px-4 py-4 text-muted-foreground">{row.objective}</td>
                    <td className="px-4 py-4 text-muted-foreground max-w-xs">{row.layout_notes}</td>
                    <td className="px-4 py-4 text-emerald-400 text-xs">{row.survivor_angle}</td>
                    <td className="px-4 py-4 text-red-400 text-xs">{row.killer_angle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden scroll-reveal space-y-4">
            {t.modules.doomByFateMaps.items.map((row: any, i: number) => (
              <div key={i} className="p-5 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-base">{row.map}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">{row.objective}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{row.layout_notes}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                    <p className="text-xs text-emerald-400 font-medium mb-1">Survivor</p>
                    <p className="text-xs text-muted-foreground">{row.survivor_angle}</p>
                  </div>
                  <div className="p-2 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <p className="text-xs text-red-400 font-medium mb-1">Killer</p>
                    <p className="text-xs text-muted-foreground">{row.killer_angle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Doom By Fate Survivors Tier List */}
      <section id="doom-by-fate-survivors-tier-list" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.doomByFateSurvivorsTierList.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['doomByFateSurvivorsTierList']} locale={locale}>
                {t.modules.doomByFateSurvivorsTierList.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.doomByFateSurvivorsTierList.subtitle}</p>
          </div>

          <p className="scroll-reveal text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{t.modules.doomByFateSurvivorsTierList.intro}</p>

          <div className="scroll-reveal space-y-6">
            {t.modules.doomByFateSurvivorsTierList.tiers.map((tier: any, ti: number) => (
              <div key={ti} className="rounded-xl border border-border overflow-hidden">
                {/* Tier header */}
                <div className="flex items-center gap-3 px-6 py-4 bg-[hsl(var(--nav-theme)/0.06)] border-b border-border">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 ${
                    tier.tier === 'S' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                    tier.tier === 'A' ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' :
                    tier.tier === 'New' ? 'bg-[hsl(var(--nav-theme)/0.2)] border-[hsl(var(--nav-theme)/0.5)] text-[hsl(var(--nav-theme-light))]' :
                    'bg-zinc-500/20 border-zinc-500/50 text-zinc-400'
                  }`}>{tier.tier}</div>
                  <div>
                    <p className="font-semibold">{tier.label}</p>
                  </div>
                </div>
                {/* Entries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
                  {tier.entries.map((entry: any, ei: number) => (
                    <div key={ei} className={`p-5 ${ei > 0 && tier.entries.length > 1 ? 'md:border-l border-border' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">{entry.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border">{entry.role}</span>
                          <span className="text-xs text-[hsl(var(--nav-theme-light))] font-medium">{entry.cost}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{entry.why}</p>
                      <p className="text-xs text-[hsl(var(--nav-theme-light))] font-medium mb-2">{entry.best_for}</p>
                      <div className="flex flex-wrap gap-1">
                        {entry.tools.map((tool: string, tl: number) => (
                          <span key={tl} className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.2)] text-muted-foreground">{tool}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Doom By Fate Killers Tier List */}
      <section id="doom-by-fate-killers-tier-list" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.doomByFateKillersTierList.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['doomByFateKillersTierList']} locale={locale}>
                {t.modules.doomByFateKillersTierList.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.doomByFateKillersTierList.subtitle}</p>
          </div>

          <p className="scroll-reveal text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{t.modules.doomByFateKillersTierList.intro}</p>

          <div className="scroll-reveal space-y-6">
            {t.modules.doomByFateKillersTierList.tiers.map((tier: any, ti: number) => (
              <div key={ti} className="rounded-xl border border-border overflow-hidden">
                {/* Tier header */}
                <div className="flex items-center gap-3 px-6 py-4 bg-[hsl(var(--nav-theme)/0.06)] border-b border-border">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 ${
                    tier.tier === 'S' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                    tier.tier === 'A' ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' :
                    tier.tier === 'New' ? 'bg-[hsl(var(--nav-theme)/0.2)] border-[hsl(var(--nav-theme)/0.5)] text-[hsl(var(--nav-theme-light))]' :
                    'bg-zinc-500/20 border-zinc-500/50 text-zinc-400'
                  }`}>{tier.tier}</div>
                  <div>
                    <p className="font-semibold">{tier.label}</p>
                  </div>
                </div>
                {/* Entries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 divide-border">
                  {tier.entries.map((entry: any, ei: number) => (
                    <div key={ei} className={`p-5 ${tier.entries.length > 1 && ei > 0 ? 'md:border-l border-border' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">{entry.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border">{entry.type}</span>
                          <span className="text-xs text-[hsl(var(--nav-theme-light))] font-medium">{entry.cost}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{entry.why}</p>
                      <p className="text-xs text-[hsl(var(--nav-theme-light))] font-medium mb-2">{entry.best_for}</p>
                      <div className="flex flex-wrap gap-1">
                        {entry.tools.map((tool: string, tl: number) => (
                          <span key={tl} className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.2)] text-muted-foreground">{tool}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 9: Doom by Fate Tix Guide */}
      <section id="doom-by-fate-tix-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Coins className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.doomByFateTixGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['doomByFateTixGuide']} locale={locale}>
                {t.modules.doomByFateTixGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.doomByFateTixGuide.subtitle}</p>
          </div>
          <p className="scroll-reveal text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{t.modules.doomByFateTixGuide.intro}</p>

          <div className="scroll-reveal space-y-4">
            {t.modules.doomByFateTixGuide.sections.map((sec: any, si: number) => (
              <AccordionItem key={si} section={sec} />
            ))}
          </div>
        </div>
      </section>

      {/* Module 10: Doom by Fate Skins */}
      <section id="doom-by-fate-skins" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Palette className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.doomByFateSkins.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['doomByFateSkins']} locale={locale}>
                {t.modules.doomByFateSkins.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.doomByFateSkins.subtitle}</p>
          </div>
          <p className="scroll-reveal text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{t.modules.doomByFateSkins.intro}</p>

          <div className="scroll-reveal space-y-8">
            {t.modules.doomByFateSkins.groups.map((group: any, gi: number) => (
              <div key={gi} className="rounded-xl border border-border overflow-hidden">
                {/* Group header */}
                <div className="flex items-center gap-3 px-6 py-4 bg-[hsl(var(--nav-theme)/0.06)] border-b border-border">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]">
                    <Palette className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <div>
                    <p className="font-semibold">{group.label}</p>
                    <p className="text-xs text-muted-foreground">{group.category}</p>
                  </div>
                </div>
                {/* Skin cards grid */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {group.cards.map((card: any, ci: number) => (
                    <div key={ci} className="rounded-lg border border-border bg-card p-4 hover:border-[hsl(var(--nav-theme)/0.4)] transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm leading-tight">{card.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                          card.status === 'Available'
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            : card.status === 'Coming Soon'
                            ? 'bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]'
                            : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                        }`}>
                          {card.price_tix !== null && card.price_tix !== undefined
                            ? `${card.price_tix} Tix`
                            : card.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{card.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: Doom by Fate Shop Prices */}
      <section id="doom-by-fate-shop-prices" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <ShoppingCart className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.doomByFateShopPrices.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['doomByFateShopPrices']} locale={locale}>
                {t.modules.doomByFateShopPrices.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.doomByFateShopPrices.subtitle}</p>
          </div>
          <p className="scroll-reveal text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{t.modules.doomByFateShopPrices.intro}</p>

          <div className="scroll-reveal rounded-xl border border-border overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-4 gap-0 bg-[hsl(var(--nav-theme)/0.08)] border-b border-border">
              {t.modules.doomByFateShopPrices.tableHeaders.map((h: string, hi: number) => (
                <div key={hi} className={`px-4 py-3 text-sm font-semibold ${hi === 0 ? 'col-span-1' : ''}`}>{h}</div>
              ))}
            </div>
            {/* Table rows grouped by category */}
            {(['Survivor', 'Killer', 'Skin'] as const).map((cat) => {
              const rows = t.modules.doomByFateShopPrices.items.filter((item: any) => item.category === cat)
              return rows.map((item: any, ri: number) => (
                <div
                  key={`${cat}-${ri}`}
                  className="grid grid-cols-4 gap-0 border-b border-border last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="px-4 py-3 flex items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      cat === 'Survivor'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : cat === 'Killer'
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                    }`}>{item.category}</span>
                  </div>
                  <div className="px-4 py-3 font-medium text-sm flex items-center">{item.name}</div>
                  <div className="px-4 py-3 flex items-center">
                    <span className={`text-sm font-bold ${item.price_tix === 0 ? 'text-emerald-400' : 'text-[hsl(var(--nav-theme-light))]'}`}>
                      {item.price_tix === 0 ? 'Free' : `${item.price_tix.toLocaleString()} Tix`}
                    </span>
                  </div>
                  <div className="px-4 py-3 text-sm text-muted-foreground flex items-center">{item.value_note}</div>
                </div>
              ))
            })}
          </div>
        </div>
      </section>

      {/* Module 12: Doom by Fate Update Log */}
      <section id="doom-by-fate-update-log" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Clock className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.doomByFateUpdateLog.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['doomByFateUpdateLog']} locale={locale}>
                {t.modules.doomByFateUpdateLog.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.doomByFateUpdateLog.subtitle}</p>
          </div>
          <p className="scroll-reveal text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{t.modules.doomByFateUpdateLog.intro}</p>

          <div className="scroll-reveal relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-[hsl(var(--nav-theme)/0.2)] hidden md:block" />
            <div className="space-y-6">
              {t.modules.doomByFateUpdateLog.items.map((entry: any, ei: number) => (
                <div key={ei} className="relative md:pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-5 w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background hidden md:block shadow-[0_0_8px_hsl(var(--nav-theme)/0.5)]" />
                  <div className="rounded-xl border border-border bg-card p-6 hover:border-[hsl(var(--nav-theme)/0.4)] transition-colors">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] font-mono">
                        {entry.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border text-muted-foreground">
                        {entry.version}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-3">{entry.headline}</h3>
                    <ul className="space-y-1.5">
                      {entry.highlights.map((hl: string, hi: number) => (
                        <li key={hi} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/doombyfate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/doombyfate/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@DoomByFateRBLX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/79738202045183/Doom-By-Fate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.roblox}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
