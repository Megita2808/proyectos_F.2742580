import VerificactionsCodes from '../models/19_VerificationCode.model.js';
import bcrypt from 'bcrypt'
import { sendMailOptions } from "../utils/nodemailer.js";

export const getVerificationCodes = async(req, res) => {
    const codes = await VerificactionsCodes.findAll();
    try {
        res.status(200).json({
            ok : true,
            status : 200,
            body : codes
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const generateCode = async(req, res) => {
    const {mail} = req.body;
    const code = generateRandomCode();

    const salt = await bcrypt.genSalt(10);
    const code_bcrypt = await bcrypt.hash(code.toString(), salt);

    const response = await fetch('http://worldtimeapi.org/api/timezone/America/Bogota',{method : 'GET'});
    const data = await response.json();
    let original = await rightNow();
    original.setMinutes(original.getMinutes() + 15);
    const expires_at = original;

    try {
        const [createdCode, created] = await VerificactionsCodes.upsert({mail, code : code_bcrypt, expires_at});

        const response = sendMailOptions(mail, "Codigo de Verificación", "Bienvenido a AguaMarina!!", 
            `<p>¡Gracias por unirte a nuestra comunidad! Estamos emocionados de tenerte con nosotros.</p>
            <p>Tu código de verificación es:</p>
            <div class="verification-code">${code}</div>
            <p>Utiliza este código para verificar de que éste es tu correo para seguir con tu registro</p>`);

        res.status(201).json({
            ok: true,
            status: 201,
            message: `Hemos enviado un código de verificación a tu correo, recuerda revisar los correos no deseados`,
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            status: 400,
            err
        });
    };
};

export const validateVerificationCode = async(req, res) => {
    const {mail} = req.body;
    const codeStr = (req.body.code).toString();

    try {
        const allCodes = await VerificactionsCodes.findAll({where : {mail}});
        if (allCodes.length === 0) {
            return res.status(201).json({ok: false, message: "No se encontró un código para este correo"})
        };

        const storedCode = allCodes[0].code;
        const expires_at = new Date(allCodes[0].expires_at);

        const currentTime = await rightNow();

        const isMatch = await bcrypt.compare(codeStr, storedCode);
        if (!isMatch) {
            return res.status(201).json({ok: false, message: 'Código de verificación incorrecto'});
        };

        if (currentTime > expires_at) {
            return res.status(201).json({ ok: false, message: "El código de Verificación ha expirado"});
        };

        deleteCode(mail);
        return res.status(201).json({ok: true, message: 'Código de verificación correcto'});
    } catch(err) {
        res.status(400).json({
            ok: false,
            status: 400,
            err
        });
    };
};






//Funciones

const generateRandomCode = () => {
    return Math.floor(Math.random() * 900000 + 100000)
}

const deleteCode = async(mail) => {
    await VerificactionsCodes.destroy({where : {mail}});
}

const rightNow = async() => {
    const response = await fetch('http://worldtimeapi.org/api/timezone/America/Bogota',{method : 'GET'});
    const data = await response.json();
    const original = new Date(data.utc_datetime);
    return original;
};