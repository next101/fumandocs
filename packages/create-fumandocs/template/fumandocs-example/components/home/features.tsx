import {
  Container,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  AtomIcon,
  BookOpenTextIcon,
  MagnifyingGlassIcon,
  MoonStarsIcon,
  PaintBrushIcon,
  RocketIcon,
} from '@phosphor-icons/react/ssr'
import type { ReactNode } from 'react'
import classes from './features.module.css'
import sharedClasses from './shared.module.css'

interface Feature {
  icon: ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: <BookOpenTextIcon size={24} />,
    title: 'MDX content engine',
    description:
      'Write docs in MDX with frontmatter, and Fumadocs builds the page tree, navigation, and search index for you.',
  },
  {
    icon: <AtomIcon size={24} />,
    title: 'Mantine components',
    description:
      'Every UI element is a Mantine component — theme it through MantineProvider just like the rest of your app.',
  },
  {
    icon: <MagnifyingGlassIcon size={24} />,
    title: 'Built-in search',
    description:
      'Full-text search over your content is pre-wired, with an ⌘K dialog ready to drop into your docs layout.',
  },
  {
    icon: <MoonStarsIcon size={24} />,
    title: 'Dark mode first',
    description:
      'Dark scheme out of the box, with a light theme and a one-click toggle handled by Mantine color scheme.',
  },
  {
    icon: <PaintBrushIcon size={24} />,
    title: 'No Tailwind required',
    description:
      'Styles come from Mantine and fumandocs-ui CSS — no PostCSS plugins, no utility class collisions.',
  },
  {
    icon: <RocketIcon size={24} />,
    title: 'Deploy anywhere',
    description:
      'A plain Next.js app — static export, Vercel, Docker, or your own Node server all work out of the box.',
  },
]

export function FeaturesSection() {
  return (
    <section className={sharedClasses.sectionAlt}>
      <Container size={1440}>
        <Title order={2} className={sharedClasses.title} ta="center">
          Everything you need to ship docs
        </Title>
        <Text
          className={sharedClasses.description}
          ta="center"
          mx="auto"
          maw={860}
        >
          Content, UI, and search wired together — customize or replace any
          piece as your project grows.
        </Text>

        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing="lg"
          mt={50}
          className={classes.features}
        >
          {features.map((feature) => (
            <Paper
              key={feature.title}
              withBorder
              radius="md"
              className={classes.featureCard}
            >
              <ThemeIcon className={classes.featureIcon} size={50} radius="md">
                {feature.icon}
              </ThemeIcon>
              <Text component="h3" className={classes.featureTitle} mt="md">
                {feature.title}
              </Text>
              <Text className={classes.featureDescription}>
                {feature.description}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  )
}
