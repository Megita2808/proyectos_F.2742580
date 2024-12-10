const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailUnico = async (value) => {
    const existeUsuario = await mongoose.models.Proveedor.findOne({ correo: value });
    return !existeUsuario;
};

const formatearNombre = (nombre) => {
    return nombre
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase())
        .join(' ');
};

const proveedorSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio.'],
        minlength: [3, 'El nombre debe tener al menos 3 caracteres.'],
        trim: true,
        unique: [true, 'El nombre ya está en uso.']
    },
    correo: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio.'],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Formato de correo electrónico inválido.'],
        unique: true,
        validate: {
            validator: EmailUnico,
            message: 'El correo electrónico ya está en uso.'
        }
    },
    telefono: {
        type: String,
        required: [true, 'El número de teléfono es obligatorio.'],
        minlength: [7, 'El número de teléfono debe tener al menos 7 dígitos.'],
        maxlength: [15, 'El número de teléfono no debe exceder 15 dígitos.'],
        match: [/^\+?\d{7,15}$/, 'El número de teléfono solo debe contener dígitos y puede incluir un prefijo de país.']
    },
    documento: {
        type: String,
        required: true,
        trim: true,
        unique: [true, 'El documento ya está en uso.']
    },
    tipoDocumento: {
        type: String,
        required: true,
        trim: true,
    },
    estado: {
        type: Boolean,
        default: true
    }
});

proveedorSchema.pre('save', function(next) {
    if (this.isModified('nombre')) {
        this.nombre = formatearNombre(this.nombre);
    }
    next();
});

proveedorSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        let campoDuplicado = '';
        if (error.keyValue.correo) {
            campoDuplicado = 'correo';
        } else if (error.keyValue.nombre) {
            campoDuplicado = 'nombre';
        } else if (error.keyValue.documento) {
            campoDuplicado = 'documento';
        }
        return next({ status: 409, message: `El ${campoDuplicado} ya está en uso.` });
    } else {
        next(error);
    }
});

const Proveedor = mongoose.model('Proveedor', proveedorSchema);

module.exports = Proveedor;
