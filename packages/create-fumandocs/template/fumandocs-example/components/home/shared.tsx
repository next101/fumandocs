'use client'

import { Button, type ButtonProps } from '@mantine/core'
import Link from 'next/link'

// Passing component={Link} from a server component to a Mantine Button
// crosses the server/client boundary with a function prop, which React
// forbids — wrap it in a client component instead.
export function LinkButton({ href, ...props }: ButtonProps & { href: string }) {
  return <Button component={Link} href={href} {...props} />
}
