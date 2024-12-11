import sequelize from "../db/sequelize.js";
import Rol from "./1_Rol.model.js";
import Permission from "./2_Permission.model.js";
import RolPermissions from "./3_RolPermissions.model.js";
import User from "./18_User.model.js";
//import City from "./4_City.model.js";
import Address from "./5_Address.model.js";
import Category from "./6_Category.model.js";
import Product from "./7_Product.model.js";
import Image from "./8_Image.model.js";
import Reservation from "./10_Reservation.model.js";
import Voucher from "./10_5_Voucher.model.js";
import ReservationDetail from "./11_ReservationDetail.model.js";
import Rent from "./12_Rent.model.js";
import PaymentRegister from "./13_PaymentRegister.model.js";
import CheckList from "./14_CheckList.model.js";
import CheckListItem from "./15_CheckListItem.model.js";
import Purchase from "./16_Purchase.model.js";
import Loss from "./17_Loss.model.js";
import LossDetail from "./17_5_LossDetail.model.js";
import VerificationCode from "./19_VerificationCode.model.js";



// Relaciones entre Rol y Permission (Muchos a Muchos)

Rol.belongsToMany(Permission, {
    through : RolPermissions,
    foreignKey : 'id_rol',
    as : "permissions"
});
Permission.belongsToMany(Rol, {
    through : RolPermissions,
    foreignKey : 'id_permission',
    as : "roles"
});


// Relación entre User y Rol (Uno a Muchos)
Rol.hasMany(User, {
    foreignKey: "id_rol",
    as: "users"
});
User.belongsTo(Rol, {
    foreignKey: "id_rol",
    as: "role"
});


// Relación entre User y Address (Uno a Muchos)
User.hasMany(Address, {
    foreignKey: "id_user",
    as: "addresses"
});
Address.belongsTo(User, {
    foreignKey: "id_user",
    as: "user"
});


// Relación entre Category y Product (Uno a Muchos)
Category.hasMany(Product, {
    foreignKey: "id_category",
    as: "products"
});
Product.belongsTo(Category, {
    foreignKey: "id_category",
    as: "category"
});


// Relación entre Product y Image (Uno a Muchos)
Product.hasMany(Image, {
    foreignKey: "id_product",
    as: "images"
});
Image.belongsTo(Product, {
    foreignKey: "id_product",
    as: "product"
});

// Relación entre User y Reservation (Uno a Muchos)
User.hasMany(Reservation, {
    foreignKey: "id_user",
    as: "reservations"
});
Reservation.belongsTo(User, {
    foreignKey: "id_user",
    as: "user"
});


// Relación entre Product y ReservationDetail (Uno a Muchos)
Product.hasMany(ReservationDetail, {
    foreignKey: "id_product",
    as: "reservationDetails"
});
ReservationDetail.belongsTo(Product, {
    foreignKey: "id_product",
    as: "product"
});


// Relación entre Reservation y ReservationDetail (Uno a Muchos)
Reservation.hasMany(ReservationDetail, {
    foreignKey: "id_reservation",
    as: "reservationDetails"
});
ReservationDetail.belongsTo(Reservation, {
    foreignKey: "id_reservation",
    as: "reservation"
});

// Relación entre Reservation y Voucher (Uno a Muchos)
Reservation.hasMany(Voucher, {
    foreignKey: "id_reservation",
    as: "vouchers"
});
Voucher.belongsTo(Reservation, {
    foreignKey: "id_reservation",
    as: "reservation"
});

// Relación entre User y Rent (Uno a Muchos)
User.hasMany(Rent, {
    foreignKey: "id_client",
    as: "rents"
});
Rent.belongsTo(User, {
    foreignKey: "id_client",
    as: "client"
});


// Relación entre Rent y PaymentRegister (Uno a Muchos)
Rent.hasMany(PaymentRegister, {
    foreignKey: "id_rent",
    as: "paymentRegisters"
});
PaymentRegister.belongsTo(Rent, {
    foreignKey: "id_rent",
    as: "rent"
});


// Relación entre Rent y CheckList (Uno a Muchos)
Rent.hasMany(CheckList, {
    foreignKey: "id_rent",
    as: "checklists"
});
CheckList.belongsTo(Rent, {
    foreignKey: "id_rent",
    as: "rent"
});


// Relación entre CheckList y CheckListItem (Uno a Muchos)
CheckList.hasMany(CheckListItem, {
    foreignKey: "id_checklist",
    as: "checklistItems",
    onDelete : "CASCADE"
});
CheckListItem.belongsTo(CheckList, {
    foreignKey: "id_checklist",
    as: "checklist"
});

//Relación entre Product y Purchase (Uno a Muchos)
Product.hasMany(Purchase, {
    foreignKey: "id_product",
    as: "Purchase"
});
Purchase.belongsTo(Product, {
    foreignKey: "id_product",
    as: "Product"
})

//Relación entre User y Purchase (Uno a Muchos)
User.hasMany(Purchase, {
    foreignKey: "id_user",
    as: "Purchase"
});
Purchase.belongsTo(User, {
    foreignKey: "id_user",
    as: "User"
})

//Relación entre Product y Loss (Uno a Muchos)
Product.hasMany(Loss, {
    foreignKey: "id_product",
    as: "Loss"
});
Loss.belongsTo(Product, {
    foreignKey: "id_product",
    as: "Product"
})

//Relación entre User y Loss (Uno a Muchos)
User.hasMany(Loss, {
    foreignKey: "id_user",
    as: "Loss"
});
Loss.belongsTo(User, {
    foreignKey: "id_user",
    as: "User"
})




//Relación entre Loss y LossDetails (Uno a Muchos)
Loss.hasMany(LossDetail, {
    foreignKey: "id_loss",
    as: "LossDetail"
});
LossDetail.belongsTo(Loss, {
    foreignKey: "id_loss",
    as: "Loss"
});