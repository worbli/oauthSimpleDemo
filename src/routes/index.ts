import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('index', { title: 'Express' });
});

router.get("/unauthorized",
  (req, res) => {
    res.render('unauthorized');
  });

router.get("/user",
  (req, res) => {
    if (!req.user) {
      return res.redirect("/worbli/login-oauth2");
    }

    res.render('user', req.user);
  });

export default router;
