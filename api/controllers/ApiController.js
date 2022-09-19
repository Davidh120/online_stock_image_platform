/**
 * ApiController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  clientes: async (req, res) => {
    let clientes = await Cliente.find({select: ['nombre', 'email', 'estado']});
    if(clientes){
      res.status(200);
      res.json(clientes);
    }else{
      res.status(404);
      res.serverError({errors: ['Clientes no encontrados']});
    }
  },

};

