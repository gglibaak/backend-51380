const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentation CoderEcommerce API REST',
      description: 'Example of a documentation for the Ecommerce API using Swagger.',
      version: '1.0.2',
      contact: {
        name: 'Gabriel GL',
        url: 'https://coder-ecommerce-app.onrender.com',
        email: 'ggldevelopertest@gmail.com',
      },
    },
    servers: [
      {
        url: `${process.env.PROJECT_URL}/api`,
        description: 'Development server',
      },
    ],
  },
  apis: [`${__dirname}/../docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

module.exports = specs;
