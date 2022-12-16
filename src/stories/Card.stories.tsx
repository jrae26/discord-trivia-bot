import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Header } from './Header'
import { PlayerStatsCard } from '../components/PlayerStatsCard'

export default {
  title: 'Example/Card',
  component: Header,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof PlayerStatsCard>

const Template: ComponentStory<typeof PlayerStatsCard> = () => (
  <PlayerStatsCard />
)

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  user: {
    name: 'Jane Doe',
  },
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {}
