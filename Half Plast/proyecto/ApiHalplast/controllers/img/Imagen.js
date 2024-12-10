const mongoose = require('mongoose');

const fs = require('fs').promises;
const path = require('path');
const simpleGit = require('simple-git');

const { response } = require('express');
const Module = require('../../modules/Img/imagen');

const token = process.env.GIT_TOKEN;
const repoPath = path.join(__dirname, 'HalPlastImagenes');
const repoUrl = `https://${token}@github.com/castano208/HalPlastImagenes.git`;
const branchName = 'main';

const git = simpleGit();

const sincronizarseGitRemoto = async () => {
    try {
        await git.addConfig('user.name', 'castano208');
        await git.addConfig('user.email', 'zsantiagohenao@gmail.com');

        if (!await fs.stat(repoPath).catch(() => false)) {
            await git.clone(repoUrl, repoPath);
        }

        await git.cwd(repoPath);
        
        await git.pull('origin', branchName);
    } catch (error) {
        console.error('Error durante la sincronización con git:', error);
        throw new Error('Error durante la sincronización con git');
    }
};

const TodosModulosImagen = async (req, res = response) => {
    try {
        const modules = await Module.find({}, { 'images.githubRepo': 0 });
        return res.status(200).json({
            ok: true,
            modules
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al traer todos los módulos: ' + error.message
        });
    }
};

const ModuloImagenUnico = async (req, res) => {
    try {
        const { moduleName } = req.params;
        const module = await Module.findOne({ moduleName: moduleName.trim() }).populate({
            path: 'images',
            select: 'imageUrl'
        });

        if (!module) {
            return res.status(404).json({
                ok: false,
                msg: 'Módulo no encontrado'
            });
        }

        const moduleFiltradoImagenes = {
            ...module.toObject(),
            images: module.images.map(image => ({
                id: image._id,
                imageUrl: image.imageUrl
            }))
        };

        return res.status(200).json({
            ok: true,
            module: moduleFiltradoImagenes
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al buscar el módulo: ' + error.message
        });
    }
};

const AgregarModuloImagen = async (req, res = response) => {
    try {
        const { moduleName } = req.params;
        const file = req.file;
        
        if (!file) {
            return res.status(400).json({
                ok: false,
                msg: 'Se requiere un archivo para agregar.'
            });
        }

        const githubPath = `path/to/${file.originalname}`;
        const githubRepo = 'https://github.com/castano208/HalPlastImagenes';
        const imageUrl = `https://raw.githubusercontent.com/castano208/HalPlastImagenes/main/${moduleName}/${file.originalname}`;

        const imageData = {
            _id: new mongoose.Types.ObjectId(),
            fileName: file.originalname,
            fileContent: file.buffer.toString('base64'),
            githubPath,
            githubRepo,
            imageUrl
        };

        await sincronizarseGitRemoto();

        let module = await Module.findOne({ moduleName: moduleName.trim() });

        if (!module) {
            module = new Module({ moduleName: moduleName.trim(), images: [imageData] });
        } else {
            module.images.push(imageData);
        }

        const moduleDir = path.join(repoPath, moduleName.trim());
        const filePath = path.join(moduleDir, file.originalname);

        await fs.mkdir(moduleDir, { recursive: true });
        await fs.writeFile(filePath, file.buffer);

        await git.add(filePath);
        await git.commit(`Agregar nueva imagen ${file.originalname} al módulo ${moduleName}`);
        await git.push('origin', branchName);

        await module.save();

        return res.status(200).json({
            imageId: imageData._id,
            ok: true
        });
    } catch (error) {
        console.error('Error en AgregarModuloImagen:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al agregar imagen al módulo: ' + error.message
        });
    }
};

const EditarModuloImagen = async (req, res = response) => {
    try {
        const { moduleName } = req.params;
        const { identificadorImagen } = req.body;
        const file = req.file;

        if (!moduleName || !identificadorImagen) {
            throw new Error('El nombre del módulo y el identificador de la imagen son requeridos');
        }

        await sincronizarseGitRemoto();
        await git.addConfig('user.name', 'castano208');
        await git.addConfig('user.email', 'zsantiagohenao@gmail.com');

        const oldModule = await Module.findOne({ 'images._id': identificadorImagen });
        if (!oldModule) {
            throw new Error('Imagen no encontrada');
        }

        let newModule = await Module.findOne({ moduleName: moduleName.trim() });
        if (!newModule) {
            newModule = new Module({ moduleName: moduleName.trim(), images: [] });
        }

        const image = oldModule.images.id(identificadorImagen);
        const oldFilePath = path.join(repoPath, oldModule.moduleName.trim(), image.githubPath);
        const newFilePath = path.join(repoPath, moduleName.trim(), file ? file.originalname : image.githubPath);

        if (!file) {
            if (oldModule.moduleName !== moduleName.trim()) {
                if (await fs.stat(oldFilePath).catch(() => false)) {
                    await fs.mkdir(path.dirname(newFilePath), { recursive: true });
                    await fs.rename(oldFilePath, newFilePath);
                    await git.add(newFilePath);
                    await git.rm(oldFilePath);
                    await git.commit(`Mover imagen ${image.githubPath} de ${oldModule.moduleName} a ${moduleName}`);
                    await git.push('origin', branchName);
                }

                oldModule.images.pull({ _id: identificadorImagen });
                await oldModule.save();
              
                newModule.images.push(image);
            }
        } else {
            await fs.mkdir(path.dirname(newFilePath), { recursive: true });
            await fs.writeFile(newFilePath, file.buffer);

            try {
                const fileExists = await fs.stat(oldFilePath).catch(() => false);

                if (fileExists) {
                    await fs.unlink(oldFilePath);
                    await git.rm(oldFilePath);
                }

                await git.add(newFilePath);
                await git.commit(`Editar imagen ${file.originalname} en el módulo ${moduleName}`);
                await git.push('origin', branchName);
            } catch (error) {
                console.error('Error al eliminar el archivo antiguo o al hacer commit en Git:', error);
                throw new Error('Error al eliminar el archivo antiguo o al hacer commit en Git');
            }

            image.githubPath = file.originalname;
            image.imageUrl = `https://raw.githubusercontent.com/castano208/HalPlastImagenes/main/${moduleName}/${file.originalname}`;
            if (newModule) {
                oldModule.images.pull({ _id: identificadorImagen });
                await oldModule.save();

                newModule.images.push(image);
            }
        }

        await newModule.save();
        if (oldModule !== newModule) {
            await oldModule.save();
        }

        return res.status(200).json({
            ok: true,
            module: newModule,
        });

    } catch (error) {
        console.error('Error al editar la imagen en el módulo:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al editar la imagen en el módulo: ' + error.message,
        });
    }
};

const ActualizarEstadoModuloImagen = async (req, res = response) => {
    try {
        const { imageId } = req.params;
        const { estado } = req.body;

        const module = await Module.findOne({ 'images._id': imageId });

        if (!module) {
            throw new Error('Módulo no encontrado');
        }

        const image = module.images.id(imageId);
        if (!image) {
            throw new Error('Imagen no encontrada');
        }

        image.isActive = estado;

        await module.save();

        return res.status(200).json({
            ok: true,
            module
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el estado de la imagen: ' + error.message
        });
    }
};

const EliminarModuloImagen = async (req, res = response) => {
    try {
        const { imageId } = req.params;

        await sincronizarseGitRemoto();

        const module = await Module.findOne({ 'images._id': imageId });
        if (!module) {
            throw new Error('Módulo no encontrado');
        }

        const image = module.images.id(imageId);
        if (!image) {
            throw new Error('Imagen no encontrada');
        }

        const moduleDir = `${repoPath}/${module.moduleName.trim()}`;
        const filePath = `${moduleDir}/${image.githubPath}`;

        try {
            await fs.access(filePath);
            await fs.unlink(filePath);

            await git.add(filePath);
            await git.commit(`Eliminar imagen ${image.githubPath} del módulo ${module.moduleName}`);
            await git.push('origin', branchName);
        } catch (err) {
            console.warn(`Archivo no encontrado o ya eliminado: ${filePath}`);
        }

        module.images = module.images.filter(img => img._id.toString() !== imageId);

        await module.save();

        return res.status(200).json({
            ok: true,
            module
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la imagen del módulo: ' + error.message
        });
    }
};

const EliminarModuloCompleto = async (req, res = response) => {
    try {
        const { moduleName } = req.params;
 
        await sincronizarseGitRemoto();

        const module = await Module.findOneAndDelete({ moduleName: moduleName.trim() });

        if (!module) {
            return res.status(404).json({
                ok: false,
                msg: 'Módulo no encontrado'
            });
        }

        const moduleDir = `${repoPath}/${moduleName.trim()}`;

        if (fs.existsSync(moduleDir)) {
            await fs.rm(moduleDir, { recursive: true, force: true });

            await git.add(moduleDir);
            await git.commit(`Eliminar módulo completo ${moduleName}`);
            await git.push('origin', branchName);
        }

        return res.status(200).json({
            ok: true,
            msg: 'Módulo eliminado correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el módulo: ' + error.message
        });
    }
};

module.exports = {
    TodosModulosImagen,
    ModuloImagenUnico,
    AgregarModuloImagen,
    EditarModuloImagen,
    ActualizarEstadoModuloImagen,
    EliminarModuloImagen,
    EliminarModuloCompleto,
    sincronizarseGitRemoto
};
