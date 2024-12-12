const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../database/connection.js");

const Catalogo = sequelize.define(
  "Catalogo",
  {
    producto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    linea: {
      type: DataTypes.ENUM(
        "formal",
        "casual",
        "deportiva",
        "infantil",
        "accesorios",
        "ecológica",
        "temporada",
        "básica",
        "especial",
        "premium"
      ),
      allowNull: false,
    },
    estadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    peso: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  },
  {
    timestamps: false,
  }
);

module.exports = { Catalogo };
