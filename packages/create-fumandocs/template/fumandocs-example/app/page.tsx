import { Button, Container, Group, Stack, Text, Title } from '@mantine/core'

export default function HomePage() {
  return (
    <Container size="sm" py={120}>
      <Stack align="center" ta="center" gap="lg">
        <Text c="blue" fw={700}>
          Fumadocs × Mantine
        </Text>
        <Title order={1} fz={52}>
          Documentation, styled with Mantine
        </Title>
        <Text c="dimmed" size="lg">
          This example uses Fumadocs content and search with a Mantine-native UI
          and no Tailwind dependency.
        </Text>
        <Group>
          <Button component="a" href="/docs" size="md">
            Open the docs
          </Button>
          <Button
            component="a"
            href="https://mantine.dev"
            target="_blank"
            variant="default"
            size="md"
          >
            Mantine docs
          </Button>
        </Group>
      </Stack>
    </Container>
  )
}
