import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import logger from 'morgan';
import path from 'path';
import session from "express-session";

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import worbliRouter from './routes/worbli';
import passport from "./passport";

const app = express();

// init session
app.use(session({
  secret: 'session_super_secret',
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/worbli', worbliRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
