import PubSub from 'pubsub-js'
import { Events } from '../events'
import { updatePlayerStats } from './updatePlayerStats'

export const registerSubscribers = () => {
  PubSub.subscribe(Events.GAME_END, updatePlayerStats)

  console.log('finished registering pubsub subscribers')
}
