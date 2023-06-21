const ProductModel = require("../dao/mongo/models/products.model");

class MongoProducts {
  async getProductAll(queryParams) {
    try {
      const { limit, page, sort, query, status } = queryParams;
      // const products = await ProductModel.find({}).limit(limit)

      // console.log("userSessionEmail", userSessionEmail);
      const filter = query
        ? { category: { $regex: query, $options: "i" } }
        : {};

      let statusIsAvailable = status === "available" ? true : false;
      const statusFilter = status ? { status: statusIsAvailable } : {};

      const options = {
        lean: true,
        limit: limit || 10,
        page: page || 1,
        sort: sort === "desc" ? "-price" : sort === "asc" ? "price" : {},
        customLabels: {
          docs: "payload",
        },
      };

      const combinedFilter = { ...filter, ...statusFilter };

      const response = await ProductModel.paginate(combinedFilter, options);

      const products = {
        payload: response.payload,
        totalPages: response.totalPages,
        prevPage: response.hasPrevPage ? response.prevPage : null,
        nextPage: response.hasNextPage ? response.nextPage : null,
        page: response.page,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        prevLink: response.hasPrevPage
          ? `/api/products?limit=${limit || 10}&page=${response.prevPage}`
          : null,
        nextLink: response.hasNextPage
          ? `/api/products?limit=${limit || 10}&page=${response.nextPage}`
          : null,
      };

      return { status: 200, result: { status: "success", ...products } };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async getProductById(id) {
    try {
      const productFiltered = await ProductModel.findOne({ _id: id });
      return {
        status: 200,
        result: { succes: true, payload: productFiltered },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async addProduct(data) {
    try {
      const { title, description, price, thumbnails, code, stock, category } =
        data;

      if (
        !title ||
        !description ||
        !price ||
        !thumbnails ||
        !code ||
        !stock ||
        !category
      ) {
        return {
          status: 400,
          result: { status: "error", error: `🛑 Wrong Data Format.` },
        };
      }

      if (await ProductModel.findOne({ code })) {
        return {
          status: 400,
          result: {
            status: "success",
            error: `🛑 The product alredy exists.`,
          },
        };
      }

      await ProductModel.create({
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        category,
        status: true,
      });
      return { status: 200, result: { status: "success", payload: data } };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async updateProduct(id, newDataProduct) {
    try {
      const { title, description, price, thumbnails, code, stock, category } =
        newDataProduct;

      if (
        !title ||
        !description ||
        !price ||
        !thumbnails ||
        !code ||
        !stock ||
        !category
      ) {
        return {
          status: 400,
          result: { status: "error", error: `🛑 Wrong Data Format.` },
        };
      }

      if (!(await ProductModel.findOne({ _id: id }))) {
        return {
          status: 400,
          result: {
            status: "error",
            error: `🛑 Product not found.`,
          },
        };
      }

      const response = await ProductModel.updateOne(
        { _id: id },
        { title, description, price, thumbnails, code, stock, category }
      );

      return {
        status: 200,
        result: {
          status: "success",
          payload: { ...newDataProduct, mongo: response },
        },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }

  async deleteProduct(id) {
    try {
      if (!(await ProductModel.findOne({ _id: id }))) {
        return {
          status: 400,
          result: {
            status: "error",
            error: `🛑 Invalid request. Product not found whit id: ${id}.`,
          },
        };
      }

      const response = await ProductModel.deleteOne({ _id: id });

      return {
        status: 200,
        result: {
          status: "success",
          payload: { deleteItemId: id, mongo: response },
        },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: { status: "error", msg: "Internal Server Error", payload: {} },
      };
    }
  }
}

module.exports = MongoProducts;
