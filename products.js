const fs = require("fs");

class ProductManager {
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
      !product.stock
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

    let newProduct = { id: this.id, ...product };
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

    const updated = { id, ...updatedProduct };
    this.products.splice(prodIndex, 1, updated);

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

const product = {
  title: "Fender Stratocaster El Diablo 1956",
  description: "Guitar",
  price: 8500,
  thumbnail: "https://guitar.com/guitar.jpg",
  code: "a101",
  stock: 10,
};
const product2 = {
  title: "Fender Bass 1967",
  description: "Guitar Bass",
  price: 6300,
  thumbnail: "https://guitar.com/bass.jpg",
  code: "a102",
  stock: 5,
};
const product3 = {
  title: "Gibson Dove 2002",
  description: "Guitar Acoustic",
  price: 5350,
  thumbnail: "https://guitar.com/guitaracoustic.jpg",
  code: "a103",
  stock: 25,
};

const newProduct = new ProductManager("productsDB");

const testProductCrud = async (mode) => {
  try {
    switch (mode) {
      case 1:
        const result = await newProduct.addProduct(product);
        console.log(result);
        break;
      case 2:
        const result2 = await newProduct.getProducts();
        console.log(result2);
        break;
      case 3:
        const result3 = await newProduct.getProductById(1);
        console.log(result3);
        break;
      case 4:
        const result4 = await newProduct.updateProduct(1, product3);
        console.log(result4);
        break;

      case 5:
        const result5 = await newProduct.deleteProduct(1);
        console.log(result5);
        break;

      default:
        console.log("You selected an incorrect option.");
        break;
    }
  } catch (error) {
    console.error(error);
  }
};
/*###################################################*/
/*               OPCIONES DEL CRUD                   */
/*###################################################*/
//      1 - Añadir producto.
//      2 - Retornar todos los productos
//      3 - Consultar producto con un ID especifico.
//      4 - Actualizar producto, en el primer parametro el producto ya existenten en la lista, en el segundo parametro, la nueva información.
//      5 - Eliminar producto con un ID especifico.

testProductCrud(2);