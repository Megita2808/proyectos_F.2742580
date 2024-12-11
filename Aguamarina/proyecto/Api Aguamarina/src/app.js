import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import rolesRoutes from './routes/1_Roles.routes.js';
import permissionsRoutes from './routes/2_Permissions.routes.js';
import rolePermissionsRoutes from './routes/3_RolPermissions.routes.js'
import citiesRoutes from './routes/4_Cities.routes.js';
import addressesRoutes from './routes/5_Addresses.routes.js';
import categoriesRoutes from './routes/6_Categories.routes.js';
import productsRoutes from './routes/7_Products.routes.js';
import imagesRoutes from './routes/8_Images.routes.js';
import reservationsRoutes from './routes/10_Reservations.routes.js';
import vouchersRoutes from './routes/10_5_Vouchers.routes.js';
import reservationDetailsRoutes from './routes/11_ReservationDetails.routes.js';
import rentsRoutes from './routes/12_Rents.routes.js';
import paymentRegistersRoutes from './routes/13_PaymentRegisters.routes.js';
import checkListsRoutes from './routes/14_CheckLists.routes.js';
import checkListItemsRoutes from './routes/15_CheckListItems.routes.js';
import purchasesRoutes from './routes/16_Purchases.routes.js';
import lossesRoutes from './routes/17_Losses.routes.js';
import usersRoutes from './routes/18_Users.routes.js';
import verificationCodesRoutes from './routes/19_VerificationCodes.routes.js'
import authenticationsRoutes from './routes/21_Authentications.routes.js'
import cookieParser from 'cookie-parser';


const app = express();

app.options('/', (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, PUT, PATCH, POST, DELETE");
    res.sendStatus(204);
});

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8081'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        } else {
        callback(new Error('Origen no permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'credentials'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan("dev"));

app.get('/', (req, res) => {
    res.json({message : "This is AguaMarina's Api"});
});

app.use('/api/v2', rolesRoutes);
app.use('/api/v2', permissionsRoutes);
app.use('/api/v2', rolePermissionsRoutes);
app.use('/api/v2', citiesRoutes);
app.use('/api/v2', addressesRoutes);
app.use('/api/v2', categoriesRoutes);
app.use('/api/v2', productsRoutes);
app.use('/api/v2', imagesRoutes);
app.use('/api/v2', reservationsRoutes);
app.use('/api/v2', vouchersRoutes);
app.use('/api/v2', reservationDetailsRoutes);
app.use('/api/v2', rentsRoutes);
app.use('/api/v2', paymentRegistersRoutes);
app.use('/api/v2', checkListsRoutes);
app.use('/api/v2', checkListItemsRoutes);
app.use('/api/v2', purchasesRoutes);
app.use('/api/v2', lossesRoutes);
app.use('/api/v2', usersRoutes);
app.use('/api/v2', verificationCodesRoutes);
app.use('/api/v2', authenticationsRoutes);

export default app;