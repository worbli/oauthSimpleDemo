import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('index', { title: 'Express' });
});

// Application is not authorized by user
router.get("/unauthorized",
  (req, res) => {
    res.render('unauthorized');
  });

// Application is authorized by user, show user info
router.get("/user",
  (req, res) => {
    if (!req.user) {
      return res.redirect("/");
    }

    res.render('user', req.user);
  });

export default router;
