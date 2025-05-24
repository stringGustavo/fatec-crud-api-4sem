import express from 'express';
import userRoutes from '../routes/users.js';

const port = 3000;
const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
