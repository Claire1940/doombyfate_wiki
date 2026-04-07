'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Gift,
  Shield,
  Skull,
  Sparkles,
  Sword,
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
                'doom-by-fate-codes', 'doom-by-fate-tier-list', 'doom-by-fate-survivors', 'doom-by-fate-killers'
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
