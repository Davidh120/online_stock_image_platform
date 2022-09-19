/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require('path'); // permite trabajar con rutas
const fs = require('fs'); //permite trabajar con archivos

module.exports = {

  inicioSesion: async (req, res) =>{
    res.view('pages/admin/inicio_sesion');
  },

  procesarInicioSesion: async (req, res) =>{
    let admin = await Admin.findOne({email: req.body.email, contrasena: req.body.contrasena});
    if(admin){
      if(admin.estado ===true){
        req.session.admin = admin;
        req.session.cliente = undefined;
        req.addFlash('mensaje', `Bienvenido ${admin.nombre}`);
        return res.redirect('/admin/principal');
      }
      req.addFlash('mensaje', 'Administrador Desactivado');
      return res.redirect('/admin/inicio-sesion');
    }else{
      req.addFlash('mensaje', 'Email o cotraseña invalidos');
      return res.redirect('/admin/inicio-sesion');
    }
  },

  principal: async (req, res) => {
    if(!req.session || !req.session.admin){
      req.addFlash('mensaje', 'Sesion inválida');
      return res.redirect('/admin/inicio-sesion');
    }
    let fotos = await Fotos.find({}).sort('id ASC');
    res.view('pages/admin/principal', {fotos});
  },

  cerrarSesion: async (req, res) => {
    req.session.admin = undefined;
    req.addFlash('mensaje', 'Sesion finalizada');
    return res.redirect('/');
  },

  agregarFoto: async (req, res) => {
    res.view('pages/admin/agregar_foto');
  },

  procesarAgregarFoto: async (req, res) =>{
    let foto = await Fotos.create({
      titulo: req.body.titulo,
      estado: false
    }).fetch();

    req.file('foto').upload({}, async (err, files) => {
      if(err){
        return res.serverError(err);
      }

      if(files && files[0]){
        let uploadPath = files[0].fd; //.fd "la ruta donde sails pone la foto en un archivo temporal en bytes".
        let ext = path.extname(uploadPath); // obtenemos la ruta gracias al .fd(file descriptor) y nos quedamos con la extension .jpg, etc gracias a path.extname.
        //.pipe(), the method used to take a readable stream and connect it to a writeable stream for the transfer of data from one file to the other.
        //path.resolve() used to resolve a sequence of path-segments to an absolute path.
        //.appPath convierte la ruta en un string
        await fs.createReadStream(uploadPath).pipe(fs.createWriteStream(path.resolve(sails.config.appPath, `assets/images/fotos/${foto.id}${ext}`))); //toma la ruta que esta en bytes y la escribe en la ruta que se indica
        await Fotos.update({id: foto.id}, {contenido: `${foto.id}${ext}`, estado: true});
        req.addFlash('mensaje','Foto agregada correctamente');
        return res.redirect('/admin/principal');
      }
      req.addFlash('mensaje', 'No hay foto seleccionada');
      return res.redirect('admin/agregar-foto');
    });
  },

  procesarEstado: async (req, res) =>{
    let foto = await Fotos.findOne({id: req.params.foto_id});
    if(foto.estado === true){
      await Fotos.update({id: foto.id}, {estado: false});
      req.addFlash('mensaje','Foto desactivada');
      return res.redirect('/admin/principal');
    }
    await Fotos.update({id: foto.id}, {estado: true});
    req.addFlash('mensaje','Foto activada');
    return res.redirect('/admin/principal');
  },

  clientes: async (req, res) => {
    if(!req.session || !req.session.admin){
      req.addFlash('mensaje', 'Sesion inválida');
      return res.redirect('/admin/inicio-sesion');
    }
    let query = `SELECT cliente.id, cliente.nombre, cliente.estado, COUNT(orden.cliente_id) AS ordenes
    FROM orden
    JOIN cliente
    ON orden.cliente_id = cliente.id
    GROUP BY cliente.id`;
    let orden = await Orden.getDatastore().sendNativeQuery(query, []);
    let ordenes = orden.rows;
    res.view('pages/admin/clientes', {ordenes});
  },

  ordenes: async (req, res) => {
    if(!req.session || !req.session.admin){
      req.addFlash('mensaje', 'Sesion inválida');
      return res.redirect('/admin/inicio-sesion');
    }
    let ordenes = await Orden.find({cliente: req.params.cliente_id}).sort('id DESC');
    res.view('pages/admin/ordenes', {ordenes});
  },

  detalle: async (req, res) => {
    if(!req.session || !req.session.admin){
      req.addFlash('mensaje', 'Sesion inválida');
      return res.redirect('/admin/inicio-sesion');
    }
    let orden = await Orden.findOne({id: req.params.orden_id}).populate('detalles');
    if(!orden){
      return res.redirect('/admin/ordenes');
    }
    orden.detalles = await OrdenDetalle.find({ orden: orden.id }).populate('foto');
    res.view('pages/admin/detalle', {orden});
  },

  procesarEstadoCliente: async (req, res) => {
    let cliente = await Cliente.findOne({id: req.params.cliente_id});
    if(cliente.estado === true){
      await Cliente.update({id: cliente.id}, {estado: false});
      req.addFlash('mensaje','Cliente desactivado');
      return res.redirect('/admin/clientes');
    }
    await Cliente.update({id: cliente.id}, {estado: true});
    req.addFlash('mensaje','Cliente activado');
    return res.redirect('/admin/clientes');
  },

  administradores: async (req, res)  => {
    if(!req.session || !req.session.admin){
      req.addFlash('mensaje','Sesion inválida');
      return res.redirect('/admin/inicio-sesion');
    }
    let administradores = await Admin.find({}).sort('id ASC');
    res.view('pages/admin/administradores', {administradores});
  },

  procesarEstadoAdmin: async (req, res) => {
    let admin = await Admin.findOne({id: req.params.admin_id});
    if(admin.estado === true){
      if(req.session.admin.id !== admin.id){
        await Admin.update({id: admin.id}, {estado: false});
        req.addFlash('mensaje','Admin desactivado');
        return res.redirect('/admin/administradores');
      }
      req.addFlash('mensaje','Un administrador no se puede desactivar a sí mismo');
      return res.redirect('/admin/administradores');
    }else{
      if(req.session.admin.id !== admin.id){
        await Admin.update({id: admin.id}, {estado: true});
        req.addFlash('mensaje','Admin activado');
        return res.redirect('/admin/administradores');
      }
      req.addFlash('mensaje','Un administrador no se puede desactivar a sí mismo');
      return res.redirect('/admin/administradores');
    }
  },

  dashboard: async (req, res) => {
    if(!req.session || !req.session.admin){
      req.addFlash('mensaje','Sesion inválida');
      return res.redirect('/admin/inicio-sesion');
    }
    let clientes = await Cliente.find({});
    let fotos = await Fotos.find({});
    let ordenes = await Orden.find({});
    let admins = await Admin.find({});
    res.view('pages/admin/dashboard', {clientes, fotos, ordenes, admins});
  }

};

