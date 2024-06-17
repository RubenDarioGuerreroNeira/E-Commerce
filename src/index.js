// ---------- beta 1 .0------------------------
const express = require('express');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/src/app.module'); // Asegúrate de que la ruta sea correcta
const { ValidationPipe } = require('@nestjs/common');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');

async function bootstrap() {
    const app = express();
    const port = 550;

    // Inicia una instancia de NestJS
    const nestApp = await NestFactory.create(AppModule, { bodyParser: false });
    await nestApp.init();

    // Configuración de Swagger
    const options = new DocumentBuilder()
        .setTitle('E-Commerce M04 HENRY')
        .setDescription('P.I MODULE 04 HENRY')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    
    const document = SwaggerModule.createDocument(nestApp, options);
    SwaggerModule.setup('api', nestApp, document);

    // Configura el manejo de validación global
    nestApp.useGlobalPipes(new ValidationPipe());

    // Monta la instancia de NestJS como middleware en Express
    app.use(nestApp.getHttpAdapter().getInstance());

    app.listen(port, () => {
        console.log(`API escuchando en http://localhost:${port}`);
        console.log(`Swagger UI disponible en http://localhost:${port}/api`);
    });
}

bootstrap();



// // ---------- beta 1 .1------------------------
// const express = require('express');
// const { Pool } = require('pg');
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const app = express();
// const port = 4999;

// const pool = new Pool({
//   user: 'root',
//   host: '35.227.164.209',
//   database: 'proyecto_5qko',
//   password: 'GzInv8S6vPS4VhSAwBIyBmzstt72oVWV',
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// // Configuración de Swagger
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
//         url: `http://localhost:${port}`,
//       },
//     ],
//   },
//   apis: ['./index.js'], // Aquí puedes cambiarlo a donde tengas los comentarios JSDoc
// };

// const swaggerDocs = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// /**
//  * @swagger
//  * /data:
//  *   get:
//  *     summary: Obtiene datos de la tabla
//  *     responses:
//  *       200:
//  *         description: Éxito al obtener datos
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *       500:
//  *         description: Error al obtener datos
//  */
// app.get('/data', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM tu_tabla'); // Reemplaza 'tu_tabla' con el nombre de tu tabla
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error al obtener datos');
//   }
// });

// app.listen(port, () => {
//   console.log(`API escuchando en http://localhost:${port}`);
//   console.log(`Swagger UI disponible en http://localhost:${port}/api-docs`);
// });






//-----------------------------B1--------------
// ---NOTA EL PUERTO DE LOS ENDPOINTS DEBE SER EL MISMO AL DEL MAIN 
// const express = require('express');
// const { Pool } = require('pg');

// const app = express();
// const port = 3500;

// const pool = new Pool({
//   user: 'root',
//   host: '35.227.164.209',
//   database: 'proyecto_5qko',
//   password: 'GzInv8S6vPS4VhSAwBIyBmzstt72oVWV',
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// app.get('/data', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM tu_tabla'); // Reemplaza 'tu_tabla' con el nombre de tu tabla
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error al obtener datos');
//   }
// });


// app.listen(port, () => {
//   console.log(`API escuchando en http://localhost:${port}`);
// });


