
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Proyecto',
      version: '1.0.0',
      description: 'Documentación de la API del Proyecto',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Antonio Suarez' },
            email: { type: 'string', format: 'email', example: 'demo14@hotmail.com' },
            password: { type: 'string', example: '*aMisterMag*03' },
            confirmPassword: { type: 'string', example: '*aMisterMag*03' },
            address: { type: 'string', example: 'street 48,85-96' },
            phone: { type: 'number', example: 74125874 },
            country: { type: 'string', example: 'Colombia' },
            city: { type: 'string', example: 'Bogotá' },
          },
          required: ['email', 'name', 'password', 'confirmPassword', 'address', 'phone', 'country', 'city'],
        },
        Order: {
          type: 'object',
          properties: {
            userId: { type: 'string', example: '1a5A454aWW5a5a5767kkjsdISUIU' },
            productId: { type: 'string', example: '1a5A454aWW5a5a5767kkjsdISUIU' },
          },
          required: ['userId', 'productId'],
        },
        sigin: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'demo14@hotmail.com' },
            password: { type: 'string', example: '*aMisterMag*03' },
          },
          required: ['email', 'password'],
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = {
  swaggerDocs,
  swaggerUi,
};




// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'API de Proyecto',
//       version: '1.0.0',
//       description: 'Documentación de la API del Proyecto',
//     },
//     servers: [
//       {
//         url: `http://localhost:${process.env.PORT}`,
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//         },
//       },
//       schemas: {
//         User: {
//           type: 'object',
//           properties: {
//             name: { type: 'string', example: 'Antonio Suarez' },
//             email: { type: 'string', format: 'email', example: 'demo14@hotmail.com' },
//             password: { type: 'string', example: '*aMisterMag*03' },
//             confirmPassword: { type: 'string', example: '*aMisterMag*03' },
//             address: { type: 'string', example: 'street 48,85-96' },
//             phone: { type: 'number', example: '74125874' },
//             country: { type: 'string', example: 'Colombia' },
//             city: { type: 'string', example: 'Bogotá' },
//           },
//           required: ['email', 'name', 'password', 'confirmPassword', 'address', 'phone', 'country', 'city'],
//         },
//         Order: {
//           type: 'object',
//           properties: {
//             userId: { type: 'string', example: '1a5A454aWW5a5a5767kkjsdISUIU' },
//             productId: { type: 'string', example: '1a5A454aWW5a5a5767kkjsdISUIU' },
//             },
//           required: ['userId', 'productId', ],
//         },
//         sigin: {
//           type: 'object',
//           properties: {
//             email : { type: 'string',  format: 'email', example: 'demo14@hotmail.com' },
//             password: { type: 'string', example: '*aMisterMag*03' },
//             },
//           required: ['userId', 'productId', ],
//         },

//       },
//     },
//   },
//   apis: ['./routes/*.js'],
// };

// //       },
// //     },
// //   },
// //   apis: ['./routes/*.js'],
// // };

// // const swaggerDocs = swaggerJsdoc(swaggerOptions);

// // module.exports = {
// //   swaggerDocs: (req, res, next) => {
// //     swaggerUi.serve(req, res, next);
// //     swaggerUi.setup(swaggerDocs)(req, res);
// //   },
// // };
// module.exports = {
//   swaggerDocs: swaggerJsdoc(swaggerOptions),
//   swaggerUi: swaggerUi
// };



// // const swaggerJsdoc = require('swagger-jsdoc');
// // const swaggerUi = require('swagger-ui-express');

// // const swaggerOptions = {
// //   swaggerDefinition: {
// //     openapi: '3.0.0',
// //     info: {
// //       title: 'API de Proyecto',
// //       version: '1.0.0',
// //       description: 'Documentación de la API del Proyecto',
// //     },
// //     servers: [
// //       {
// //         url: `http://localhost:${process.env.PORT}`,
// //       },
// //     ],
// //     components: {
// //       securitySchemes: {
// //         bearerAuth: {
// //           type: 'http',
// //           scheme: 'bearer',
// //           bearerFormat: 'JWT',
// //         },
// //       },
// //       schemas: {
// //         User: {
// //           type: 'object',
// //           properties: {
// //             id: { type: 'string', example: '1a5A454aWW5a5a5767kkjsdISUIU' },
// //             email: { type: 'string', format: 'email', example: 'demo14@hotmail.com' },
// //             name: { type: 'string', example: 'Antonio Suarez' },
// //             password: { type: 'string', example: '*aMisterMag*03' },
// //             confirmPassword: { type: 'string', example: '*aMisterMag*03' },
// //             address: { type: 'string', example: 'street 48,85-96' },
// //             phone: { type: 'number', example: '74125874' },
// //             country: { type: 'string', example: 'Colombia' },
// //             city: { type: 'string', example: 'Bogotá' },
// //           },
// //           required: ['email', 'name', 'password', 'confirmPassword', 'address', 'phone', 'country', 'city'],
// //         },
// //       },
// //     },
// //   },
// //   apis: ['./routes/*.js'],
// // };

// // const swaggerDocs = swaggerJsdoc(swaggerOptions);

// // module.exports = {
// //   swaggerDocs: (req, res, next) => {
// //     swaggerUi.serve(req, res, next);
// //     swaggerUi.setup(swaggerDocs)(req, res);
// //   },
// // };