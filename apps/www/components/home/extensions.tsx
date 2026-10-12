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

import { Carousel } from '@mantine/carousel'
import { AreaChart, BarChart, DonutChart, Sparkline } from '@mantine/charts'
import {
  Box,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { Calendar } from '@mantine/dates'
import { MonthView, type ScheduleEventData } from '@mantine/schedule'
import { ArrowDownRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react/ssr'
import type { ReactNode } from 'react'
import extensionClasses from './extensions.module.css'
import { LearnMore } from './shared'
import classes from './shared.module.css'

const scheduleEvents: ScheduleEventData[] = [
  {
    id: 1,
    title: 'Docs standup',
    start: '2024-01-15 10:00:00',
    end: '2024-01-15 11:00:00',
    color: 'blue',
  },
  {
    id: 2,
    title: 'Review theming PR',
    start: '2024-01-15 14:00:00',
    end: '2024-01-15 15:30:00',
    color: 'violet',
  },
  {
    id: 3,
    title: 'Write release notes',
    start: '2024-01-16 09:00:00',
    end: '2024-01-16 10:30:00',
    color: 'teal',
  },
  {
    id: 4,
    title: 'Triage issues',
    start: '2024-01-17 11:00:00',
    end: '2024-01-17 12:00:00',
    color: 'orange',
  },
  {
    id: 5,
    title: 'Component sprint',
    start: '2024-01-17 13:00:00',
    end: '2024-01-17 16:00:00',
    color: 'grape',
  },
  {
    id: 6,
    title: '1.0 planning',
    start: '2024-01-18 15:00:00',
    end: '2024-01-18 16:00:00',
    color: 'red',
  },
  {
    id: 7,
    title: 'Ship it',
    start: '2024-01-19 16:00:00',
    end: '2024-01-19 17:00:00',
    color: 'green',
  },
]

const downloadsData = [
  { month: 'May', downloads: 820, visitors: 1240 },
  { month: 'Jun', downloads: 1150, visitors: 1680 },
  { month: 'Jul', downloads: 980, visitors: 1520 },
  { month: 'Aug', downloads: 1470, visitors: 2100 },
  { month: 'Sep', downloads: 1890, visitors: 2650 },
  { month: 'Oct', downloads: 2340, visitors: 3180 },
]

const pageViewsData = [
  { month: 'May', docs: 4200, blog: 1800 },
  { month: 'Jun', docs: 5100, blog: 2100 },
  { month: 'Jul', docs: 4800, blog: 1950 },
  { month: 'Aug', docs: 6300, blog: 2600 },
  { month: 'Sep', docs: 7400, blog: 3050 },
  { month: 'Oct', docs: 8900, blog: 3600 },
]

const donutData = [
  { name: 'Components', value: 46, color: 'blue.6' },
  { name: 'Guides', value: 27, color: 'teal.6' },
  { name: 'API reference', value: 18, color: 'violet.6' },
  { name: 'Other', value: 9, color: 'gray.6' },
]

function ExtensionDemo({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Paper withBorder radius="md" p="lg" component="section">
      <Title order={3} size="h4" mb={4}>
        {title}
      </Title>
      <Text size="sm" c="dimmed" mb="lg">
        {description}
      </Text>
      {children}
    </Paper>
  )
}

const sparklineStats = [
  {
    label: 'Weekly downloads',
    value: '2,340',
    trend: '24%',
    up: true,
    color: 'blue',
    data: [12, 18, 15, 24, 21, 32, 28, 41, 38, 52],
  },
  {
    label: 'Search queries',
    value: '891',
    trend: '12%',
    up: true,
    color: 'violet',
    data: [8, 12, 10, 16, 14, 19, 17, 24, 22, 28],
  },
  {
    label: 'Bounce rate',
    value: '18%',
    trend: '6%',
    up: false,
    color: 'teal',
    data: [42, 38, 40, 33, 35, 29, 31, 26, 28, 22],
  },
]

function SparklineStatRow({
  label,
  value,
  trend,
  up,
  color,
  data,
}: (typeof sparklineStats)[number]) {
  return (
    <Group wrap="nowrap" align="center" justify="space-between" gap="xl">
      <div>
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
          {label}
        </Text>
        <Group gap={6} align="center" mt={4} wrap="nowrap">
          <Text fz={28} fw={700} lh={1}>
            {value}
          </Text>
          <ThemeIcon variant="light" color="teal" size="sm" radius="xl">
            {up ? (
              <ArrowUpRightIcon size={12} />
            ) : (
              <ArrowDownRightIcon size={12} />
            )}
          </ThemeIcon>
          <Text size="sm" c="teal" fw={600}>
            {trend}
          </Text>
        </Group>
      </div>
      <Sparkline
        h={56}
        w="55%"
        data={data}
        curveType="natural"
        color={color}
        fillOpacity={0.6}
        strokeWidth={2}
      />
    </Group>
  )
}

function SparklineStats() {
  return (
    <Stack gap="xl" py="sm">
      {sparklineStats.map((stat) => (
        <SparklineStatRow key={stat.label} {...stat} />
      ))}
    </Stack>
  )
}

const carouselSlides = [
  {
    title: 'MDX content',
    gradient: 'linear-gradient(135deg, #228be6, #15aabf)',
  },
  {
    title: 'Full-text search',
    gradient: 'linear-gradient(135deg, #7950f2, #9775fa)',
  },
  {
    title: 'Themed by Mantine',
    gradient: 'linear-gradient(135deg, #12b886, #40c057)',
  },
  { title: 'Dark mode', gradient: 'linear-gradient(135deg, #343a40, #495057)' },
]

function CarouselDemo() {
  return (
    <Carousel withIndicators emblaOptions={{ loop: true }} height={200}>
      {carouselSlides.map((slide) => (
        <Carousel.Slide key={slide.title}>
          <Box
            h={200}
            style={{
              borderRadius: 'var(--mantine-radius-md)',
              background: slide.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text c="white" fw={600} fz="lg">
              {slide.title}
            </Text>
          </Box>
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}

export function ExtensionsSection() {
  return (
    <section className={classes.sectionAlt}>
      <Container size={1440}>
        <Title order={2} className={classes.title}>
          Extensions for everything else
        </Title>

        <Text className={classes.description}>
          Beyond the core library, Mantine extensions add charts, calendars,
          carousels, notifications, rich text editing, and more — all sharing
          the same theme, so they drop straight into your docs.
        </Text>

        <LearnMore href="https://mantine.dev/x/extensions/" external>
          Browse all extensions
        </LearnMore>

        <div className={extensionClasses.extensionsGrid}>
          <div className={extensionClasses.scheduleCard}>
            <ExtensionDemo
              title="Schedule"
              description="@mantine/schedule — month view with event chips, drag and drop, and keyboard navigation"
            >
              <MonthView date="2024-01-15" events={scheduleEvents} />
            </ExtensionDemo>
          </div>

          <ExtensionDemo
            title="Calendar"
            description="@mantine/dates — standalone calendar with full keyboard navigation"
          >
            <Group justify="center" py="sm">
              <Calendar />
            </Group>
          </ExtensionDemo>

          <ExtensionDemo
            title="Carousel"
            description="@mantine/carousel — Embla based carousel with indicators"
          >
            <Box py="sm">
              <CarouselDemo />
            </Box>
          </ExtensionDemo>
        </div>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt="xl">
          <ExtensionDemo
            title="Area chart"
            description="Gradient-filled trends with legend, grid, and tooltips"
          >
            <AreaChart
              h={260}
              data={downloadsData}
              dataKey="month"
              series={[
                { name: 'downloads', label: 'Downloads', color: 'blue.6' },
                { name: 'visitors', label: 'Visitors', color: 'teal.6' },
              ]}
              curveType="natural"
              withLegend
            />
          </ExtensionDemo>

          <ExtensionDemo
            title="Bar chart"
            description="Grouped series for comparing content sections"
          >
            <BarChart
              h={260}
              data={pageViewsData}
              dataKey="month"
              series={[
                { name: 'docs', label: 'Docs', color: 'violet.6' },
                { name: 'blog', label: 'Blog', color: 'blue.6' },
              ]}
              withLegend
            />
          </ExtensionDemo>

          <ExtensionDemo
            title="Donut chart"
            description="Traffic share by docs section, with tooltip"
          >
            <Group justify="center">
              <DonutChart
                data={donutData}
                size={200}
                thickness={24}
                withLabels
                chartLabel="Sections"
              />
            </Group>
          </ExtensionDemo>

          <ExtensionDemo
            title="Sparkline"
            description="Inline micro-charts for stat cards and dashboards"
          >
            <SparklineStats />
          </ExtensionDemo>
        </SimpleGrid>
      </Container>
    </section>
  )
}
