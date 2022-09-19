/**
 * CompraController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  agregarCarroCompra: async (req, res) => {
    let foto = await CarroCompra.findOne({foto: req.params.foto_id, cliente: req.session.cliente.id});
    if(foto){
      req.addFlash('mensaje', 'La foto ya ha sido agregada al carrito de compra');
    }else{
      await CarroCompra.create({
        cliente: req.session.cliente.id,
        foto: req.params.foto_id
      });
      req.session.carroCompra = await CarroCompra.find({cliente: req.session.cliente.id});
      req.addFlash('mensaje', 'Foto agregada al carrito de compra');
    }
    return res.redirect('/');
  },

  carroCompra: async (req, res) =>{
    if (!req.session || !req.session.cliente){
      return res.redirect('/');
    }
    let elementos = await CarroCompra.find({cliente: req.session.cliente.id}).populate('foto');
    res.view('pages/carro_de_compra', {elementos});
  },

  eliminarCarroCompra: async (req,res) => {
    let foto = await CarroCompra.findOne({foto: req.params.foto_id, cliente: req.session.cliente.id});
    if(foto){
      await CarroCompra.destroy({
        cliente: req.session.cliente.id,
        foto: req.params.foto_id
      });
      req.session.carroCompra = await CarroCompra.find({cliente: req.session.cliente.id});
      req.addFlash('mensaje', 'Foto eliminada del carrito de compra');
    }
    return res.redirect('/carro-de-compra');
  },

  agregarDeseoLista: async (req, res) => {
    let foto = await ListaDeseo.findOne({foto: req.params.foto_id, cliente: req.session.cliente.id});
    if(foto){
      req.addFlash('mensaje', 'La foto ya ha sido agregada a la lista de deseos');
    }else{
      await ListaDeseo.create({
        cliente: req.session.cliente.id,
        foto: req.params.foto_id
      });
      req.session.listaDeseo = await ListaDeseo.find({cliente: req.session.cliente.id});
      req.addFlash('mensaje', 'Foto agregada a la lista de deseo');
    }
    return res.redirect('/');
  },

  listaDeseo: async (req, res) => {
    if (!req.session || !req.session.cliente){
      return res.redirect('/');
    }
    let elementos = await ListaDeseo.find({cliente: req.session.cliente.id}).populate('foto');
    res.view('pages/lista_de_deseos', {elementos});
  },

  eliminarListaDeseo: async (req, res) => {
    let foto = await ListaDeseo.findOne({foto: req.params.foto_id, cliente: req.session.cliente.id});
    if(foto){
      await ListaDeseo.destroy({
        cliente: req.session.cliente.id,
        foto: req.params.foto_id
      });
      req.session.listaDeseo = await ListaDeseo.find({cliente: req.session.cliente.id});
      req.addFlash('mensaje', 'Foto eliminada de la lista de deseo');
    }
    return res.redirect('/lista-de-deseos');
  },

  comprar: async (req,res) => {
    let orden = await Orden.create({
      fecha : new Date(),
      cliente: req.session.cliente.id,
      total: req.session.carroCompra.length,
    }).fetch();
    for(let i = 0; i < req.session.carroCompra.length; i++){
      await OrdenDetalle.create({
        orden: orden.id,
        foto: req.session.carroCompra[i].foto
      });
    }
    await CarroCompra.destroy({
      cliente: req.session.cliente.id
    });
    req.session.carroCompra = [];
    req.addFlash('mensaje', 'La compra ha sido realizada');
    return res.redirect('/');
  },

  misOrdenes: async (req,res) => {
    if(!req.session || !req.session.cliente){
      return res.redirect('/');
    }
    let ordenes = await Orden.find({cliente: req.session.cliente.id}).sort('id desc');
    res.view('pages/mis_ordenes', {ordenes});
  },

  detalleOrden: async (req,res) => {
    if(!req.session || !req.session.cliente){
      return res.redirect('/');
    }
    let orden = await Orden.findOne({cliente: req.session.cliente.id, id: req.params.orden_id}).populate('detalles');

    if(!orden){
      return res.redirect('/mis-ordenes');
    }

    orden.detalles = await OrdenDetalle.find({ orden: orden.id }).populate('foto'); //orden.detalle se utilza para especificar e identificar los datos de la orden, con .detalles o sin el da el mismo resultado
    return res.view('pages/detalle', { orden });
  },

};

