const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Heroku PostgresQL DB!");
});

const getUsers = (request, response) => {
  client.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  client.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { name, userId, accessToken, pagestoken, profilepictureurl } = request.body;
  try{
    client.query('SELECT * FROM users WHERE userId = $1', [userId], (error, results) => {
      if(error || !results.rowCount){
        console.error(error)
        client.query(
          'INSERT INTO users (name, userid, accesstoken, pagestoken, profilepictureurl) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [name, userId, accessToken, pagestoken, profilepictureurl],
          (error, results) => {
            if (error) {
              throw error;
            }
            response.status(201).json(results.rows);
          }
        );
      }

      else {
        if(accessToken !== results.rows[0].accesstoken) {
          client.query(
            'UPDATE users SET accessToken = $1, pagestoken = $2 WHERE userid = $3 RETURNING *',
            [accessToken, pagestoken, userId],
            (error, results) => {
              if (error) {
                throw error;
              }
              response.status(200).json(results.rows);
            }
          );
        }
      }
    })
  }
  catch(error){
    console.error(error)
  }
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  client.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const userId = parseInt(request.params.id);

  client.query('DELETE FROM users WHERE userId = $1', [userId], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${userId}`);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
