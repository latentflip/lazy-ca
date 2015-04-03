import Config from 'getconfig'
import Knex from 'knex'
import Bookshelf from 'bookshelf'

export const client = Knex({
  client: 'pg',
  connection: Config.db.connection
})

const bookshelf = Bookshelf(client)

export default bookshelf
