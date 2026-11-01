'use client'

import { ActionIcon, Tooltip, useMantineColorScheme } from '@mantine/core'
import { MoonIcon, SunIcon } from '@phosphor-icons/react/ssr'
import classes from './theme-toggle.module.css'

export function ColorSchemeToggle() {
  const { toggleColorScheme } = useMantineColorScheme()

  return (
    <Tooltip label="Toggle color scheme" position="bottom">
      <ActionIcon
        onClick={() => toggleColorScheme()}
        variant="default"
        size={36}
        aria-label="Toggle color scheme"
      >
        {/*
          Both icons stay mounted and CSS picks the visible one based on the
          data-mantine-color-scheme attribute (set by ColorSchemeScript before
          hydration). Rendering one icon from useComputedColorScheme would
          mismatch: the provider reads localStorage on the first client render
          while the server always renders the default scheme.
        */}
        <SunIcon size={18} className={classes.sunIcon} />
        <MoonIcon size={18} className={classes.moonIcon} />
      </ActionIcon>
    </Tooltip>
  )
}
