import { Sequelize } from "sequelize";
import { PGDATABASE, PGHOST, PGPASSWORD, PGUSER } from "../config.js";

const sequelize = new Sequelize('postgresql://AguaMarinaDb_owner:XTJqzey2n9sb@ep-late-block-a580a0n7.us-east-2.aws.neon.tech/AguaMarinaDb?sslmode=require', {

    port : 5432,
    dialect : "postgres",
    logging : false,
    dialectOptions : {
        ssl : {
          require : true,
          rejectUnauthorized : false
        }
      }
}); 

/* const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host : DB_HOST,
    dialect : "mysql",
    port : DB_PORT,
    logging : false
}); */


//Comandos para sincronizar la base de datos

/*--Crear las tablas si no están creadas, y si están creadas no hace nada, no hay problema con ejecutar este comando*/
//await sequelize.sync()

/*--Eliminar todas las tablas de la base de datos, ADVERTENCIA (Solo ejecutar al momento de publicar el API, ya que se borrará TODO lo que exista)
await sequelize.sync({force : true})*/

/*--Altera las tablas para combinarlas a las que ya están creadas
await.sequelize({alter : true})*/

/* --Eliminar todas las tablas creadas*/
//await sequelize.drop().then(() => {console.log("Tablas borradas")})


export default sequelize;