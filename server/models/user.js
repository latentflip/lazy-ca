import bookshelf from './bookshelf'

let User = bookshelf.Model.extend({
  tableName: 'users'
})

export default User
