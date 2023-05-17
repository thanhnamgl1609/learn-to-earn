const {
  DB_USERNAME: username = 'root',
  DB_PASSWORD: password = 'Thanhnamgl112358',
  DB_HOST: host = '',
  DB_PORT: port = '3306',
  DB_DATABASE: database = 'learn_to_earn',
} = process.env;

module.exports = {
  username,
  password,
  host,
  port: parseInt(port),
  database,
  dialect: 'mysql',
};
