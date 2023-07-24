
const MongoProducts = require('../services/products.services');
const Services = new MongoProducts();

class productController {

    getProductAll = async (req, res) => {
        const queryParams = req.query;
        const response = await Services.getProductAll(queryParams);
        return res.status(response.status).json(response.result);
    }

    getProductById = async (req, res) => {
        const filteredId = req.params.pid;
        const response = await Services.getProductById(filteredId);
        return res.status(response.status).json(response.result);
    }

    addProduct = async (req, res) => {
        const newProduct = req.body;
        const response = await Services.addProduct(newProduct);
        return res.status(response.status).json(response.result);
    }

    updateProduct = async (req, res) => {
        const id = req.params.pid;
        const infoUpdateProd = req.body;
        const response = await Services.updateProduct(id, infoUpdateProd);
        return res.status(response.status).json(response.result);
    }

    deleteProduct = async (req, res) => {
        const id = req.params.pid;
        const response = await Services.deleteProduct(id);
        return res.status(response.status).json(response.result);
    }

}
module.exports = new productController()