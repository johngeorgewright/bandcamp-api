import test from 'node:test'
import { Bandcamp } from '../src/Bandcamp.js'
import { config } from 'dotenv'

const { error, parsed } = config()
if (error) throw error
const env = parsed!

test('mung', async () => {
  const bandcamp = await Bandcamp.login({
    client_id: Number(env.BANDCAMP_CLIENT_ID),
    client_secret: env.BANDCAMP_CLIENT_SECRET,
  })

  console.info(await bandcamp.getMyBands())
})
