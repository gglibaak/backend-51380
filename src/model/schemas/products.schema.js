const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;
const productCollection = 'products';

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnails: [{ type: String, required: true }],
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, required: true },
    owner: { type: String, required: false, default: 'admin' },
  },
  { versionKey: false }
);

ProductSchema.plugin(mongoosePaginate);
const ProductModel = mongoose.model(productCollection, ProductSchema);

module.exports = ProductModel;
