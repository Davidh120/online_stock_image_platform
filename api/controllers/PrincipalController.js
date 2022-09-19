/**
 * PrincipalController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  inicio: async (req, res) =>{
    let fotos = await Fotos.find({estado: true});
    res.view('pages/inicio', {fotos});
  },

  topVendidas: async (req, res) => {
    let query = `
    SELECT titulo, contenido, COUNT (*) AS cantidad
    FROM orden_detalle
    INNER JOIN fotos ON orden_detalle.foto_id = fotos.id
    GROUP BY titulo, contenido, foto_id
    ORDER BY COUNT(*) DESC
    LIMIT 10
    `; // SE HACE UN QUERY POR QUE SAILS NO SOPORTA AGRUPACIONES.

    let topVendidas = await OrdenDetalle.getDatastore().sendNativeQuery(query, []);// SE UTILIZA getDatastore().sendNativeQuery PARA EJECUTAR SENTENCIAS QUERYS.
    let fotos = topVendidas.rows;
    res.view('pages/top_vendidas', {fotos});
  }

};

