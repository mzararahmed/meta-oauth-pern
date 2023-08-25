const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.HEROKU_POSTGRESQL_ROSE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
client.connect(function (err) {
  if (err) throw err;
  console.log("Connected to Heroku PostgresQL DB!");
});

client.query(
  "CREATE TABLE IF NOT EXISTS users(name VARCHAR, userid VARCHAR, accesstoken VARCHAR, profilepictureurl VARCHAR, pages text[])");

const createUser = (request, response) => {
  const { name, userId, accessToken, profilepictureurl, pages } =
    request.body;
  try {
    client.query(
      "SELECT * FROM users WHERE userId = $1",
      [userId],
      (error, results) => {
        if (error || !results.rowCount) {
          console.error(error);
          client.query(
            "INSERT INTO users (name, userid, accesstoken, profilepictureurl, pages) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, userId, accessToken, profilepictureurl, pages],
            (error, results) => {
              if (error) {
                throw error;
              }
              response.status(201).json(results.rows);
            }
          );
        } else {
          if (accessToken !== results.rows[0].accesstoken) {
            client.query(
              "UPDATE users SET accessToken = $1, pages = $2 WHERE userid = $3 RETURNING *",
              [accessToken, pages, userId],
              (error, results) => {
                if (error) {
                  throw error;
                }
                response.status(200).json(results.rows);
              }
            );
          }
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const deleteUser = (request, response) => {
  const { userid } = request.body;

  client.query('DELETE FROM users WHERE userid = $1', [userid], (error, results) => {
    if (error) {
      throw error;
    }
    console.log(userid)
    response.status(200).send(`User deleted with ID: ${userid}`);
  });
};

module.exports = {
  createUser,
  deleteUser
};
