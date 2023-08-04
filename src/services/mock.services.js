const { faker } = require('@faker-js/faker/locale/es');

class MockProducts {
  getAllProducts() {
    try {
      const products = [];

      const generateProduct = () => {
        return {
          _id: faker.database.mongodbObjectId(),
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price({ min: 100, max: 7000, dec: 0 }),
          thumbnail: [faker.image.avatarGitHub()],
          code: `a${faker.finance.pin(4)}`,
          stock: faker.number.int({ max: 100 }),
          category: faker.commerce.department(),
          status: faker.datatype.boolean(),
        };
      };

      do {
        products.push(generateProduct());
      } while (products.length < 100);

      return { status: 200, result: { status: 'success', payload: products } };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        result: { status: 'error', msg: 'Internal Server Error', payload: {} },
      };
    }
  }
}

module.exports = MockProducts;
