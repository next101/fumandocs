'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import classes from './terminal.module.css'

type Frame =
  | { kind: 'cmd'; text: string }
  | { kind: 'ok'; text: string }
  | { kind: 'out'; text: string }
  | { kind: 'local' }
  | { kind: 'blank' }

type Step = { type: 'cmd'; text: string } | { type: 'lines'; lines: Frame[] }

const script: Step[] = [
  { type: 'cmd', text: 'npx create-fumandocs my-docs' },
  {
    type: 'lines',
    lines: [
      { kind: 'ok', text: 'Created a Next.js app' },
      { kind: 'ok', text: 'Installed fumandocs-ui' },
      { kind: 'ok', text: 'Added MDX content and docs layout' },
      { kind: 'blank' },
    ],
  },
  { type: 'cmd', text: 'cd my-docs && npm run dev' },
  {
    type: 'lines',
    lines: [
      { kind: 'out', text: '▲ Next.js (Turbopack)' },
      { kind: 'local' },
      { kind: 'ok', text: 'Ready in 812ms' },
    ],
  },
]

interface KeyedFrame {
  id: number
  frame: Frame
}

const finalFrames: KeyedFrame[] = script
  .flatMap((step) =>
    step.type === 'cmd'
      ? [{ kind: 'cmd', text: step.text } as Frame]
      : step.lines
  )
  .map((frame, id) => ({ id, frame }))

function Line({ frame }: { frame: Frame }) {
  switch (frame.kind) {
    case 'cmd':
      return (
        <span className={classes.line}>
          <span className={classes.prompt}>{'$ '}</span>
          <span className={classes.cmd}>{frame.text}</span>
        </span>
      )
    case 'ok':
      return (
        <span className={`${classes.line} ${classes.ok}`}>
          <span className={classes.okMark}>{'✔ '}</span>
          {frame.text}
        </span>
      )
    case 'out':
      return (
        <span className={`${classes.line} ${classes.out}`}>{frame.text}</span>
      )
    case 'local':
      return (
        <span className={`${classes.line} ${classes.out}`}>
          {'- Local:   '}
          <Link href="/docs" className={classes.link}>
            http://localhost:3000/docs
          </Link>
        </span>
      )
    case 'blank':
      return <span className={classes.line}> </span>
  }
}

export function Terminal() {
  // SSR and reduced-motion users get the full session statically. With JS and
  // motion allowed, useLayoutEffect clears the pane before first paint (no
  // flash of the final frame) and the typing animation plays once.
  const [frames, setFrames] = useState<KeyedFrame[]>(finalFrames)
  const [typing, setTyping] = useState<string | null>(null)
  const [animating, setAnimating] = useState(false)
  const nextId = useRef(0)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    setFrames([])
    setTyping('')
    setAnimating(true)
  }, [])

  useEffect(() => {
    if (!animating) {
      return
    }

    let cancelled = false
    const timers = new Set<number>()
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(resolve, ms)
        timers.add(timer)
      })
    const pushFrame = (frame: Frame) => {
      const id = nextId.current
      nextId.current += 1
      setFrames((current) => [...current, { id, frame }])
    }

    const run = async () => {
      for (const step of script) {
        if (step.type === 'cmd') {
          for (let i = 1; i <= step.text.length; i++) {
            if (cancelled) return
            setTyping(step.text.slice(0, i))
            await wait(38)
          }
          await wait(300)
          if (cancelled) return
          setTyping(null)
          pushFrame({ kind: 'cmd', text: step.text })
        } else {
          for (const line of step.lines) {
            if (cancelled) return
            await wait(line.kind === 'blank' ? 60 : 140)
            pushFrame(line)
          }
        }
        await wait(280)
      }
    }

    run()

    return () => {
      cancelled = true
      for (const timer of timers) {
        window.clearTimeout(timer)
      }
    }
  }, [animating])

  const done =
    animating && typing === null && frames.length === finalFrames.length

  return (
    <div className={classes.terminal}>
      {frames.map(({ id, frame }) => (
        <Line key={id} frame={frame} />
      ))}
      {typing !== null && (
        <span className={classes.line}>
          <span className={classes.prompt}>{'$ '}</span>
          <span className={classes.cmd}>{typing}</span>
          <span className={classes.cursor} />
        </span>
      )}
      {done && (
        <span className={classes.line}>
          <span className={classes.prompt}>{'$ '}</span>
          <span className={classes.cursor} />
        </span>
      )}
    </div>
  )
}
