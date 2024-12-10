const ChatMensaje = require('../../modules/chatMensaje');
const Usuario = require('../../modules/usuario/usuarioModule');

const chatPqrsGet = async (req, res) => {
    const { id_SistemaChat } = req.params;
    try {
        const messages = await ChatMensaje.findOne({ SistemaChat : id_SistemaChat});
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const chatPqrsPost = async (req, res) => {
    const { id_SistemaChat } = req.params;
    const { mensaje, id_usuario } = req.body;
    try {
      const chatMensaje = await ChatMensaje.findOne({ SistemaChat: id_SistemaChat });
  
      if (!chatMensaje) {
        return res.status(404).json({ message: "Chat no encontrado" });
      }
  
      let usuarioCliente = null;
      let usuarioEmpleado = null;
  
      if (id_usuario) {
        const usuario = await Usuario.findOne({ correo: id_usuario });
  
        if (usuario) {
          for (let permiso of usuario.rol.permisos) {
            if (permiso.nombrePermiso === 'empleado') {
              usuarioEmpleado = usuario;
            } else if (permiso.nombrePermiso === 'cliente') {
              usuarioCliente = usuario;
            }
          }
        }
      }
  
      if (!(usuarioCliente || usuarioEmpleado)) {
        return res.status(404).json({ message: "Usuario no encontrado o no tiene los permisos adecuados" });
      }
  
      if (usuarioCliente) {
        chatMensaje.mensajeCliente.push({ mensaje });
        await chatMensaje.save();
        res.status(201).json({ message: "Mensaje guardado correctamente", _id: chatMensaje.mensajeCliente[0]._id }); 
      } else if (usuarioEmpleado) {
        chatMensaje.mensajeEmpleado.push({ mensaje });
        await chatMensaje.save();
        res.status(201).json({ message: "Mensaje guardado correctamente", _id: chatMensaje.mensajeEmpleado[0]._id }); 
      } else {
        return res.status(400).json({ message: "Tipo de mensaje no válido" });
      }
  

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
const chatPqrsDelete = async (req, res) => {
    const { id_SistemaChat } = req.params;
    const {mensajeId, id_usuario} = req.body;
    try {
        const chatMensaje = await ChatMensaje.findOne({ SistemaChat: id_SistemaChat });

        const usuarioCliente = await Usuario.findOne({
            _id: id_usuario, 'rol.permisos.nombrePermiso': 'cliente'
        });

        const usuarioEmpleado = await Usuario.findOne({
            _id: id_usuario, 'rol.permisos.nombrePermiso': 'empleado'
        });

        if (!chatMensaje) {
            return res.status(404).json({ message: "Chat no encontrado" });
        }

        if (!(usuarioCliente || usuarioEmpleado)) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (usuarioCliente) {
            chatMensaje.mensajeCliente.id(mensajeId).remove();
        } else if (usuarioEmpleado) {
            chatMensaje.mensajeEmpleado.id(mensajeId).remove();
        }

        await chatMensaje.save();
        res.status(200).json({ message: "Mensaje eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const finalizarChat = async (req, res) => {
    const { id_SistemaChat } = req.params;
    
    try {
        const chatMensaje = await ChatMensaje.findOne({ SistemaChat: id_SistemaChat });
        if (!chatMensaje) {
            return res.status(404).json({ message: "Chat no encontrado" });
        }

        chatMensaje.mensajeCliente = [];
        chatMensaje.mensajeEmpleado = [];

        await chatMensaje.save();
        res.status(200).json({ message: "Chat finalizado y mensajes eliminados" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const chatPqrsPostCrear = async (req, res) => {
    const { id_SistemaChat } = req.params;
    try {
        let chatExistente = await ChatMensaje.findOne({ SistemaChat: id_SistemaChat });

        if (chatExistente) {
            return res.status(400).json({ message: 'Chat already exists' });
        }

        const nuevoChat = new ChatMensaje({
            SistemaChat: id_SistemaChat,
            mensajeCliente: [],
            mensajeEmpleado: []
        });

        await nuevoChat.save();

        res.status(201).json({ message: 'Chat created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    chatPqrsGet,
    chatPqrsPost,
    chatPqrsDelete,
    finalizarChat,
    chatPqrsPostCrear,
};
