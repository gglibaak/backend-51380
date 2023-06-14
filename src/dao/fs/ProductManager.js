const fs = require("fs");

class ProductManager {
  constructor(fileName) {
    this.path = `./${fileName}.json`;
    this.products = [...productList];
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
      !product.thumbnails ||
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

  const productList = [
    {
      id: 1,
      title: "Fender Stratocaster El Diablo 1956",
      description: "Guitar",
      price: 8500,
      thumbnails: ["https://guitar.com/guitar.jpg"],
      code: "a101",
      stock: 10,
      category: "Electric Guitar",
      status: true
    },
    {
      id: 2,
      title: "Fender Bass 1967",
      description: "Guitar Bass",
      price: 6300,
      thumbnails: ["https://guitar.com/bass.jpg"],
      code: "a102",
      stock: 5,
      category: "Electric Bass Guitar",
      status: true
    },
    {
      id: 3,
      title: "Gibson Dove 2002",
      description: "Guitar Acoustic",
      price: 5350,
      thumbnails: ["https://guitar.com/guitaracoustic.jpg"],
      code: "a103",
      stock: 25,
      category: "Acoustic Guitar",
      status: true
    },
  ];  

  module.exports = ProductManager;