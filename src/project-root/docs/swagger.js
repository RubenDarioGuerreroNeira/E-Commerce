const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce',
      version: '1.0.0',
      description: 'E-commerce´s API Documentation',
      contact: {
        name: 'Rubén D.Guerrero N',
        email: 'rudargeneira@gmail.com',
        url: 'http://www.ruben-guerrero.com',
      },
      license: {
        name: 'Licencia Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    servers: [
      {
        url: `http://localhost:11900`,
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: '3CqFP@example.com' },
            name: { type: 'string', example: 'Antonio Suarez' },
            password: { type: 'string', example: '*Pasd85Poa' },
            confirmPassword: { type: 'string', example: '*Pasd85Poa' },
            address: { type: 'string', example: 'street 48,85-96' },
            phone: { type: 'number', example: '74125874' },
            country: { type: 'string', example: 'Colombia' },
            city: { type: 'string', example: 'Bogotá' },
          },
          required: ['email', 'name', 'password', 'confirmPassword', 'address', 'phone', 'country', 'city'],
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Aquí especificas la ruta a los archivos donde están los comentarios JSDoc
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
