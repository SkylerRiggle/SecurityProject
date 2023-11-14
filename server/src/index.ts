import express from 'express';
import register from './core/router';

/* Initialize a New Express Application */
const app = express();
const port = process.env.PORT || 3333;

/* Register Application Routes */
register(app);

/* Signal Application is Running On Localhost */
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});