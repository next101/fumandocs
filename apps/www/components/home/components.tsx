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
  Alert,
  Anchor,
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  ColorInput,
  Container,
  Drawer,
  FileInput,
  Group,
  HoverCard,
  Input,
  Loader,
  LoadingOverlay,
  Menu,
  Modal,
  MultiSelect,
  NumberInput,
  Pagination,
  Paper,
  PasswordInput,
  PinInput,
  Popover,
  Progress,
  Radio,
  Rating,
  RingProgress,
  SegmentedControl,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Stepper,
  Table,
  Tabs,
  Text,
  TextInput,
  Timeline,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  ArrowsClockwiseIcon,
  CaretRightIcon,
  ChatCircleIcon,
  CodeIcon,
  DotsThreeIcon,
  FilesIcon,
  GearSixIcon,
  HeartIcon,
  ImageIcon,
  InfoIcon,
  PauseIcon,
  RocketLaunchIcon,
  SignOutIcon,
  SlidersHorizontalIcon,
  StarIcon,
  TrashIcon,
  WarningIcon,
} from '@phosphor-icons/react/ssr'
import { useState } from 'react'
import { HomeTabs, LearnMore } from './shared'
import classes from './shared.module.css'

const inputProps = {
  size: 'lg' as const,
  radius: 'md' as const,
}

function InputsDemo() {
  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, md: 3 }}
      spacing="xl"
      verticalSpacing={25}
    >
      <TextInput label="Text input" placeholder="Text input" {...inputProps} />
      <NumberInput
        label="Number input"
        placeholder="Number input"
        prefix="$ "
        thousandSeparator
        defaultValue={30712}
        {...inputProps}
      />
      <ColorInput
        label="Color input"
        defaultValue="#129ce0"
        placeholder="What other library has color input?"
        format="rgba"
        popoverProps={{ radius: 'md' }}
        {...inputProps}
      />
      <PasswordInput
        label="Password input"
        placeholder="Secret"
        defaultValue="secret-password"
        {...inputProps}
      />
      <FileInput label="File input" placeholder="Upload file" {...inputProps} />
      <Select
        label="Select"
        placeholder="Pick one option"
        checkIconPosition="right"
        defaultValue="🇫🇷 France"
        data={[
          '🇩🇪 Germany',
          '🇫🇷 France',
          '🇬🇧 United Kingdom',
          '🇺🇸 United States of America',
        ]}
        {...inputProps}
      />
      <MultiSelect
        label="Multiselect"
        placeholder="Search and pick"
        comboboxProps={{ radius: 'md' }}
        defaultValue={['React', 'Vue']}
        searchable
        checkIconPosition="right"
        data={[
          'React',
          'Angular',
          'Vue',
          'Svelte',
          'Ember',
          'Preact',
          'Solid',
          'Alpine',
        ]}
        {...inputProps}
      />
      <Autocomplete
        label="Autocomplete"
        placeholder="Pick a framework"
        data={['Next.js', 'Vite', 'React Router', 'Astro', 'TanStack Start']}
        {...inputProps}
      />
      <div>
        <Input.Label size="lg">Pin input</Input.Label>
        <PinInput {...inputProps} />
      </div>
    </SimpleGrid>
  )
}

function AuthForm() {
  return (
    <Stack>
      <TextInput label="Email" placeholder="you@example.com" />
      <PasswordInput label="Password" placeholder="Your password" />
      <Button fullWidth mt="md">
        Sign in
      </Button>
    </Stack>
  )
}

function OverlaysDemo() {
  const [modalOpened, modalHandlers] = useDisclosure(false)
  const [drawerOpened, drawerHandlers] = useDisclosure(false)

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={modalHandlers.close}
        title="Authenticate"
        radius="md"
      >
        <AuthForm />
      </Modal>

      <Drawer
        opened={drawerOpened}
        onClose={drawerHandlers.close}
        title="Authenticate"
        offset={5}
      >
        <AuthForm />
      </Drawer>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        <SimpleGrid cols={{ base: 1, xs: 2 }}>
          <div>
            <Input.Label labelElement="div" size="lg" mb="sm" display="block">
              Popover
            </Input.Label>

            <Popover radius="md" position="bottom-start" shadow="md">
              <Popover.Target>
                <Button
                  miw={200}
                  size="lg"
                  variant="default"
                  radius="md"
                  rightSection={<SlidersHorizontalIcon size={22} />}
                  justify="space-between"
                >
                  Filters
                </Button>
              </Popover.Target>

              <Popover.Dropdown w={320}>
                <Input.Label
                  labelElement="div"
                  display="block"
                  mb={3}
                  size="md"
                >
                  Order status
                </Input.Label>
                <SegmentedControl
                  data={['In progress', 'Delivered']}
                  radius="md"
                  size="md"
                />

                <Input.Label
                  labelElement="div"
                  display="block"
                  mb={5}
                  mt="md"
                  size="md"
                >
                  Brand
                </Input.Label>
                <Checkbox label="Cannon" size="md" defaultChecked />
                <Checkbox label="Nikon" mt={8} size="md" defaultChecked />
                <Checkbox label="Sony" mt={8} size="md" />
                <Checkbox label="Fuji" mt={8} size="md" />
                <Checkbox label="Leica" mt={8} size="md" />

                <Input.Label
                  labelElement="div"
                  display="block"
                  mb={5}
                  mt={24}
                  size="md"
                >
                  Price range
                </Input.Label>
                <Radio.Group defaultValue="200">
                  <Stack gap={8}>
                    <Radio label="Less than $100" value="100" size="md" />
                    <Radio label="$100 - $200" value="200" size="md" />
                    <Radio label="$200 - $500" value="500" size="md" />
                    <Radio label="$500 - $1000" value="1000" size="md" />
                    <Radio label="More than $1000" value="1001" size="md" />
                  </Stack>
                </Radio.Group>
              </Popover.Dropdown>
            </Popover>
          </div>

          <div>
            <Input.Label labelElement="div" size="lg" mb="sm">
              Hover card
            </Input.Label>
            <HoverCard
              width={320}
              shadow="md"
              withArrow
              openDelay={200}
              closeDelay={400}
              position="bottom-start"
              arrowOffset={15}
              radius="md"
            >
              <HoverCard.Target>
                <Group w="max-content">
                  <Avatar
                    src="https://avatars.githubusercontent.com/u/79146003?s=200&v=4"
                    radius="xl"
                  />
                  <Stack gap={5}>
                    <Text size="sm" fw={700} lh={1} c="bright">
                      Mantine
                    </Text>
                    <Anchor
                      href="https://mantine.dev"
                      target="_blank"
                      rel="noreferrer"
                      c="dimmed"
                      size="xs"
                      lh={1}
                    >
                      mantine.dev
                    </Anchor>
                  </Stack>
                </Group>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size="sm">
                  Customizable React components and hooks library with focus on
                  usability, accessibility and developer experience
                </Text>
                <Group mt="md" gap="xl">
                  <Text size="sm">
                    <Box component="b" c="bright">
                      120+
                    </Box>{' '}
                    Components
                  </Text>
                  <Text size="sm">
                    <Box component="b" c="bright">
                      70+
                    </Box>{' '}
                    Hooks
                  </Text>
                </Group>
              </HoverCard.Dropdown>
            </HoverCard>
          </div>

          <div>
            <Input.Label labelElement="div" size="lg" mb="sm" display="block">
              Tooltip
            </Input.Label>
            <Tooltip label="Tooltip" withArrow>
              <Badge size="lg" variant="dot" color="yellow">
                Hover me to see a tooltip
              </Badge>
            </Tooltip>
          </div>

          <div>
            <Input.Label labelElement="div" size="lg" mb="sm" display="block">
              Modal and Drawer
            </Input.Label>
            <Group>
              <Button
                variant="default"
                radius="md"
                onClick={modalHandlers.open}
              >
                Open modal
              </Button>
              <Button
                variant="default"
                radius="md"
                onClick={drawerHandlers.open}
              >
                Open drawer
              </Button>
            </Group>
          </div>
        </SimpleGrid>

        <div>
          <Input.Label labelElement="div" size="lg">
            Floating tooltip
          </Input.Label>
          <Tooltip.Floating label="Floating tooltip" withinPortal={false}>
            <Paper
              withBorder
              radius="md"
              p="xl"
              mih={200}
              style={{
                borderStyle: 'dashed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text c="dimmed" ta="center">
                Hover me to see a tooltip that follows mouse cursor
              </Text>
            </Paper>
          </Tooltip.Floating>
        </div>
      </SimpleGrid>
    </>
  )
}

function MenuDemo() {
  const theme = useMantineTheme()

  return (
    <Menu
      width={300}
      position="bottom-start"
      transitionProps={{ transition: 'pop' }}
      radius="md"
    >
      <Menu.Target>
        <Button
          variant="default"
          rightSection={<DotsThreeIcon size={24} />}
          miw={200}
          size="lg"
          radius="md"
          justify="space-between"
        >
          User Menu
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item rightSection={<CaretRightIcon size={18} />}>
          <Group>
            <Avatar
              radius="xl"
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
            />
            <div>
              <Text fw={500}>Nancy Horsekisser</Text>
              <Text size="xs" c="dimmed">
                nhorsekisser@mantine.dev
              </Text>
            </div>
          </Group>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          leftSection={
            <HeartIcon weight="fill" size={18} color={theme.colors.red[6]} />
          }
        >
          Liked posts
        </Menu.Item>
        <Menu.Item
          leftSection={
            <StarIcon weight="fill" size={18} color={theme.colors.yellow[6]} />
          }
        >
          Saved posts
        </Menu.Item>
        <Menu.Item
          leftSection={
            <ChatCircleIcon
              weight="fill"
              size={18}
              color={theme.colors.blue[6]}
            />
          }
        >
          Your comments
        </Menu.Item>

        <Menu.Label>Settings</Menu.Label>
        <Menu.Item leftSection={<GearSixIcon size={18} />}>
          Account settings
        </Menu.Item>
        <Menu.Item leftSection={<ArrowsClockwiseIcon size={18} />}>
          Change account
        </Menu.Item>
        <Menu.Item leftSection={<SignOutIcon size={18} />}>Logout</Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item leftSection={<PauseIcon size={18} />}>
          Pause subscription
        </Menu.Item>
        <Menu.Item color="red" leftSection={<TrashIcon size={18} />}>
          Delete account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

function StepperDemo() {
  const [active, setActive] = useState(1)

  return (
    <>
      <Stepper active={active} onStepClick={setActive} visibleFrom="sm">
        <Stepper.Step label="First step" description="Create an account" />
        <Stepper.Step label="Second step" description="Verify email" />
        <Stepper.Step label="Final step" description="Get full access" />
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Stepper
        active={active}
        onStepClick={setActive}
        hiddenFrom="sm"
        orientation="vertical"
      >
        <Stepper.Step label="First step" description="Create an account" />
        <Stepper.Step label="Second step" description="Verify email" />
        <Stepper.Step label="Final step" description="Get full access" />
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>
    </>
  )
}

function TabsDemo() {
  return (
    <Tabs defaultValue="gallery" radius="md">
      <Tabs.List>
        <Tabs.Tab
          value="gallery"
          leftSection={
            <ImageIcon size={18} color="var(--mantine-color-dimmed)" />
          }
        >
          Gallery
        </Tabs.Tab>
        <Tabs.Tab
          value="messages"
          leftSection={
            <ChatCircleIcon size={18} color="var(--mantine-color-dimmed)" />
          }
        >
          Messages
        </Tabs.Tab>
        <Tabs.Tab
          value="settings"
          leftSection={
            <GearSixIcon size={18} color="var(--mantine-color-dimmed)" />
          }
        >
          Settings
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  )
}

function NavigationDemo() {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
      <div>
        <Input.Label labelElement="div" size="lg" mb="sm" display="block">
          Stepper
        </Input.Label>
        <StepperDemo />
      </div>

      <div>
        <Input.Label labelElement="div" size="lg" mb="sm" display="block">
          Tabs
        </Input.Label>
        <TabsDemo />
      </div>

      <div>
        <Input.Label labelElement="div" size="lg" mb="sm" display="block">
          Pagination
        </Input.Label>
        <Pagination total={56} size="lg" radius="md" />
      </div>

      <div>
        <Input.Label labelElement="div" size="lg" mb="sm" display="block">
          Menu
        </Input.Label>
        <MenuDemo />
      </div>
    </SimpleGrid>
  )
}

const tableRows = [
  { name: 'fumandocs-ui', description: 'Mantine UI layer', status: 'stable' },
  {
    name: 'create-fumandocs',
    description: 'Project scaffolding CLI',
    status: 'stable',
  },
  {
    name: 'fumadocs-core',
    description: 'Content engine (upstream)',
    status: 'upstream',
  },
  {
    name: 'fumadocs-mdx',
    description: 'MDX pipeline (upstream)',
    status: 'upstream',
  },
]

function TableDemo() {
  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Package</Table.Th>
          <Table.Th>Role</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {tableRows.map((row) => (
          <Table.Tr key={row.name}>
            <Table.Td>
              <Text size="sm" fw={600}>
                {row.name}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">
                {row.description}
              </Text>
            </Table.Td>
            <Table.Td>
              <Badge
                variant="light"
                color={row.status === 'stable' ? 'teal' : 'blue'}
              >
                {row.status}
              </Badge>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

function TimelineDemo() {
  return (
    <Timeline active={1} bulletSize={32} lineWidth={2}>
      <Timeline.Item bullet={<FilesIcon size={16} />} title="Write MDX">
        <Text c="dimmed" size="sm">
          Author content in MDX with frontmatter
        </Text>
      </Timeline.Item>
      <Timeline.Item bullet={<CodeIcon size={16} />} title="Build">
        <Text c="dimmed" size="sm">
          fumadocs-mdx compiles the page tree and search index
        </Text>
      </Timeline.Item>
      <Timeline.Item bullet={<RocketLaunchIcon size={16} />} title="Deploy">
        <Text c="dimmed" size="sm">
          Static export to any host — search included
        </Text>
      </Timeline.Item>
    </Timeline>
  )
}

function DataDisplayDemo() {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
      <div>
        <Input.Label labelElement="div" size="lg" mb="sm" display="block">
          Table
        </Input.Label>
        <TableDemo />
      </div>

      <div>
        <Input.Label labelElement="div" size="lg" mb="sm" display="block">
          Timeline
        </Input.Label>
        <TimelineDemo />
      </div>

      <div>
        <Input.Label labelElement="div" size="lg" mb="sm" display="block">
          Progress indicators
        </Input.Label>
        <Group wrap="nowrap" align="center">
          <RingProgress
            size={120}
            thickness={12}
            sections={[{ value: 72, color: 'blue' }]}
            label={
              <Text ta="center" fw={700} size="lg">
                72%
              </Text>
            }
          />
          <Stack flex={1} gap="sm">
            <Progress value={72} size="lg" radius="md" />
            <Progress value={54} size="lg" radius="md" color="teal" />
            <Progress value={38} size="lg" radius="md" color="orange" />
          </Stack>
        </Group>
      </div>

      <div>
        <Input.Label labelElement="div" size="lg" mb="sm" display="block">
          Avatars, badges & rating
        </Input.Label>
        <Stack gap="md">
          <Group>
            <Avatar.Group spacing="sm">
              <Avatar color="blue" radius="xl">
                FD
              </Avatar>
              <Avatar color="teal" radius="xl">
                MD
              </Avatar>
              <Avatar color="grape" radius="xl">
                UI
              </Avatar>
              <Avatar radius="xl">+5</Avatar>
            </Avatar.Group>
            <Badge variant="dot" color="blue">
              v0.1
            </Badge>
            <Badge variant="light" color="teal">
              MIT
            </Badge>
          </Group>
          <Group gap="xs">
            <Rating value={4.5} fractions={2} readOnly />
            <Text size="sm" c="dimmed">
              4.5 / 5
            </Text>
          </Group>
        </Stack>
      </div>
    </SimpleGrid>
  )
}

function FeedbackDemo() {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
      <div>
        <Input.Label labelElement="div" size="lg" mb="sm" display="block">
          Alerts
        </Input.Label>
        <Stack gap="sm">
          <Alert
            variant="light"
            color="blue"
            title="New version available"
            icon={<InfoIcon size={18} />}
          >
            fumandocs-ui 0.2 ships a redesigned code block
          </Alert>
          <Alert
            variant="light"
            color="yellow"
            title="Deprecated prop"
            icon={<WarningIcon size={18} />}
          >
            The gutter prop was renamed to gap in Mantine 9
          </Alert>
        </Stack>
      </div>

      <div>
        <Input.Label labelElement="div" size="lg" mb="sm" display="block">
          Loaders
        </Input.Label>
        <Group gap="xl" align="center">
          <Loader />
          <Loader type="dots" />
          <Loader type="bars" />
          <Button loading radius="md">
            Building
          </Button>
        </Group>
      </div>

      <div>
        <Input.Label labelElement="div" size="lg" mb="sm" display="block">
          Skeleton
        </Input.Label>
        <Stack gap="sm">
          <Group wrap="nowrap">
            <Skeleton height={48} circle />
            <Stack flex={1} gap={8}>
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} radius="xl" w="70%" />
            </Stack>
          </Group>
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} radius="xl" w="60%" />
        </Stack>
      </div>

      <div>
        <Input.Label labelElement="div" size="lg" mb="sm" display="block">
          Loading overlay
        </Input.Label>
        <Paper withBorder radius="md" p="xl" pos="relative" mih={120}>
          <LoadingOverlay
            visible
            zIndex={10}
            overlayProps={{ radius: 'md', blur: 2 }}
          />
          <Text c="dimmed" size="sm">
            Content underneath stays mounted while the overlay is visible
          </Text>
        </Paper>
      </div>
    </SimpleGrid>
  )
}

export function ComponentsSection() {
  return (
    <section className={classes.section}>
      <Container size={1440}>
        <Title order={2} className={classes.title}>
          The full power of Mantine
        </Title>

        <Text className={classes.description} mb="xl">
          Mantine is the UI layer of Fumandocs: 120+ customizable components and
          70+ hooks, all themeable and dark-mode ready. Drop any of them into
          your MDX pages or extend the docs UI itself.
        </Text>

        <LearnMore href="https://mantine.dev" external>
          Explore Mantine components
        </LearnMore>

        <Box mt="xl">
          <HomeTabs
            data={[
              { label: 'Inputs', value: 'inputs', content: <InputsDemo /> },
              {
                label: 'Overlays',
                value: 'overlays',
                content: <OverlaysDemo />,
              },
              {
                label: 'Navigation',
                value: 'navigation',
                content: <NavigationDemo />,
              },
              {
                label: 'Data display',
                value: 'data-display',
                content: <DataDisplayDemo />,
              },
              {
                label: 'Feedback',
                value: 'feedback',
                content: <FeedbackDemo />,
              },
            ]}
          />
        </Box>
      </Container>
    </section>
  )
}
