//Solo ejecutar este archivo cuando se vaya a inicializar la base de datos
console.log("Cargando...")
import bcrypt from "bcrypt"
import Rol from "../models/1_Rol.model.js";
import Permission from "../models/2_Permission.model.js";
import RolPermissions from "../models/3_RolPermissions.model.js";
import City from "../models/4_City.model.js";
import Address from "../models/5_Address.model.js";
import Category from "../models/6_Category.model.js";
import Product from "../models/7_Product.model.js";
import Image from "../models/8_Image.model.js";
import Reservation from "../models/10_Reservation.model.js";
import Voucher from "../models/10_5_Voucher.model.js";
import ReservationDetail from "../models/11_ReservationDetail.model.js";
import Rent from "../models/12_Rent.model.js";
import PaymentRegister from "../models/13_PaymentRegister.model.js";
import CheckList from "../models/14_CheckList.model.js";
import CheckListItem from "../models/15_CheckListItem.model.js";
import Purchase from "../models/16_Purchase.model.js";
import Loss from "../models/17_Loss.model.js";
import LossDetail from "../models/17_5_LossDetail.model.js";
import User from "../models/18_User.model.js";
import VerificationCode from "../models/19_VerificationCode.model.js";


//Para Borrar y crear todo de nuevo
import sequelize from "./sequelize.js";
await sequelize.drop({ cascade: true }).then(() => {console.log("Tablas borradas");});
await Rol.sync()
await Permission.sync()
await RolPermissions.sync()
await User.sync()
await City.sync()
await Address.sync()
await Category.sync()
await Product.sync()
await Image.sync()
await Reservation.sync()
await Voucher.sync()
await ReservationDetail.sync()
await Rent.sync()
await PaymentRegister.sync()
await CheckList.sync()
await CheckListItem.sync()
await Purchase.sync()
await Loss.sync();
await LossDetail.sync();
await VerificationCode.sync() 

//Relaciones necesarias  1:1  1:M  N:M
import '../models/0_Asossiations.js'

const cantidadRoles = await Rol.findAndCountAll();
if (cantidadRoles.count <= 0) {
    await Rol.create({name : "Admin", description : "Tiene TODOS los permisos dentro del aplicativo"}).then(() => {console.log("Rol Admin Creado Correctamente");});
    await Rol.create({name: "Cliente", description: "Solo puede ver ciertas cosas de cliente"}).then(() => {console.log("Rol Cliente Creado Correctamente");});
};

const cantidadCiudades = await City.findAndCountAll();
if (cantidadCiudades.count <= 0) {
    const Cities = [
        {name: "Medellín"}, //1
        {name: "Bello"}, //2
        {name: "Copacabana"}, //3
        {name: "Itagüí"}, //4
        {name: "Envigado"}, //5
        {name: "La Estrella"}, //6
        {name: "Girardota"}, //7
        {name: "Barbosa"}, //8
        {name: "Rionegro"}, //9
        {name: "Llano Grande"}, //10
        {name: "Guatapé"}, //
        {name: "La Unión"}, //12
        {name: "Caldas"}, //13
        {name: "San Cristóbal"}, //14
        {name: "San Félix"}, //15
        {name: "San Antonio de Prado"}, //16
        {name: "Guarne"}, //17
        {name: "Marinilla"}, //18
    ]
    Cities.map(async(city) => await City.create(city));
    console.log("Todas las Ciudades Creadas")
}


const cantidadPermissions = await Permission.findAndCountAll();
if (cantidadPermissions.count <= 0) {
    const Permissions = [
        {name : "Acceso al Dashboard", description : "Puede entrar al Dashboard y según los permisos asociados puede actuar dentro del Dashboard"}, //1
        {name : "Usuarios", description : "Tiene permisos para acceder a las funciones de Usuarios"}, //2
        {name : "Roles", description : "Tiene permisos para acceder a las funciones de Roles"}, //3
        {name : "Productos", description : "Tiene permisos para acceder a las funciones de Productos"}, //4
        {name : "Categorias", description : "Tiene permisos para acceder a las funciones de Categorias"}, //5
        {name : "Entradas", description : "Tiene permisos para acceder a las funciones de Entradas de Productos"}, //6
        {name : "Perdidas", description : "Tiene permisos para acceder a las funciones de Perdidas de Productos"}, //7
        {name : "Reservas", description : "Tiene permisos para acceder a las funciones de Reservas"}, //8
        {name : "Agenda", description : "Tiene permisos para acceder a las funciones de Agenda"}, //9
        {name : "Municipios", description : "Tiene permisos para acceder a las funciones de Municipios"}, //10
    ];
    Permissions.map(async(per) => await Permission.create(per));
    console.log("Todos los Permisos Creados")
};

const cantidadRolPermissions = await RolPermissions.findAndCountAll();
if (cantidadRolPermissions.count <= 0) {
    const allPermissions = await Permission.findAll();
    allPermissions.map(async(per) => await RolPermissions.create({id_rol : 1, id_permission : per.id_permission}));
    console.log("Se Añadido todos los permisos al Rol de Admin");
};

const cantidadUsers = await User.findAndCountAll();
if (cantidadUsers.count <= 0) {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash("12345678", salt);
    await User.create({names : "Admin", lastnames: "AguaMarina", dni: "12345678", mail: "aguamarina.alquilermobiliario@gmail.com", password, phone_number: "3026551188", id_rol: 1}).then(() => {console.log("Usuario Admin AguaMarina Creado Correctamente");});
};


console.log("Estamos Ready en el Backend");