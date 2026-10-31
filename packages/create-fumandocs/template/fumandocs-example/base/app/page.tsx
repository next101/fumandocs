import { FeaturesSection } from '@/components/home/features'
import { SiteFooter } from '@/components/home/footer'
import { GetStartedSection } from '@/components/home/get-started'
import { SiteHeader } from '@/components/home/header'
import { HeroSection } from '@/components/home/hero'
import classes from './page.module.css'

export default function HomePage() {
  return (
    <div className={classes.home}>
      <SiteHeader />
      <main className={classes.main}>
        <HeroSection />
        <FeaturesSection />
        <GetStartedSection />
      </main>
      <SiteFooter />
    </div>
  )
}
