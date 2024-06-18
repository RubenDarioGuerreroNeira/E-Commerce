const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swagger');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const { verifyToken } = require('./helpers/jwtHelper');

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'https://11900-idx-pm4-rubendarioguerreroneira-1718250051901.cluster-joak5ukfbnbyqspg4tewa33d24.cloudworkstations.dev',
  methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
  credentials: true,
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/', userRoutes);
app.use(errorHandler);

// Middleware para verificar el token en rutas protegidas
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token);
    if (decoded) {
      // Si el token es válido, adjunta los datos del usuario a la solicitud
      req.user = decoded;
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  } else {
    res.sendStatus(401); // Unauthorized
  }
});

module.exports = app;



// const express = require('express');
// const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocs = require('./docs/swagger');
// const userRoutes = require('./routes/userRoutes');
// const errorHandler = require('./middleware/errorHandler');

// const app = express();

// app.use(express.json());
// app.use(cors({
//   origin: 'https://11900-idx-pm4-rubendarioguerreroneira-1718250051901.cluster-joak5ukfbnbyqspg4tewa33d24.cloudworkstations.dev',
//   methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
//   credentials: true,
// }));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// app.use('/', userRoutes);
// app.use(errorHandler);

// module.exports = app;
