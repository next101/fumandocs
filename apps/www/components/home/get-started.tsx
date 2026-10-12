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

'use client'

import { Container, Text, Title } from '@mantine/core'
import getStartedClasses from './get-started.module.css'
import classes from './shared.module.css'
import { ShikiCodeBlock } from './shiki-code-block'

const installCommand = 'npx create-fumandocs my-docs'

export function GetStartedSection() {
  return (
    <section className={classes.section}>
      <Container size={1440}>
        <Title order={2} className={classes.title} ta="center">
          Ready to get started?
        </Title>

        <Text
          className={classes.description}
          ta="center"
          mx="auto"
          maw={860}
          mb={40}
        >
          One command, one Next.js app with MDX, search, and docs layout
          pre-wired.
        </Text>

        <div className={getStartedClasses.command}>
          <ShikiCodeBlock
            lang="bash"
            code={installCommand}
            className={getStartedClasses.codeblock}
          />
        </div>
      </Container>
    </section>
  )
}
