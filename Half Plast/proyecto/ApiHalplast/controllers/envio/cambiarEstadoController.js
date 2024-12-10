
const mongoose = require('mongoose');
const { response } = require('express');
const nodemailer = require('nodemailer');

const Usuario = require('../../modules/usuario/usuarioModule');
const Envio = require('../../modules/envio/envioModule');
const Venta = require('../../modules/venta/ventaModule');
const EstadoEnvio = require('../../modules/estadoEnvio');

const enviosModificarEstadoPost = async (req, res) => {
    const { id_envio, id_venta, estadoEntrada, EstadoEntradaDescripcion, motivoEntrada } = req.body;
    try {
        let envio
        let ventaData

        if ((id_envio && id_envio !== '') && (!id_venta || id_venta === '')){
            envio = await Envio.findByIdAndUpdate(id_envio, { estadoEnvio: estadoEntrada } );
            if (!envio) {
                return res.status(404).json({ msg: 'Envío no encontrado' });
            }
            ventaData = await Venta.findByIdAndUpdate(envio.venta, { estadoVenta: estadoEntrada }).populate('usuario');
            if (!ventaData) {
                return res.status(404).json({ msg: 'Venta no encontrada' });
            }
        }else if ((id_venta && id_venta !== '') && (!id_envio || id_envio === '')){
            ventaData = await Venta.findByIdAndUpdate(id_venta, { estadoVenta: estadoEntrada }).populate('usuario');
            if (!ventaData) {
                return res.status(404).json({ msg: 'Venta no encontrada' });
            }
        }

        if(ventaData){
            const usuarioData = await Usuario.findById(ventaData.usuario._id);
            if (!usuarioData) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }
            let estadoDatos
            if (!envio){
                estadoDatos = await EstadoEnvio.findOne({ idVenta: ventaData._id});
                if (!estadoDatos) {
                    estadoDatos = await EstadoEnvio.create({
                        idVenta: ventaData._id,
                        EstadoEnvio: [
                          {
                            motivo: motivoEntrada === '' ? estadoEntrada : motivoEntrada !== '' ? motivoEntrada : 'Sin motivo',
                            descripcion: EstadoEntradaDescripcion !== '' ? EstadoEntradaDescripcion : 'Sin descripcion',
                          },
                        ],
                    });
                    await estadoDatos.save();
                }else{
                    estadoDatos = await EstadoEnvio.findByIdAndUpdate(
                        estadoDatos._id,
                        {
                          $push: {
                            EstadoEnvio: {
                                motivo: motivoEntrada === '' ? estadoEntrada : motivoEntrada !== '' ? motivoEntrada : 'Sin motivo',
                                descripcion: EstadoEntradaDescripcion !== '' ? EstadoEntradaDescripcion : 'Sin descripcion',
                                timestamp: new Date(),
                            },
                          },
                        },
                        { new: true }
                    );
                }
            }else{                
                estadoDatos = await EstadoEnvio.findOne({ idEnvio: envio._id});
                if (!estadoDatos) {
                    estadoDatos = await EstadoEnvio.create({
                        idEnvio: envio._id,
                        EstadoEnvio: [
                            {
                                motivo: motivoEntrada === '' ? estadoEntrada : motivoEntrada !== '' ? motivoEntrada : 'Sin motivo',
                                descripcion: EstadoEntradaDescripcion !== '' ? EstadoEntradaDescripcion : 'Sin descripcion',
                                timestamp: new Date(),
                            },
                        ],
                    });
                    await estadoDatos.save();
                }else{
                    estadoDatos = await EstadoEnvio.findByIdAndUpdate(
                        estadoDatos._id,
                        {
                        $push: {
                            EstadoEnvio: {
                                motivo: motivoEntrada === '' ? estadoEntrada : motivoEntrada !== '' ? motivoEntrada : 'Sin motivo',
                                descripcion: EstadoEntradaDescripcion !== '' ? EstadoEntradaDescripcion : 'Sin descripcion',
                                timestamp: new Date(),
                            },
                        },
                        },
                        { new: true }
                    );
                }   
            }

            const correoUsuario = usuarioData.correo;
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            let mensajeCorreo = `Su nuevo estado de envío es ${estadoEntrada}.`;

            if (EstadoEntradaDescripcion && motivoEntrada) {
              mensajeCorreo += ` También, tenga en cuenta lo siguiente: ${EstadoEntradaDescripcion} causado por el siguiente motivo: ${motivoEntrada}.`;
            }

            const mailOptions = {   
                from: 'zsantiagohenao@gmail.com',
                to: correoUsuario,
                subject: 'Actualización de estado de envío',
                html: `
                  <!DOCTYPE html>
                  <html lang="es">
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Actualización de Envío</title>
                      <style>
                          body {
                              font-family: Arial, sans-serif;
                              background-color: #f4f4f4;
                              margin: 0;
                              padding: 0;
                              color: #333;
                          }
                          .container {
                              width: 100%;
                              max-width: 600px;
                              margin: 0 auto;
                              background-color: #fff;
                              border-radius: 8px;
                              overflow: hidden;
                              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                          }
                          .header {
                              background-color: #007bff;
                              color: #fff;
                              padding: 20px;
                              text-align: center;
                          }
                          .header h1 {
                              margin: 0;
                              font-size: 24px;
                          }
                          .content {
                              padding: 20px;
                              line-height: 1.6;
                          }
                          .content p {
                              margin: 0 0 10px;
                          }
                          .footer {
                              background-color: #f8f9fa;
                              padding: 10px;
                              text-align: center;
                              font-size: 12px;
                              color: #6c757d;
                          }
                      </style>
                  </head>
                  <body>
                      <div class="container">
                          <div class="header">
                              <h1>Actualización de su Envío</h1>
                          </div>
                          <div class="content">
                              <p>Estimado ${usuarioData.nombre},</p>
                              <p>${mensajeCorreo}</p>
                              <p>Gracias por confiar en nuestro servicio. Si tiene alguna pregunta, no dude en contactarnos.</p>
                          </div>
                          <div class="footer">
                              <p>Este es un correo generado automáticamente, por favor no responda.</p>
                              <p>&copy; ${new Date().getFullYear()} Halplast. Todos los derechos reservados.</p>
                          </div>
                      </div>
                  </body>
                  </html>
                `,
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ msg: 'Error al enviar el correo' });
                } else {
                    res.json({ msg: 'Correo enviado correctamente' });
                }
            });
            return res.status(200).json({ msg: 'Datos modificados con exito' });
        }else{
            return res.status(400).json({ msg: 'Debe seleccionar un envío o venta' });
        }


    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

const obtenerEstadoEnvio = async (req, res) => {
    const { id_envio, id_venta } = req.body;
  
    if ((!id_envio || id_envio === '') && (!id_venta || id_venta === '')) {
      return res.status(400).json({
        error: 'Debe proporcionar al menos un identificador: idVenta o idEnvio.',
      });
    }
  
    if ((id_envio|| id_envio !== '') && (id_venta || id_venta !== '')) {
      return res.status(400).json({
        error: 'Solo debe proporcionar un identificador: idVenta o idEnvio.',
      });
    }
  
    try {
      const filtro = id_venta ? { idVenta: id_venta } : { idEnvio: id_envio };
  
      const estadoEnvio = await EstadoEnvio.findOne(filtro)
  
      if (!estadoEnvio) {
        return res.status(404).json({
          error: 'No se encontró ningún estado de envío para el identificador proporcionado.',
        });
      }
  
      return res.status(200).json(estadoEnvio);
    } catch (error) {
      console.error(`Error al obtener el estado de envío: ${error.message}`);
      return res.status(500).json({
        error: 'Ocurrió un error al obtener el estado de envío. Por favor, intente nuevamente más tarde.',
      });
    }
};
  
module.exports = {
    enviosModificarEstadoPost,
    obtenerEstadoEnvio
};