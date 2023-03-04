import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { connectDB } from './config/connectDB.js';
import { router as viewsRouter } from './routes/views.js';
import { router as authRouter } from './routes/auth.js';
import { router as usersRouter } from './routes/users.js';
import { router as coursesRouter } from './routes/courses.js';
import { router as lessonsRouter } from './routes/lessons.js';

dotenv.config();

const app = express();
// Mongo
await connectDB();
// File uploading
app.use(fileUpload({}));
// Parsing application/json
app.use(bodyParser.json())
// Parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// Mount routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/lessons', lessonsRouter);
app.get('/status', (req, res) => {
  res.send({ success: true, status: 'ok' });
});
// Set static folder
const dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(dirname, 'public')));
// Views
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'pug');
app.use('/', viewsRouter);
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Init server
const port = process.env.PORT || 3010;
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});