/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /': 'PrincipalController.inicio',
  '/acerca-de': {view: 'pages/acerca_de'},
  'GET /top-vendidas': 'PrincipalController.topVendidas',

  'GET /registro': 'SesionsController.registro',
  'POST /procesar-registro': 'SesionsController.procesarRegistro', //el metodo post se utliza con el envio de un formulario de resto todo es get

  'GET /inicio-sesion': 'SesionsController.inicioSesion',
  'POST /procesar-inicio-sesion': 'SesionsController.procesarInicioSesion',
  'GET /cerrar-sesion': 'SesionsController.cerrarSesion',

  'GET /agregar-carro-compra/:foto_id': 'CompraController.agregarCarroCompra',
  'GET /carro-de-compra': 'CompraController.carroCompra',
  'GET /eliminar-carro-compra/:foto_id': 'CompraController.eliminarCarroCompra',
  'GET /agregar-deseo-lista/:foto_id': 'CompraController.agregarDeseoLista',
  'GET /lista-de-deseos': 'CompraController.listaDeseo',
  'GET /eliminar-lista-deseos/:foto_id': 'CompraController.eliminarListaDeseo',
  'GET /comprar': 'CompraController.comprar',
  'GET /mis-ordenes': 'CompraController.misOrdenes',
  'GET /mis-ordenes/:orden_id': 'CompraController.detalleOrden',

  'GET /admin/inicio-sesion' : 'AdminController.inicioSesion',
  'POST /admin/procesar-inicio-sesion': 'AdminController.procesarInicioSesion',
  'GET /admin/principal': 'AdminController.principal',
  'GET /admin/cerrar-sesion': 'AdminController.cerrarSesion',
  'GET /admin/agregar-foto': 'AdminController.agregarFoto',
  'POST /admin/procesar-agregar-foto': 'AdminController.procesarAgregarFoto',
  'GET /admin/procesar-estado/:foto_id': 'AdminController.procesarEstado',
  'GET /admin/clientes': 'AdminController.clientes',
  'GET /admin/ordenes/:cliente_id': 'AdminController.ordenes',
  'GET /admin/detalle/:orden_id': 'AdminController.detalle',
  'GET /admin/procesar-estado-cliente/:cliente_id': 'AdminController.procesarEstadoCliente',
  'GET /admin/administradores': 'AdminController.administradores',
  'GET /admin/procesar-estado-admin/:admin_id': 'AdminController.procesarEstadoAdmin',
  'GET /admin/dashboard': 'AdminController.dashboard',

  'GET /api/v1/clientes': 'ApiController.clientes',

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
