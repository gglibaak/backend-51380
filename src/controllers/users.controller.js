const UserServices = require('../services/users.services');
const userService = new UserServices();

class usersController {
  getPremium = async (req, res) => {
    try {
      const uid = req.params.uid;
      //Si el usuario de session no es el mismo que el que se quiere editar no lo deja // NO SOLICITADO
      // if (uid !== req.session?.passport?.user) {
      //   return res.status(200).render('error', { error: 'No tiene permisos para acceder a esta página' });
      // }
      const response = await userService.changeRole(uid);
      // req.logger.debug(user);
      return res.status(response.status).render(response.hbpage, response.result);
    } catch (error) {
      console.log(error);
    }
  };

  uploadDocuments = async (req, res) => {
    try {
      const { uid } = req.params;
      const uploadedFiles = req.files;
      /* //Si el usuario de session no es el mismo que el que se quiere editar no lo deja // NO SOLICITADO
      if (uid !== req.session?.passport?.user) {
        return res.status(200).render('error', { error: 'No tiene permisos para acceder a esta página' });
      } */

      console.log('Flag controller', uploadedFiles);

      const updateDocuments = await userService.saveDocument(uid, uploadedFiles);

      // console.log(updateDocuments);

      // req.logger.debug(uploadedFiles);
      res.send('test: Files uploaded successfully');
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new usersController();
