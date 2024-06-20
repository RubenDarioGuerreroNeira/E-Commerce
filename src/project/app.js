
const express = require('express');
const { swaggerDocs, swaggerUi } = require('./swagger');

const app = express();
app.use(express.json());

// Rutas
app.use('/users', require('./routes/users'));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});




// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const { swaggerDocs } = require('./swagger');
// const userRoutes = require('./routes/users');

// const app = express();
// const port = process.env.PORT || 14800;

// app.use(express.json());
// app.use(cors({
//   // origin: process.env.CORS_ORIGIN,
//    origin: 'https://11900-idx-pm4-rubendarioguerreroneira-1718250051901.cluster-joak5ukfbnbyqspg4tewa33d24.cloudworkstations.dev',
//   methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
//   credentials: true,
// }));

// app.use('/api-docs', swaggerDocs);
// app.use('/users', userRoutes);

// app.listen(port, () => {
//   console.log(`API escuchando en http://localhost:${port}`);
//   console.log(`Swagger UI disponible en http://localhost:${port}/api-docs`);
// });