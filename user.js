const User = require('./user.js')
app.post('/createuser', User.createuser)

const environment     = process.env.NODE_ENV || 'prod';    
const configuration   = require('../../knexfile')[environment];   
const database        = require('knex')(configuration);         
const bcrypt          = require('bcrypt')                        
const crypto          = require('crypto')   


const createuser = (request, response) => {
  const user = request.body
  hashPassword(user.password)
    .then((hashedPassword) => {
      delete user.password
      user.password_digest = hashedPassword
    })
    .then(() => createToken())
    .then(token => user.token = token)
    .then(() => createUser(user))
    .then(user => {
      delete user.password_digest
      response.status(201).json({ user })
    })
    .catch((err) => console.error(err))
}


module.exports = {
  createuser,
}


// app/models/user.js
// check out bcrypt's docs for more info on their hashing function
const hashPassword = (password) => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, (err, hash) => {
      err ? reject(err) : resolve(hash)
    })
  )
}

// user will be saved to db and explicitly asking postgres to return back helpful info when row inserted
const createUser = (user) => {
  return database.raw(
    "INSERT INTO users (email, password, comment, token, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id, email, created_at, token",
    [user.email, user.password, user.comment, user.token, new Date()]
  )
  .then((data) => data.rows[0])
}

const createToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString('base64'))
    })
  })
}
