const UserSchemas = require('../../schemas/users.schema');

class UserDAO {
  async getBy(query) {
    try {
      let user;
      user = await UserSchemas.findOne(query).lean();
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, user) {
    try {
      const updatedUser = await UserSchemas.updateOne({ _id: id }, user);
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserDAO;
