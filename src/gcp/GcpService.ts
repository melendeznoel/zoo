import { PubSub, Message } from '@google-cloud/pubsub'
import { logger } from '../logging'
import { first, isUndefined } from 'lodash'
import { IMlService } from '../models'

export class GcpService {
  constructor (private gcpConfig: any, private mlService: IMlService) {

  }

  public async startSubscriptions () {
    logger.info('Starting Subscriptions')

    const pubSub = new PubSub({ projectId: this.gcpConfig.projectId })
    const topic = pubSub.topic(this.gcpConfig.topicName)

    const topicExists = await topic.exists()

    if (!first(topicExists)) throw new Error(`${ this.gcpConfig.topicName } does not exist!`)

    const subscriptionExists = await topic.subscription(this.gcpConfig.topicSubscriptionName).exists()

    if (!first(subscriptionExists)) {
      logger.warn(`${ this.gcpConfig.topicSubscriptionName } does not exist!`)
      await topic.createSubscription(this.gcpConfig.topicSubscriptionName)
    }

    const subscription = await topic.subscription(this.gcpConfig.topicSubscriptionName)

    const subscriptionHandler = subscription.on('message', this.handleMessages.bind(this))

    if (isUndefined(subscriptionHandler)) {
      const subscriptionHandlerErrorMessage = 'Failed to create message handler for subscription'
      logger.info(subscriptionHandlerErrorMessage)
      throw new Error(subscriptionHandlerErrorMessage)
    } else {
      logger.info('Subscription created')
    }
  }

  public async handleMessages (message: Message) {
    logger.info('Incoming message', { data: message })

    if (isUndefined(message.data)) {
      logger.warn('Message was missing "data"', { data: message })
      return false
    }

    const messageJson = JSON.parse(message.data.toString())

    logger.info('GCP Message', { data: messageJson })

    if (!this.canActOnMessage(messageJson)) {
      logger.warn('No Action on Message was taken')
      return false
    }

    const analyzed = await this.mlService.runner(messageJson.phrase)

    message.ack()

    logger.info('GCP Message Ack!', { data: { messageJson, analyzed } })
  }

  public handleError (error: any) {
    logger.error('Subscription threw an exception', { data: error })
    throw new Error('Subscription threw an exception!')
  }

  public canActOnMessage (message: any): boolean {
    return true
  }
}
