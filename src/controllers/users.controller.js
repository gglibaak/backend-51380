const UserServices = require('../services/users.services');
const userService = new UserServices();
const userDTO = require('../model/DTO/user.dto');

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

      await userService.saveDocument(uid, uploadedFiles);

      const user = await userService.getProfile({ _id: uid });
      const documents = user.result.payload.documents;
      req.session.documents = documents;
      const userId = user.result.payload._id;

      res.render('documents', { documents, userId });
    } catch (error) {
      console.log(error);
    }
  };

  getDocuments = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await userService.getProfile({ _id: uid });
      const documents = user.result.payload.documents;
      const userId = user.result.payload._id;
      res.render('documents', { documents, userId });
    } catch (error) {
      console.log(error);
    }
  };

  getUsers = async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      // return res.status(users.status).render(users.hbpage, users.result);
      // Aplicar el DTO a cada usuario individual
      const usersDTO = users.result.payload.map((user) => new userDTO(user));
      return res.json(usersDTO);
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new usersController();
