import 'dotenv/config'

import { Server } from './server'

const { NODE_ENV, PORT, APPLICATION_URL } = process.env

const { server } = new Server()
server.listen(PORT, () => {
  console.log('------------------------------------------------------')
  console.log(
    `✅ STARTEC - CRAWLER running at ${APPLICATION_URL}:${PORT} (Env: ${NODE_ENV?.toUpperCase()})`
  )
})
