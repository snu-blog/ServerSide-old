const pool = require("../db");

module.exports = function loginHandler(req, res, next) {
  //object for storing authentication check
  const authenticateUser = {
    doesNotExist: false,
    passwordMatch: false,
    data: {},
  };
  const values = [req.body.email, req.body.password];
  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [values[0]],
    (err, results) => {
      //No such user with the given email exists
      if (results.rowCount === 0) {
        authenticateUser.doesNotExist = true;
      } else if (!err) {
        //User exists and passwords Match
        if (results.rows[0].password === values[1]) {
          console.log("Match!");
          authenticateUser.passwordMatch = true;
          authenticateUser.data = results.rows[0];
          authenticateUser.data.password = null;
        }
        //Password does not match
        else {
          console.log("Not a match!");
        }
      }
      // unknownError
      else {
        console.log(err);
        next(err);
      }
      res.status(200).send(authenticateUser);
    }
  );
};
