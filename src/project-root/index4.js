const app = require('./app');
const port = 11900;

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
  console.log(`Swagger UI disponible en http://localhost:${port}/api-docs`);
});
