const bcrypt = require("bcrypt");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  SaveCode,
  verifyCode,
  updateAndClear,
  getCodeByEmail,
  getRole,
} = require("../repositories/usuario.repository.js");
const {
  createVerify,
  updateVerify,
  getCodigoByEmail,
  getEmailIsInVerification,
} = require("../repositories/verificacion.repository.js");
const { generateToken } = require("../utils/generateToken");
const transporter = require("../utils/mailer");
const { Verificacion } = require("../models/verificacion.model.js");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (user) {
    return res.status(400).json({
      msg: "El correo ingresado ya se encuentra registrado, intente de nuevo",
    });
  }

  function codigoRandom() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  try {
    const code = codigoRandom();
    const expiracion = new Date();
    expiracion.setMinutes(expiracion.getMinutes() + 10);

    const nuevaVerificacion = {
      email: email,
      codigo: code,
      expiracion: expiracion,
    };
    const isMailInVerification = await getEmailIsInVerification(email);
    isMailInVerification
      ? await updateVerify(nuevaVerificacion)
      : await createVerify(nuevaVerificacion);
    const mailOptions = {
      from: "modistadonaluz@gmail.com",
      to: email,
      subject: "Código de verificación",
      html: `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Código de verificación</title>
                <style>
                    body {
                        background-color: #f4f4f4;
                        font-family: Arial, sans-serif;
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }

                    .all, .container {
                        max-width: 500px;
                        width: 100%;
                        margin: 0 auto;
                        border-radius: 8px;
                    }

                    .all {
                        background-color: #f4f4f4;
                        padding: 10px;
                    }

                    .container {
                        background-color: #ffffff;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }

                    .header {
                        background-color: #873780;
                        color: white;
                        padding: 20px;
                        border-radius: 8px 8px 0 0;
                    }

                    .header h1 {
                        margin: 0;
                        font-size: 30px;
                    }

                    /* Contenido principal */
                    .content {
                        padding: 20px;
                    }

                    .content p {
                        font-size: 18px;
                        color: #333;
                        line-height: 1.5;
                        margin: 20px 0;
                    }

                    .verification-code {
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 2px;
                        color: #ffffff;
                        background-color: #873780;
                        padding: 10px 20px;
                        border-radius: 5px;
                        display: inline-block;
                        margin: 20px 0;
                    }

                    .btn {
                        display: inline-block;
                        padding: 12px 25px;
                        font-size: 16px;
                        color: white;
                        background-color: #4CAF50;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }

                    /* Pie de página */
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #555;
                    }

                    /* Modo oscuro */
                    @media (prefers-color-scheme: dark) {
                        body {
                            background-color: #121212;
                            color: #ddd;
                        }

                        .all {
                            background-color: #121212;
                        }

                        .container {
                            background-color: #1e1e1e;
                            box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
                        }

                        .header {
                            background-color: #333;
                            color: white;
                        }

                        .content p {
                            color: #ddd;
                        }

                        .footer {
                            color: #aaa;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="all">
                    <div class="container">
                        <div class="header">
                            <h1>Modisteria D.L</h1>
                        </div>
                        <div class="content">
                            <h2>¡Hola!</h2>
                            <p>Este es tu código de verificación para seguir en el proceso de registro:</p>
                            <div class="verification-code">${code}</div>
                            <p>Ingresa este código para continuar con tu registro.</p>
                        </div>
                        <div class="footer">
                            <p>Si no solicitaste este correo, por favor ignóralo.</p>
                            <p>&copy; 2024 Modisteria D.L. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `,
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: "Código de verificación enviado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error de servidor al obtener código" });
  }
};

exports.createUsuario = async (req, res) => {
  const { nombre, email, telefono, password, roleId, direccion, estadoId } =
    req.body;
  try {
    const encriptada = bcrypt.hashSync(password, 10);
    const newUser = {
      email: email,
      telefono: telefono,
      password: encriptada,
      nombre: nombre,
      roleId: roleId,
      direccion: direccion,
      estadoId: estadoId,
    };
    await createUser(newUser);
    res.status(201).json({ msg: "Usuario creado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getCodeVerification = async (req, res) => {
  const { email } = req.body;
  try {
    const code = await getCodigoByEmail(email);
    if (code != null) {
      res.status(200).json({ msg: `${code}` });
      return true;
    } else {
      res.status(200).json({
        msg: `El correo ${email} no tiene ningún código de recuperación asociado.`,
      });
      return false;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error de servidor al obtener código" });
  }
};

exports.verifyUser = async (req, res) => {
  const { email, codigo, nombre, telefono, password, roleId, estadoId } =
    req.body;
  const savedCode = await getCodigoByEmail(email);
  try {
    if (savedCode !== codigo) {
      return res.status(400).json({
        msg: "El código de verificiación ingresado no coincide, intente de nuevo",
      });
    }
    const rolNombre = await getRole(roleId);
    const encriptada = bcrypt.hashSync(password, 10);
    const newUser = {
      email: email,
      telefono: telefono,
      password: encriptada,
      nombre: nombre,
      roleId: roleId,
      estadoId: estadoId,
    };
    const UserWrol = {
      email: email,
      telefono: telefono,
      password: encriptada,
      nombre: nombre,
      roleId: roleId,
      estadoId: estadoId,
      rol: rolNombre,
    };
    createUser(newUser);
    res.status(200).json({ msg: "Usuario creado con éxito", UserWrol });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al crear usuario" });
  }
};

exports.updateInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const newInfo = req.body;
    await updateUser(id, newInfo);
    const user = await getUserById(id);
    const token = generateToken(user);
    res.status(201).json({ msg: "Usuario actualizado exitosamente", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = req.body;
    await updateUser(id, user);
    res.status(201).json({ msg: "Usuario actualizado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.statusUser = async (req, res) => {
  const { id } = req.params;
  try {
    await statusUser(id);
    res.status(201).json({ msg: "Usuario inactivo" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUser(id);
    res.status(201).json({ msg: "Usuario eliminado" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(401).json({ msg: "Datos invalidos" });
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.sendEmail = async (req, res) => {
  const { asunto, cuerpo, email } = req.body;
  console.log("Email recibido: ", email)
  try {
    const emailOpts = {
      from: "modistadonaluz@gmail.com",
      to: email,
      subject: `${asunto}`,
      html: `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${asunto}</title>
                <style>
                    /* Estilos generales */
                    body {
                        background-color: #f4f4f4;
                        font-family: Arial, sans-serif;
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }

                    .all, .container {
                        max-width: 500px;
                        width: 100%;
                        margin: 0 auto;
                        border-radius: 8px;
                    }

                    .all {
                        background-color: #f4f4f4;
                        padding: 10px;
                    }

                    .container {
                        background-color: #ffffff;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }

                    /* Cabecera */
                    .header {
                        background-color: #873780;
                        color: white;
                        padding: 20px;
                        border-radius: 8px 8px 0 0;
                    }

                    .header h1 {
                        margin: 0;
                        font-size: 30px;
                    }

                    /* Contenido principal */
                    .content {
                        padding: 20px;
                    }

                    .content p {
                        font-size: 18px;
                        color: #333;
                        line-height: 1.5;
                        margin: 20px 0;
                    }

                    .verification-code {
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 2px;
                        color: #ffffff;
                        background-color: #4CAF50;
                        padding: 10px 20px;
                        border-radius: 5px;
                        display: inline-block;
                        margin: 20px 0;
                    }

                    .btn {
                        display: inline-block;
                        padding: 12px 25px;
                        font-size: 16px;
                        color: white;
                        background-color: #4CAF50;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }

                    /* Pie de página */
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #555;
                    }

                    /* Modo oscuro */
                    @media (prefers-color-scheme: dark) {
                        body {
                            background-color: #121212;
                            color: #ddd;
                        }

                        .all {
                            background-color: #121212;
                        }

                        .container {
                            background-color: #1e1e1e;
                            box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
                        }

                        .header {
                            background-color: #333;
                            color: white;
                        }

                        .content p {
                            color: #ddd;
                        }

                        .footer {
                            color: #aaa;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="all">
                    <div class="container">
                        <div class="header">
                            <h1>Modisteria D.L</h1>
                        </div>
                        <div class="content">
                            <p>${cuerpo}</p>
                        </div>
                        <div class="footer">
                            <p>Si no solicitaste este correo, por favor ignóralo.</p>
                            <p>&copy; 2024 Modisteria D.L. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
`,
    };
    await transporter.sendMail(emailOpts);
    res.status(200).send("Correo enviado")
  } catch (error) {
    console.error(error)
    res.status(500).send("Error de servidor")
  }
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  function codigoRandom() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).send("Correo no encontrado");
    }
    const code = codigoRandom();

    const expiracion = new Date();
    expiracion.setMinutes(expiracion.getMinutes() + 10);
    SaveCode(email, code, expiracion);
    const emailOpts = {
      from: "modistadonaluz@gmail.com",
      to: email,
      subject: "Código de recuperación",
      html: `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Código de recuperación</title>
                <style>
                    body {
                        background-color: #f4f4f4;
                        font-family: Arial, sans-serif;
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }

                    .all, .container {
                        max-width: 500px;
                        width: 100%;
                        margin: 0 auto;
                        border-radius: 8px;
                    }

                    .all {
                        background-color: #f4f4f4;
                        padding: 10px;
                    }

                    .container {
                        background-color: #ffffff;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }

                    .header {
                        background-color: #873780;
                        color: white;
                        padding: 20px;
                        border-radius: 8px 8px 0 0;
                    }

                    .header h1 {
                        margin: 0;
                        font-size: 30px;
                    }

                    /* Contenido principal */
                    .content {
                        padding: 20px;
                    }

                    .content p {
                        font-size: 18px;
                        color: #333;
                        line-height: 1.5;
                        margin: 20px 0;
                    }

                    .verification-code {
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 2px;
                        color: #ffffff;
                        background-color: #873780;
                        padding: 10px 20px;
                        border-radius: 5px;
                        display: inline-block;
                        margin: 20px 0;
                    }

                    .btn {
                        display: inline-block;
                        padding: 12px 25px;
                        font-size: 16px;
                        color: white;
                        background-color: #4CAF50;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }

                    /* Pie de página */
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #555;
                    }

                    /* Modo oscuro */
                    @media (prefers-color-scheme: dark) {
                        body {
                            background-color: #121212;
                            color: #ddd;
                        }

                        .all {
                            background-color: #121212;
                        }

                        .container {
                            background-color: #1e1e1e;
                            box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
                        }

                        .header {
                            background-color: #333;
                            color: white;
                        }

                        .content p {
                            color: #ddd;
                        }

                        .footer {
                            color: #aaa;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="all">
                    <div class="container">
                        <div class="header">
                            <h1>Modisteria D.L</h1>
                        </div>
                        <div class="content">
                            <h2>¡Hola!</h2>
                            <p>Este es tu código de verificación para seguir en el proceso de recuperación de contraseña:</p>
                            <div class="verification-code">${code}</div>
                            <p>Ingresa este código para recuperar tu contraseña.</p>
                        </div>
                        <div class="footer">
                            <p>Si no solicitaste este correo, por favor ignóralo.</p>
                            <p>&copy; 2024 Modisteria D.L. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>`,
    };

    await transporter.sendMail(emailOpts);
    res.status(200).send("Código de recuperación enviado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error de servidor");
  }
};
exports.getCodePassword = async (req, res) => {
  const { email } = req.body;
  try {
    const code = await getCodeByEmail(email);
    if (code != null) {
      res.status(200).json({ msg: `${code}` });
    } else {
      res.status(200).json({
        msg: `El correo ${email} no tiene ningún código de recuperación asociado.`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error de servidor al obtener código" });
  }
};
exports.resetPassword = async (req, res) => {
  const { email, codigo, newPassword } = req.body;
  try {
    const user = await verifyCode(email, codigo);
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Código incorrecto, intente de nuevo" });
    }
    const encriptada = bcrypt.hashSync(newPassword, 10);
    updateAndClear(email, encriptada);
    res.status(200).json({ msg: "Contraseña actualizada con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al restablecer la contraseña" });
  }
};
exports.isYourCurrentPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(200).json({ isYourCurrentPassword: false });
    res.status(200).json({ isYourCurrentPassword: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resetCurrentPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ msg: "No se encontró el usuario" });
    }
    const encriptada = bcrypt.hashSync(newPassword, 10);
    updateAndClear(email, encriptada);
    const token = generateToken(user);
    res
      .status(200)
      .json({ msg: "Contraseña actualizada con éxito.", token: token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al restablecer la contraseña" });
  }
};
