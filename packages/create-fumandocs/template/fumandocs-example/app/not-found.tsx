import { Container, Stack, Text, Title } from '@mantine/core'
import { ArrowLeftIcon } from '@phosphor-icons/react/ssr'
import { LinkButton } from '@/components/home/shared'
import sharedClasses from '@/components/home/shared.module.css'

export default function NotFound() {
  return (
    <Container size={1440} py={120}>
      <Stack align="center" ta="center" gap="md">
        <Title order={1} className={sharedClasses.title} data-order="1">
          404
        </Title>
        <Text className={sharedClasses.description} mt={0}>
          This page could not be found — it may have been moved, renamed, or
          never existed.
        </Text>
        <LinkButton
          href="/"
          variant="default"
          radius="md"
          size="md"
          mt="lg"
          leftSection={<ArrowLeftIcon size={16} />}
        >
          Back to home
        </LinkButton>
      </Stack>
    </Container>
  )
}
