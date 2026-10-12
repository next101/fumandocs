/**
 * MIT License
 *
 * Copyright (c) 2026 Xiao Hanyu (https://xiaohanyu.me)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { ComponentsSection } from '@/components/home/components'
import { DarkSchemeSection } from '@/components/home/dark-scheme'
import { EngineSection } from '@/components/home/engine'
import { ExtensionsSection } from '@/components/home/extensions'
import { FaqSection } from '@/components/home/faq'
import { SiteFooter } from '@/components/home/footer'
import { GetStartedSection } from '@/components/home/get-started'
import { SiteHeader } from '@/components/home/header'
import { HeroSection } from '@/components/home/hero'
import { SearchSection } from '@/components/home/search'
import { ThemingSection } from '@/components/home/theming'
import classes from './page.module.css'

export default function HomePage() {
  return (
    <div className={classes.home}>
      <SiteHeader />
      <main className={classes.main}>
        <HeroSection />
        <EngineSection />
        <ComponentsSection />
        <DarkSchemeSection />
        <ThemingSection />
        <ExtensionsSection />
        <SearchSection />
        <FaqSection />
        <GetStartedSection />
      </main>
      <SiteFooter />
    </div>
  )
}
