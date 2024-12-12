const { getAllProveedores, getProveedorById, createProveedor, updateProveedor, deleteProveedor, } = require("../repositories/proveedor.repository");

exports.getAllProveedores = async (req, res) => {
    try {
        const proveedores = await getAllProveedores();
        res.status(200).json(proveedores);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

exports.getProveedorById = async (req, res) => {
    const { id } = req.params;

    try {
        const proveedor = await getProveedorById(id);
        res.status(200).json(proveedor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createProveedor = async (req, res) => {
    const proveedor = req.body;

    try {
        await createProveedor(proveedor);
        res.status(201).json({ msg: "Proveedor creado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

exports.updateProveedor = async (req, res) => {
    const { id } = req.params;
    const estado = req.body;
    try {
        await updateProveedor(id, estado);
        res.status(201).json({ msg: "Proveedor actualizado exitosamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProveedor = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteProveedor(id);
        res.status(201).json({ msg: "Proveedor eliminado" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
