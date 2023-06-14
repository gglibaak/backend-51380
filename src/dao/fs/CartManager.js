const fs = require("fs");

class CartManager {
  constructor(fileName) {
    this.path = `./${fileName}.json`;
    this.carts = [];
  }

  async getData() {
    fs.existsSync(this.path)
      ? (this.carts = JSON.parse(
          await fs.promises.readFile(this.path, "utf-8")
        ))
      : await fs.promises.writeFile(this.path, JSON.stringify(this.carts));

    return this.carts;
  }

  async addCart(cart) {
    await this.getData();

    const maxId =
      this.carts.length > 0 ? Math.max(...this.carts.map((p) => p.id)) : 0;
    this.id = maxId + 1;

    let newCart = { id: this.id, ...cart };
    this.carts.push(newCart);

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));

    return "Cart added successfully.";
  }

  async getCarts() {
    await this.getData();
    return this.carts;
  }

  async getCartById(id) {
    await this.getData();
    let prodFound = this.carts.find((p) => p.id === id);
    if (!prodFound) {
      return "Product not found.";
    }
    return prodFound;
  }

  async updateCart(cartId, productId) {
    await this.getData();
    let cartIndex = this.carts.findIndex((p) => p.id === cartId);
    const cartFiltered = this.carts.find((c) => c.id == cartId);

    if (cartIndex === -1) {
      return "Cart not found.";
    }

    const productIndex = cartFiltered.products.findIndex(
      (p) => p.id === productId
    );

    if (productIndex !== -1) {
      cartFiltered.products[productIndex].quantity += 1;
    } else {
      cartFiltered.products.push({ id: productId, quantity: 1 });
    }

    const indexCart = this.carts.indexOf(cartFiltered);
    this.carts.splice(indexCart, 1, cartFiltered);

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));

    return cartFiltered;
  }
}

module.exports = CartManager;
