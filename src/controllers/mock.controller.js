const MockProducts = require('../services/mock.services');
const Services = new MockProducts();

class MockController {
  getMockgingProducts = async (req, res) => {
    const response = await Services.getAllProducts();
    return res.status(response.status).json(response.result);
  };
}

module.exports = new MockController();
