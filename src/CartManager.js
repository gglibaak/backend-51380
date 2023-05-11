const fs = require("fs");

class CartManager {
  constructor(fileName) {
    this.path = `./${fileName}.json`;
    this.products = [];
  }

  async getData() {
    fs.existsSync(this.path)
      ? (this.products = JSON.parse(
          await fs.promises.readFile(this.path, "utf-8")
        ))
      : await fs.promises.writeFile(this.path, JSON.stringify(this.products));

    return this.products;
  }

  async addProduct(product) {
    await this.getData();

    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock ||
      !product.category
    ) {
      return "The content of the fields is wrong.";
    }

    if (this.products.some((item) => item.code === product.code)) {
      return "Product already exists.";
    }

    const maxId =
      this.products.length > 0
        ? Math.max(...this.products.map((p) => p.id))
        : 0;
    this.id = maxId + 1;

    let newProduct = { id: this.id, ...product, status: true };
    this.products.push(newProduct);

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, 2)
    );

    return "Product added successfully.";
  }

  async getProducts() {
    await this.getData();
    return this.products;
  }

  async getProductById(id) {
    await this.getData();
    let prodFound = this.products.find((p) => p.id === id);
    if (!prodFound) {
      return "Product not found.";
    }
    return prodFound;
  }

  async updateProduct(id, updatedProduct) {
    await this.getData();
    let prodIndex = this.products.findIndex((p) => p.id === id);

    if (prodIndex === -1) {
      return "Product not found.";
    }

    this.products[prodIndex] = {
      ...this.products[prodIndex],
      ...updatedProduct,
    };

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, 2)
    );

    return "Product updated successfully.";
  }

  async deleteProduct(id) {
    await this.getData();
    const prodIndex = this.products.findIndex((p) => p.id === id);

    if (prodIndex === -1) {
      return "Product not found.";
    }

    this.products.splice(prodIndex, 1);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, 2)
    );

    return "Product deleted successfully.";
  }
}

  module.exports = CartManager;