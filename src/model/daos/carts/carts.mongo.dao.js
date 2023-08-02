const CartsSchema = require('../../schemas/carts.schema');

class CartsDAO {
  async getAll() {
    try {
      const carts = await CartsSchema.find({});
      return carts;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id, plain = false) {
    try {
      let cart;
      plain ? (cart = await CartsSchema.findOne({ _id: id }).lean()) : (cart = await CartsSchema.findOne({ _id: id }));
      return cart;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async add(cart) {
    try {
      const newCart = await CartsSchema.create(cart);
      return newCart;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, cart) {
    try {
      const cartUpdated = await CartsSchema.updateOne({ _id: id }, cart);
      return cartUpdated;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id) {
    try {
      const cartDeleted = await CartsSchema.deleteOne({ _id: id });
      return cartDeleted;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = CartsDAO;
