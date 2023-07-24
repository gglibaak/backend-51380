

class authController {

    getLogin = (req, res) => {
        return res.render('login', {});
    }

    getRegister = (req, res) => {
        return res.render('register', {});
    }

    passportLogin = async (req, res) => {
        req.session.email = req.user.email;
        req.session.role = req.user.role;
        req.session.first_name = req.user.first_name;
        req.session.last_name = req.user.last_name;
        req.session.age = req.user.age;
        req.session.cartID = req.user.cartID;
      
        return res.redirect('/products');
    }

    passportRegister = async (req, res) => {
        const { first_name, last_name, email, age } = req.body;
      
        req.session.email = email;
        req.session.role = 'user';
        req.session.first_name = first_name;
        req.session.last_name = last_name;
        req.session.age = age;
        req.session.cartID = req.user.cartID;
      
        return res.redirect('/products');
    }

    failRegister = (req, res) => {
        const { error } = req.flash();
        return res.status(400).render('error', { error });
    }

    logout = (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.json({ status: 'error', body: err });
            }
        });
        return res.redirect('/auth/login');
    }

    getProfile = (req, res) => {
        const role = req.session.role === 'admin' ? 'Administrador' : 'Usuario Estándar';
        return res.render('profile', {
            firstname: req.session.first_name,
            lastname: req.session.last_name,
            email: req.session.email,
            isadmin: role,
            age: req.session.age,
            cartid: req.session.cartID,
        });
    }

    githubCallback = (req, res) => {
        req.session.email = req.user.email;
        req.session.role = req.user.role;
        req.session.first_name = req.user.first_name;
        req.session.last_name = req.user.last_name;
        req.session.age = req.user.age;
        req.session.cartID = req.user.cartID;
        return res.redirect('/products');
    }

    facebookCallback = (req, res) => {
        req.session.email = req.user.email;
        req.session.role = req.user.role;
        req.session.first_name = req.user.first_name;
        req.session.last_name = req.user.last_name;
        req.session.age = req.user.age;
        req.session.cartID = req.user.cartID;
        return res.redirect('/products');
    }

    googleCallback = (req, res) => {
        req.session.email = req.user.email;
        req.session.role = req.user.role;
        req.session.first_name = req.user.first_name;
        req.session.last_name = req.user.last_name;
        req.session.age = req.user.age;
        req.session.cartID = req.user.cartID;
        return res.redirect('/products');
    }

}

module.exports = new authController();