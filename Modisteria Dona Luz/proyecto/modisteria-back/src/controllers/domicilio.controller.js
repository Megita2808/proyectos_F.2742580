const {
  getAllDomicilios,
  getDomicilioById,
  getDomiciliosByCliente,
  createDomicilio,
  updateDomicilio,
  deleteDomicilio,
  getDomiciliosByClienteId,
  statusDomicilio,
} = require("../repositories/domicilio.repository");
const transporter = require("../utils/mailer");

const { getPedidoByVentaId, getPedidoById } = require("../repositories/pedido.repository")
const { getCatalogoById } = require("../repositories/catalogo.repository");
const { Pedido } = require("../models");
const { getUserById } = require("../repositories/usuario.repository");
exports.getAllDomicilios = async (req, res) => {
  try {
    const domicilios = await getAllDomicilios();
    res.status(200).json(domicilios);
  } catch (error) {
    console.log("Error al obtener los domicilios", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getDomicilioById = async (req, res) => {
  const { id } = req.params;

  try {
    const domicilio = await getDomicilioById(id);
    res.status(200).json(domicilio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDomiciliosByClienteId = async (req, res) => {
  const { id } = req.params;

  try {
    const domicilios = await getDomiciliosByClienteId(id);

    if (domicilios.length === 0) {
      return res
        .status(404)
        .json({ msg: "No se encontraron domicilios para este cliente." });
    }

    res.status(200).json(domicilios);
  } catch (error) {
    console.error("Error al obtener los domicilios por cliente:", error);
    res.status(500).json({ msg: "Error al obtener los domicilios." });
  }
};

/* exports.createDomicilio = async (req, res) => {
  const { ventaId, estadoId, direccion } = req.body;
  try {
    const municipios = [" Medellín", " Bello", " Copacabana", " Girardota", " Barbosa", " La estrella", " Caldas", " Envigado", " Sabaneta", " Itagüí"];
    const municipio = direccion.split(',')[1];
    console.log(municipio);

    if (municipios.includes(municipio)) {
      let tarifa = 15500;
      const pedido = await getPedidoByVentaId(ventaId)
      const catalogoId = pedido.catalogoId
      const catalogo = await getCatalogoById(catalogoId);
      const pesoPrenda = catalogo.peso;
      const cantidad = pedido.cantidad
      const peso = pesoPrenda * cantidad;
      if (peso > 6) {
        let excedente = peso - 6;
        let adicional = excedente * 3100;
        tarifa += adicional;
      }
      const newDomicilio = {
        ventaId,
        estadoId,
        direccion,
        tarifa
      };
      await createDomicilio(newDomicilio);
      return res.status(201).json({ msg: "Domicilio creado exitosamente" });
    }
    return res.status(400).json({ msg: "Solo se hacen domicilios en el área metropolitana" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}; */

exports.updateSG = async (req, res) => { //update status and guide
  const { id } = req.params
  const { estadoId, guia } = req.body
  try {
    const domicilio = await getDomicilioById(id)
    const ventaId = domicilio.ventaId
    const pedido = await getPedidoByVentaId(ventaId)
    const usuarioId = pedido.usuarioId
    const usuario = await getUserById(usuarioId)
    const email = usuario.email
    console.log(email)
    const mailOptions = {
      from: "modistadonaluz@gmail.com",
      to: email,
      subject: "Su pedido está en camino 🛍️🚚",
      html: `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Entrega en camino</title>
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
                            <p>Nos complace informarle que su(s) producto(s) ya se encuentran en la agencia de envíos y están rumbo a su domicilio.</p>
                            <p>Número de guía: ${guia}</p>
                            <p>Transportador: Servientrega</p>
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
    await statusDomicilio(id, estadoId)
    const updatedDomi = {
      numeroGuia: guia,
      estadoId
    }
    await updateDomicilio(id, updatedDomi)
    res.status(200).json({ msg: "El estado del domicilio ha sido actualizado." })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message })
  }
}

exports.clienteDomicilio = async (req, res) => {
  const { id } = req.params;

  try {
    const domicilio = await getDomicilioById(id);
    if (!domicilio) {
      return res.status(400).json({ msg: "No se encuentra el domicilio, intente de nuevo." });
    }
    if (domicilio.estadoId === 15) {
      await statusDomicilio(id, 6);
      return res.status(200).json({ msg: "El estado del domicilio ha sido actualizado." });
    }
    return res.status(400).json({ msg: "El producto aún no está en agencia, intente de nuevo." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Ocurrió un error en el servidor. Intente nuevamente más tarde." });
  }
};

exports.statusDomicilio = async (req, res) => {
  const { id } = req.params;
  const { estadoId } = req.body
  try {
    await statusDomicilio(id, estadoId);
    res.status(201).json({ msg: "Estado actualizado." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateDomicilio = async (req, res) => {
  const { id } = req.params;
  const domicilio = req.body;

  try {
    await updateDomicilio(id, domicilio);
    res.status(201).json({ msg: "Domicilio actualizado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDomicilio = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteDomicilio(id);
    res.status(201).json({ msg: "Domicilio eliminado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
