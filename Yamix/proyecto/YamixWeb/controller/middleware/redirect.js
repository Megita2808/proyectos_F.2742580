exports.restrictToPermiso = (...permisosRequeridos) => {
    return async (req, res, next) => {
        const { rol } = req.usuario;

        if (!rol) {
            return res.status(403).json({ message: 'Rol no encontrado' });
        }
        
        try {
            const response = await fetch(`${process.env.pathApi}/verificar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rol, permisosRequeridos })
            });

            const data = await response.json();

            if (!response.ok) {
                return res.status(response.status).send(` 
                    <script>
                        window.alert("${data.message}");
                        window.location.href = "/";
                    </script>
                `);
            }

            next();
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    };
};
