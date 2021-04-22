const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'user',
  password: 'password',
  port: 5432,
})



//Fetching all users
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


//old user LOGIN

const getUserLogin = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE email = $1 and password=$2',  [email, password], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


//new user SIGN UP
const createUser = (request, response) => {
  const { email, password,  comment} = request.body

  pool.query('INSERT INTO users (email, password, comment) VALUES ($1, $2, $3)', [email, password, comment], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}

//Fetching peerticular user comments
const getUcomment = (request, response) => {
  pool.query('SELECT comments FROM users where id=$1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
