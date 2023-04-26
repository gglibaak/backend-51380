class ProductManager {
    id = 1;
    constructor(){
        this.products = [];
    }
    addProduct(product) {

    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      return 'The content of the fields is wrong.';
    }
    let newProduct = { ...product, id: this.id };
    this.products.push(newProduct);
    this.id+=1;
    return 'Product added';
  }

    getProducts() {
    return this.products;
  }

  getProductById(id) {
    let prodFound = this.products.find((p) => p.id === id);
    if (!prodFound) {
      return 'Not found';
    }
    return prodFound;
  }

}


const product = {
  title: 'Fender Stratocaster El Diablo 1956',
  description: 'Guitar',
  price: 8500,
  thumbnail:
    'https://guitar.com/guitar.jpg',
  code: 'a101',
  stock: 10,
};
const product2 = {
  title: 'Fender Bass 1967',
  description: 'Guitar Bass',
  price: 6300,
  thumbnail:
    'https://guitar.com/bass.jpg',
  code: 'a102',
  stock: 5,
};

const newProduct = new ProductManager();

    console.log(newProduct.addProduct(product));
    console.log(newProduct.addProduct(product2));
    console.log(newProduct.getProductById(2));
    console.log(newProduct.getProducts());