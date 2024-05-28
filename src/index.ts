import { logger } from './logging'

import { Api } from './api'

const port = process.env.PORT || '3001'

logger.info('Starting Service')

new Api().instance.listen(port, () => {
  logger.info(`api listening on ${ port }`)
  return true
})
