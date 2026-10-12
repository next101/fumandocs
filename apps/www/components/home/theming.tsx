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

import {
  Badge,
  Button,
  Checkbox,
  ColorSwatch,
  Container,
  createTheme,
  Group,
  MantineProvider,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Switch,
  Text,
  Title,
  UnstyledButton,
  useComputedColorScheme,
} from '@mantine/core'
import { CheckIcon } from '@phosphor-icons/react/ssr'
import { useMemo, useState } from 'react'
import { LearnMore } from './shared'
import classes from './shared.module.css'
import { ShikiCodeBlock } from './shiki-code-block'

interface GradientPreset {
  label: string
  from: string
  to: string
  deg: number
}

const gradientPresets: GradientPreset[] = [
  { label: 'Blue to teal', from: 'blue', to: 'teal', deg: 135 },
  { label: 'Violet to pink', from: 'violet', to: 'pink', deg: 135 },
  { label: 'Orange to red', from: 'orange', to: 'red', deg: 135 },
  { label: 'Dark to gray', from: 'dark', to: 'gray', deg: 135 },
]

function themeCode(
  primaryColor: string,
  radius: string,
  gradient: GradientPreset
) {
  const radiusCode = radius === '0' ? '0' : `'${radius}'`
  return `import { createTheme, MantineProvider } from '@mantine/core'

const theme = createTheme({
  primaryColor: '${primaryColor}',
  defaultRadius: ${radiusCode},
  defaultGradient: { from: '${gradient.from}', to: '${gradient.to}', deg: ${gradient.deg} },
})

export function App() {
  return (
    <MantineProvider theme={theme}>
      <Docs />
    </MantineProvider>
  )
}`
}

const primaryColors = ['blue', 'violet', 'teal', 'orange', 'red']
const radiusOptions = ['0', 'xs', 'sm', 'md', 'lg', 'xl']

interface LiveThemeDemoProps {
  primaryColor: string
  radius: string
  gradient: GradientPreset
  onPrimaryColorChange: (color: string) => void
  onRadiusChange: (radius: string) => void
  onGradientChange: (gradient: GradientPreset) => void
}

function LiveThemeDemo({
  primaryColor,
  radius,
  gradient,
  onPrimaryColorChange,
  onRadiusChange,
  onGradientChange,
}: LiveThemeDemoProps) {
  const colorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  })

  const theme = useMemo(
    () =>
      createTheme({
        primaryColor,
        defaultRadius: radius === '0' ? 0 : (radius as 'xs'),
        defaultGradient: {
          from: gradient.from,
          to: gradient.to,
          deg: gradient.deg,
        },
      }),
    [primaryColor, radius, gradient]
  )

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Text size="sm" fw={500} mb={8}>
        Try a primary color — the card and the code follow
      </Text>
      <Group gap="xs" mb="lg">
        {primaryColors.map((color) => (
          <ColorSwatch
            key={color}
            component="button"
            color={`var(--mantine-color-${color}-6)`}
            size={28}
            onClick={() => onPrimaryColorChange(color)}
            style={{ cursor: 'pointer' }}
            aria-label={`Use ${color} as the primary color`}
          >
            {primaryColor === color && <CheckIcon size={14} color="white" />}
          </ColorSwatch>
        ))}
      </Group>

      <Text size="sm" fw={500} mb={8}>
        And a default radius
      </Text>
      <SegmentedControl
        mb="lg"
        value={radius}
        onChange={onRadiusChange}
        data={radiusOptions}
        aria-label="Default radius"
      />

      <Text size="sm" fw={500} mb={8}>
        And a default gradient for gradient-variant buttons
      </Text>
      <Group gap="xs" mb="lg">
        {gradientPresets.map((preset) => (
          <UnstyledButton
            key={preset.label}
            onClick={() => onGradientChange(preset)}
            aria-label={`Use ${preset.label} gradient`}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
              background: `linear-gradient(${preset.deg}deg, var(--mantine-color-${preset.from}-6), var(--mantine-color-${preset.to}-6))`,
            }}
          >
            {gradient.label === preset.label && (
              <CheckIcon size={14} color="white" />
            )}
          </UnstyledButton>
        ))}
      </Group>

      <MantineProvider
        theme={theme}
        forceColorScheme={colorScheme}
        cssVariablesSelector=".theming-demo"
        withGlobalClasses={false}
      >
        <Paper withBorder shadow="md" p="xl" className="theming-demo">
          <Text fw={600} size="lg">
            Site settings
          </Text>
          <Text size="sm" c="dimmed" mt={4}>
            Every control below follows the theme object
          </Text>

          <Group mt="lg">
            <Button>Get started</Button>
            <Button variant="light">Learn more</Button>
            <Button variant="gradient">Ship it</Button>
            <Badge variant="light" size="lg">
              {primaryColor}
            </Badge>
          </Group>

          <Group mt="xl" justify="space-between">
            <Switch defaultChecked label="Search indexing" />
            <Checkbox defaultChecked label="RSS feed" />
          </Group>

          <Button variant="subtle" mt="xl" px={0}>
            Read the theming guide
          </Button>
        </Paper>
      </MantineProvider>
    </div>
  )
}

export function ThemingSection() {
  const [primaryColor, setPrimaryColor] = useState('violet')
  const [radius, setRadius] = useState('md')
  const [gradient, setGradient] = useState(gradientPresets[0])

  return (
    <section className={classes.section}>
      <Container size={1440}>
        <Title order={2} className={classes.title}>
          Zero Tailwind, one theme
        </Title>

        <Text className={classes.description}>
          No Tailwind, no PostCSS pipeline, no utility-class soup — every
          component in your docs reads from Mantine's theme object. Change{' '}
          <code>primaryColor</code>, <code>defaultRadius</code>, or{' '}
          <code>defaultGradient</code> once and the entire site follows.
        </Text>

        <LearnMore href="/docs/guides/theming">Theming guide</LearnMore>

        <SimpleGrid
          cols={{ base: 1, md: 2 }}
          spacing={50}
          verticalSpacing="xl"
          mt={50}
        >
          <ShikiCodeBlock
            title="theme.ts"
            lang="tsx"
            code={themeCode(primaryColor, radius, gradient)}
          />
          <LiveThemeDemo
            primaryColor={primaryColor}
            radius={radius}
            gradient={gradient}
            onPrimaryColorChange={setPrimaryColor}
            onRadiusChange={setRadius}
            onGradientChange={setGradient}
          />
        </SimpleGrid>
      </Container>
    </section>
  )
}
