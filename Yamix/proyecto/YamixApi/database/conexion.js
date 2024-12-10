const mysql = require('mysql2');


const conexion = mysql.createPool({
  host: '34.83.112.237',
  user: 'root',
  password: `j'&&,|An}Fg"qMRM`,
  database: 'yamix'
});

module.exports = conexion;