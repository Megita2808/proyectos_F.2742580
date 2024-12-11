import Users from "../models/18_User.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import "../config.js";
import { sendMailOptions } from "../utils/nodemailer.js";
import { getNamesPermissionsByRolFunc } from "./3_RolPermissions.controller.js";

export const validateLogin = async(req, res) => {
    const {mail, password} = req.body
    const passwordStr = password.toString();
    try {
        const users = await Users.findAll({where : {mail}})
        if (users.length <= 0) {
            return res.status(200).json({
                message : "No existe una cuenta con este correo",
                logged : false
            })
        }
        const user = users[0]
        const active = user.status

        
        const isMatch =  await bcrypt.compare(passwordStr, user.password)
        if (isMatch) {
            if(!active) {
                return res.status(200).json({
                    message : "No puedes iniciar sesión ahora, tu usuario está Inhabilitado",
                    logged : false
                })
            }
            
            const payload = {
                id_user : user.id_user,
                names : user.names,
                lastnames : user.lastnames,
                dni : user.dni,
                mail : user.mail,
                // password : user.password,
                phone_number : user.phone_number,
                id_rol : user.id_rol,
                status : user.status
            }
            const accessToken = generateAccessToken({id_user : payload.id_user})
            // res.cookie('jwt_ag', accessToken, {
            //     httpOnly: true,
            //     secure: false /*process.env.NODE_ENV === 'production'*/,
            //     maxAge: 12 * 60 * 60 * 1000,
            //     sameSite: 'None'
            // }) 
            res.status(200).header('authorization', accessToken).json({
                    message : "Inicio de Sesión Correcto",
                    data : {id_user : payload.id_user, id_rol : payload.id_rol},
                    token : accessToken,
                    logged : true
                }
            )
        } else {
            await res.status(400).json({
                message : "Contraseña Incorrecta",
                logged : false
            })
        }
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            error : err.message || err
        });
    };
}

export function generateAccessToken(payload) {
    return  jwt.sign(payload, process.env.SECRET_JWT, {expiresIn : '12h'})
}

export const validateToken = (req, res, next) => {
    const token = req.cookies.jwt_ag || req.headers['authorization'] || req.body.token;
  
    if (!token) {
      return res.status(401).json({ message: 'No Autorizado: No se proporcionó un token' });
    }
  
    jwt.verify(token, process.env.SECRET_JWT, (err, payload) => {
        if (err) {
          console.log('Error en la verificación del token:', err);
          return res.status(403).json({ message: 'Token inválido o expirado' });
        }
        console.log('Token Válido');
        req.user = payload;
        next();
    });
};

export const validatePermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
          const id_user = req.user.id_user;
          const user = await Users.findByPk(id_user);
          if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
          }
          const permissions = await getNamesPermissionsByRolFunc(user.id_rol);
          console.log("Permisos chequeados: ", permissions)
    
          if (!permissions.includes(requiredPermission)) {
            return res.status(403).json({ message: 'No tienes permisos para entrar aquí' });
          }
    
          next();
        } catch(err) {
            res.status(400).json({
                ok : false,
                status : 400,
                err
            });
        };
      };
};

export const validateLogout = async(req, res) => {
    try {
        res.clearCookie('jwt_ag', { path : '/'});
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Logout Successfully"
        });
    } catch (err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    }
};

export const checkAuth = async(req, res) => {
    if (req.cookie.jwt_ag) {
        res.json({logged : true});
    } else {
        res.json({logged : false})
    }
};

export const checkCookie = async(req, res) => {
    const jwtCookie = req.body.token;

    if (jwtCookie) {
        try {
            const payload = jwt.verify(jwtCookie, process.env.SECRET_JWT);
            return res.status(200).json({
                ok : true,
                status : 200,
                message : "Cookie Checked",
                body : payload
            });
        } catch (err) {
            return res.status(400).json({
                ok : false,
                status : 400,
                err
            });
        }
    } else {
        return res.status(200).json({
            ok : false,
            status : 200,
            message : "Cookie or Token Null"
        });
    }
};

export const forgotPassword = async (req, res) => {
    const { mail } = req.body;

    try {
        const users = await Users.findAll({ where: { mail } });
        console.log("usuarios:", users);
        if (users <= 0) {
            return res.status(200).json({
                message: "No existe una cuenta con este correo",
                ok: false
            });
        };

        const user = users[0];

        const payload = { id_user: user.id_user };
        const resetToken = jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '15m' });
        const resetLink = `${process.env.CLIENT_URL}/newPassword?token=${resetToken}`;
        
        const response = sendMailOptions(mail, "prueba", "Este es el Titulo", `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p><a class="btn-link" href="${resetLink}">Restablecer contraseña</a>`);

        console.log(response)

        return res.status(200).json({
            message: `Revisa la bandeja de entrada de tu correo "${user.mail}"`,
            ok: true
        });

    } catch (err) {
        return res.status(400).json({
            ok: false,
            status: 400,
            err: err.message || err
        });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        
        const user = await Users.findByPk(decoded.id_user);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
                ok: false
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword.toString(), 10);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Contraseña actualizada con éxito, Inicia Sesión",
            ok: true
        });

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(400).json({
                message: "El token ha expirado",
                ok: false
            });
        }

        return res.status(400).json({
            ok: false,
            status: 400,
            err: err.message || err
        });
    }
};

export const getRolAndPermissionsByUser = async (req, res) => {
    const {id_user} = req.params;
    try {
        const user = await Users.findByPk(id_user)
        if (users.length <= 0) {
            return res.status(200).json({
                message : "No existe una cuenta con este correo",
                logged : false
            })
        }
        const active = user.status

        
        const isMatch =  await bcrypt.compare(passwordStr, user.password)
        if (isMatch) {
            if(!active) {
                return res.status(200).json({
                    message : "No puedes iniciar sesión ahora, tu usuario está Inhabilitado",
                    logged : false
                })
            }
            
            const payload = {
                id_user : user.id_user,
                names : user.names,
                lastnames : user.lastnames,
                dni : user.dni,
                mail : user.mail,
                // password : user.password,
                phone_number : user.phone_number,
                id_rol : user.id_rol,
                status : user.status
            }
            const accessToken = generateAccessToken({id_user : payload.id_user})
            res.status(200).header('authorization', accessToken).json({
                    message : "Inicio de Sesión Correcto",
                    data : {id_user : payload.id_user, id_rol : payload.id_rol},
                    token : accessToken,
                    logged : true
                }
            )
        } else {
            await res.status(400).json({
                message : "Contraseña Incorrecta",
                logged : false
            })
        }
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            error : err.message || err
        });
    };

}