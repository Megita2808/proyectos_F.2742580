const mongoose = require("mongoose"); 

const dbConnection = () => {
    try {
        mongoose.connect(process.env.MONGODB_CNN);
        console.log("Datos en Linea"); 
    } catch (error) {
        console.log(error);
        falla;
        throw new Error("Error al conectarse a la base de datos"); 
    }
};

module.exports = {
    dbConnection,
};
