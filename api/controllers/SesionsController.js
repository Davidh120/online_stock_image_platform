/**
 * SesionsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  registro: async (req, res) =>{
    res.view('pages/registro');
  },

  procesarRegistro: async (req, res) =>{
    let cliente = await Cliente.findOne({ email: req.body.email});
    if(cliente){
      req.addFlash('mensaje', 'Email Duplicado');
      return res.redirect(('/registro'));
    }else{
      let cliente = await Cliente.create({
        email: req.body.email,
        nombre: req.body.nombre,
        contrasena: req.body.contrasena
      });
      req.session.cliente = cliente;
      req.addFlash('mensaje', 'Cliente registrado');
      return res.redirect('/');
    }
  },

  inicioSesion: async (req, res) =>{
    res.view('pages/inicio_sesion');
  },

  procesarInicioSesion: async (req, res) =>{
    let cliente = await Cliente.findOne({email: req.body.email, contrasena: req.body.contrasena});
    if(!cliente){
      req.addFlash('mensaje', 'Email o cotraseña invalidos');
      return res.redirect('/inicio-sesion');
    }
    if(cliente.estado === true){
      req.session.cliente = cliente;
      let carroCompra = await CarroCompra.find({ cliente: cliente.id});
      req.session.carroCompra = carroCompra;
      let listaDeseo = await ListaDeseo.find({ cliente: cliente.id});
      req.session.listaDeseo = listaDeseo;
      req.addFlash('mensaje', `Bienvenido ${cliente.nombre}`);
      return res.redirect('/');
    }
    req.addFlash('mensaje', 'Usurario Desactivado');
    return res.redirect('/inicio-sesion');
  },

  cerrarSesion: async (req, res) =>{
    req.session.cliente = undefined;
    req.addFlash('mensaje', 'Sesión finalizada');
    return res.redirect('/');
  }

};

