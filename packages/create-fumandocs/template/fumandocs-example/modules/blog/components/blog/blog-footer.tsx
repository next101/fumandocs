import { Container, Text } from '@mantine/core'
import { brandName } from '@/components/logo'
import classes from './blog-footer.module.css'

export function BlogFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className={classes.footer}>
      <Container size={760} className={classes.inner}>
        <Text size="xs" c="dimmed">
          © {year} {brandName}
        </Text>
        <Text size="xs" c="dimmed">
          Built with Fumadocs and Mantine
        </Text>
      </Container>
    </footer>
  )
}
