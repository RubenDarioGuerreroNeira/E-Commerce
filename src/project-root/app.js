const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swagger');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

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

module.exports = app;
