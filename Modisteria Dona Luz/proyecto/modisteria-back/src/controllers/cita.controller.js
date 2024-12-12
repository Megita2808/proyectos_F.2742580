const {
  getAllCitas,
  getCitaById,
  createCita,
  updateCita,
  deleteCita,
  getCitasByUserId,
  statusCita,
  getCitaInsumosByCitaId,
  returnInsumoStock,
} = require("../repositories/cita.repository");
const {
  createCitaInsumo,
  getInsumoStock,
  discountInsumo,
} = require("../repositories/cita_insumo.repository");

const {
  helperImg,
  uploadToCloudinary,
  getPublicIdFromUrl,
  deleteFromCloudinary,
  gestionImagen,
} = require("../utils/image");
const transporter = require("../utils/mailer");

const { getEmailByUserId } = require("../repositories/usuario.repository");
const moment = require("moment");
const { format } = require("morgan");
const { createVenta } = require("../repositories/venta.repository");

exports.getAllCitas = async (req, res) => {
  try {
    const citas = await getAllCitas(req.query.estadoId);
    res.status(200).json(citas);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getCitaById = async (req, res) => {
  const { id } = req.params;
  try {
    const cita = await getCitaById(id);
    res.status(200).json(cita);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCitasByUsuarioId = async (req, res) => {
  const { usuarioId } = req.params;
  const estadoId = req.query.estadoId || false;
  try {
    const citas = await getCitasByUserId(usuarioId, estadoId);
    res.status(200).json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener citas", error });
  }
};

exports.createCita = async (req, res) => {
  const { fecha, objetivo, usuarioId, estadoId } = req.body;

  try {
    const fechaActual = new Date();
    const limite = new Date();
    limite.setMonth(limite.getMonth() + 2);

    const fechaCita = new Date(fecha);
    if (fechaCita > limite) {
      return res
        .status(400)
        .json({ msg: "La fecha de la cita no puede ser superior a 2 meses" });
    }
    if (fechaCita < fechaActual) {
      return res
        .status(400)
        .json({ msg: "La fecha de la cita ya pasó, intenta de nuevo" });
    }
    const fechaMinima = new Date(fechaActual);
    fechaMinima.setDate(fechaActual.getDate() + 3);
    if (fechaCita < fechaMinima) {
      return res.status(400).json({
        msg: "La fecha de la cita debe ser programada mínimo con 3 días de anticipación",
      });
    }
    const dia_semana = fechaCita.getDay();
    if (dia_semana === 0 || dia_semana === 6) {
      return res
        .status(400)
        .json({ msg: "Solo se atiende de lunes a viernes" });
    }
    const hora = fechaCita.getHours();
    if (hora < 8 || hora > 17) {
      return res
        .status(400)
        .json({ msg: "Solo se atiende de 8 a.m a 5 p.m", hora });
    }

    let referencia = null;
    if (req.file) {
      const processedBuffer = await helperImg(req.file.buffer, 300);
      const result = await uploadToCloudinary(processedBuffer);
      referencia = result.url;
    }

    const citaEstadoId = estadoId === 11 ? 11 : 9;

    const newCitaData = {
      fecha: new Date(req.body.fecha),
      objetivo,
      usuarioId,
      estadoId: citaEstadoId,
      referencia,
    };

    const newCita = await createCita(newCitaData);

    res.status(201).json({
      msg: "Cita creada exitosamente.",
      cita: newCita,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.crearCita = async (req, res) => {
  const { fecha, objetivo, usuarioId, precio, tiempo, datosInsumos, estadoId } =
    req.body;
  try {
    const fechaActual = new Date();
    const limite = new Date();
    limite.setMonth(limite.getMonth() + 2);
    const fechaCita = new Date(fecha);
    if (fechaCita > limite) {
      return res
        .status(400)
        .json({ msg: "La fecha de la cita no puede ser superior a 2 meses" });
    }
    if (fechaCita < fechaActual) {
      return res
        .status(400)
        .json({ msg: "La fecha de la cita ya pasó, intenta de nuevo" });
    }
    let referencia = null;
    if (req.file) {
      const processedBuffer = await helperImg(req.file.buffer, 300);
      const result = await uploadToCloudinary(processedBuffer);
      referencia = result.url;
    }
    let userId = 12;
    if (usuarioId) {
      userId = usuarioId;
    }
    const newCitaData = {
      fecha: new Date(req.body.fecha),
      objetivo,
      usuarioId: userId,
      estadoId,
      referencia,
      precio,
      tiempo,
    };
    const newCita = await createCita(newCitaData);
    const citaId = newCita.id;

    const nuevaVenta = await createVenta({
      fecha: new Date(),
      citaId: citaId,
      imagen: null,
      nombrePersona: userId,
      valorFinal: 0,
      valorPrendas: 0,
      valorDomicilio: 0,
      metodoPago: "transferencia",
      estadoId: 3,
    });

    for (const dataInsumos of datosInsumos) {
      const { insumo_id, cantidad_utilizada } = dataInsumos;
      const insumoStock = await getInsumoStock(insumo_id);
      if (insumoStock < cantidad_utilizada) {
        return res.status(400).json({
          msg: `No hay suficiente stock para el insumo con ID ${insumo_id}. Disponible: ${insumoStock}, Requerido: ${cantidad_utilizada}.`,
        });
      }
      const newCitaInsumos = {
        cita_id: citaId,
        insumo_id: insumo_id,
        cantidad_utilizada: cantidad_utilizada,
      };
      await createCitaInsumo(newCitaInsumos);
      await discountInsumo(insumo_id, cantidad_utilizada);
    }

    res.status(201).json({
      msg: "Cita creada exitosamente",
      cita: newCita,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
exports.crearCitaAdmin = async (req, res) => {
  const { fecha, objetivo, usuarioId, precio, tiempo, estadoId } = req.body;
  try {
    const fechaActual = new Date();
    const limite = new Date();
    limite.setMonth(limite.getMonth() + 2);
    const fechaCita = new Date(fecha);
    if (fechaCita > limite) {
      return res
        .status(400)
        .json({ msg: "La fecha de la cita no puede ser superior a 2 meses" });
    }
    if (fechaCita < fechaActual) {
      return res
        .status(400)
        .json({ msg: "La fecha de la cita ya pasó, intenta de nuevo" });
    }
    let referencia = null;
    if (req.file) {
      const processedBuffer = await helperImg(req.file.buffer, 300);
      const result = await uploadToCloudinary(processedBuffer);
      referencia = result.url;
    }
    let userId = 12;
    if (usuarioId) {
      userId = usuarioId;
    }
    const newCitaData = {
      fecha: new Date(req.body.fecha),
      objetivo,
      usuarioId: userId,
      estadoId,
      referencia,
      precio,
      tiempo,
    };
    const newCita = await createCita(newCitaData);
    const citaId = newCita.id;

    const nuevaVenta = await createVenta({
      fecha: new Date(),
      citaId: citaId,
      imagen: null,
      nombrePersona: userId,
      valorFinal: 0,
      valorPrendas: 0,
      valorDomicilio: 0,
      metodoPago: "transferencia",
      estadoId: 3,
    });
    res.status(201).json({
      msg: "Cita creada exitosamente",
      cita: newCita,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCitaInsumos = async (req, res) => {
  const { id } = req.params;
  const { datosInsumos } = req.body;
  try {
    const existingCita = await getCitaById(id);
    if (!existingCita) {
      return res
        .status(500)
        .json({ msg: "Cita no encontrada, intente de nuevo." });
    }
    for (const dataInsumos of datosInsumos) {
      const { insumo_id, cantidad_utilizada } = dataInsumos;
      const insumoStock = await getInsumoStock(insumo_id);
      if (insumoStock < cantidad_utilizada) {
        return res.status(400).json({
          msg: `No hay suficiente stock para el insumo con ID ${insumo_id}. Disponible: ${insumoStock}, Requerido: ${cantidad_utilizada}.`,
        });
      }

      const newCitaInsumos = {
        cita_id: id,
        insumo_id: insumo_id,
        cantidad_utilizada: cantidad_utilizada,
      };
      await createCitaInsumo(newCitaInsumos);
      await discountInsumo(insumo_id, cantidad_utilizada);
    }
    res.status(200).json({ msg: "Insumos actualizados correctamente." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateSPT = async (req, res) => {
  //Update Status Price and Time
  try {
    const { id } = req.params;
    const { estadoId, tiempo, precio } = req.body;

    const existingCita = await getCitaById(id);
    if (!existingCita) {
      return res
        .status(500)
        .json({ msg: "Cita no encontrada, intente de nuevo." });
    }

    const usuarioId = existingCita.usuarioId;
    const email = await getEmailByUserId(usuarioId);
    const mailOptions = {
      from: "modistadonaluz@gmail.com",
      to: email,
      subject: "¡Cita aprobada por la modista!",
      html: `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cita aprobada</title>
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
                            <p>Este correo es para informarte que tu cita ha sido aprobada por la modista.</p>
                            <p>Acepta la cotización para confirmar asistencia a la cita</p>
                        </div>
                        <div class="footer">
                            <p>Si la cita que acaba de ser aceptada por la modista no la confirmas para un día antes de la fecha, será cancelada.</p>
                            <p>&copy; 2024 Modisteria D.L. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `,
    };
    await transporter.sendMail(mailOptions);

    const updatedCita = {
      estadoId,
      tiempo,
      precio,
    };
    await updateCita(id, updatedCita);
    res.status(201).json({
      msg: "Estado, precio, tiempo y fecha de finalización de cita actualizado exitosamente",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//ACEPTAR Y CANCELAR CITA POR PARTE DEL CLIENTE

exports.aceptarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await getCitaById(id);

    if (cita.estadoId !== 10) {
      return res
        .status(400)
        .json({ error: "La cita aún no ha sido aprobada." });
    }
    console.log("Body recibido:", req.body);
    console.log("Archivo recibido:", req.file);

    let imagen = null;
    try {
      if (req.file) {
        imagen = await gestionImagen(req);
      }
    } catch (error) {
      console.error("Error gestionando imagen:", error);
    }

    const { nombrePersona } = req.body;
    if (!nombrePersona) {
      return res
        .status(400)
        .json({ msg: "Se requiere el nombre de la persona" });
    }

    const nuevaVenta = await createVenta({
      fecha: new Date(),
      citaId: cita.id,
      imagen,
      nombrePersona,
      valorFinal: 0,
      valorPrendas: 0,
      valorDomicilio: 0,
      metodoPago: "transferencia",
      estadoId: 3,
    });

    await statusCita(id, 11);

    res.status(201).json({ msg: "Cita aceptada" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.cancelarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await getCitaById(id);
    if (cita.estadoId == 10) {
      const citaInsumos = await getCitaInsumosByCitaId(id);
      for (const citaInsumo of citaInsumos) {
        const { insumo_id, cantidad_utilizada } = citaInsumo;
        await returnInsumoStock(insumo_id, cantidad_utilizada);
      }
    }

    await statusCita(id, 12);
    res.status(201).json({ msg: "Cita cancelada" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.cancelCita = async (req, res) => {
  const { id } = req.params;
  try {
    const cita = await getCitaById(id);
    if (!cita) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }
    const usuarioId = cita.usuarioId;
    const email = await getEmailByUserId(usuarioId);

    if (cita.estadoId === 9) {
      await statusCita(id, 12);
      const mailOptions = {
        from: "modistadonaluz@gmail.com",
        to: email,
        subject: "¡Cita cancelada por la modista!",
        html: `<!DOCTYPE html>
              <html lang="es">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Cita cancelada</title>
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
                              <p>Lamentamos informarte que tu solicitud no puede continuar con el proceso de cotización en este momento. Esto puede deberse a que no cumple con los requisitos necesarios, a razones operativas, o a disponibilidad limitada. </p>
                              <p>Agradecemos tu interés y te invitamos a revisar nuestros servicios para enviar una nueva solicitud en el futuro. Gracias por tu comprensión.</p>
                          </div>
                          <div class="footer">
                              <p>&copy; 2024 Modisteria D.L. Todos los derechos reservados.</p>
                          </div>
                      </div>
                  </div>
              </body>
              </html>
              `,
      };
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ msg: "Cita cancelada" });
    } else if (cita.estadoId === 10) {
      await statusCita(id, 12);
      const mailOptions = {
        from: "modistadonaluz@gmail.com",
        to: email,
        subject: "¡Cita cancelada por la modista!",
        html: `<!DOCTYPE html>
              <html lang="es">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Cita cancelada</title>
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
                          text-align: start;
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
                              text-align: start;
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
                              <p>Lamentamos informarte que tu solicitud no puede continuar con el proceso de cotización en este momento. Esto puede deberse a razones operativas, o a imprevistos con la modista. </p>
                              <p>Agradecemos tu interés y te invitamos a revisar nuestros servicios para enviar una nueva solicitud en el futuro. Gracias por tu comprensión.</p>
                          </div>
                          <div class="footer">
                              <p>&copy; 2024 Modisteria D.L. Todos los derechos reservados.</p>
                          </div>
                      </div>
                  </div>
              </body>
              </html>
              `,
      };
      await transporter.sendMail(mailOptions);
    } else if (cita.estadoId === 11) {
      return res.status(400).json({
        msg: "No puedes cancelar una cita que ya está aceptada.",
      });
    } else if (cita.estadoId === 12) {
      return res.status(400).json({
        msg: "Esta cita ya fue cancelada.",
      });
    } else if (cita.estadoId === 13) {
      return res.status(400).json({
        msg: "No puedes cancelar una cita que ya ha terminado.",
      });
    }
    return res.status(200).json({ msg: "Cita cancelada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.updateCita = async (req, res) => {
  const { id } = req.params;
  const { estadoId, tiempo, precio, usuarioId, fecha, objetivo } = req.body;
  try {
    const existingCita = await getCitaById(id);

    const updatedCita = {
      estadoId: estadoId || existingCita.estadoId,
      tiempo: tiempo || existingCita.tiempo,
      precio: precio || existingCita.precio,
      usuarioId: usuarioId || existingCita.usuarioId,
      fecha: fecha || existingCita.fecha,
      objetivo: objetivo || existingCita.objetivo,
    };

    const citaActualizada = await updateCita(id, updatedCita);
    res.status(201).json({ msg: "Cita actualizada exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.statusCita = async (req, res) => {
  const { id } = req.params;
  try {
    await statusCita(id);
    res.status(201).json({ msg: "cita inactiva" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCita = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCita(id);
    res.status(201).json({ msg: "Cita eliminada" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
