'use client'

import { ActionIcon, Container, Text, Title, Tooltip } from '@mantine/core'
import { CheckIcon, CopyIcon } from '@phosphor-icons/react/ssr'
import { useState } from 'react'
import classes from './get-started.module.css'
import sharedClasses from './shared.module.css'

const installCommand = 'npx create-fumandocs my-docs'

export function GetStartedSection() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — leave the command visible for manual copy
    }
  }

  return (
    <section className={sharedClasses.section}>
      <Container size={1440}>
        <Title order={2} className={sharedClasses.title} ta="center">
          Start building your docs
        </Title>
        <Text
          className={sharedClasses.description}
          ta="center"
          mx="auto"
          maw={860}
          mb={40}
        >
          One command scaffolds a Next.js app with MDX content, search, and this
          docs layout pre-wired.
        </Text>

        <div className={classes.command}>
          <div className={classes.commandInner}>
            <code className={classes.commandCode}>{installCommand}</code>
            <Tooltip label={copied ? 'Copied' : 'Copy command'} position="top">
              <ActionIcon
                onClick={copy}
                variant="subtle"
                color={copied ? 'green' : 'gray'}
                size={32}
                radius="sm"
                aria-label="Copy install command"
              >
                {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              </ActionIcon>
            </Tooltip>
          </div>
        </div>
      </Container>
    </section>
  )
}
