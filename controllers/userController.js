const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt'); // Para encriptar la contraseña
const usersFilePath = path.join(__dirname, '../../data/users.json');


// Helper function to read JSON file
const getUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo de usuarios:', error);
        return [];
    }
};

const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

const userController = {

    registerForm: (req, res) => {
        res.render('register'); // Renderiza el formulario de registro (register.ejs)
    },

    register: (req, res) => {
        console.log('Registrar');
        const { firstName, lastName, email, password, image } = req.body;
        const users = getUsers();

        // Verificar si el email ya está registrado
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.render('register', { error: 'El email ya está registrado' });
        }

        // Encriptar la contraseña
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Crear el nuevo usuario
        const newUser = {
            id: users.length ? users[users.length - 1].id + 1 : 1,
            firstName,
            lastName,
            email,
            password: hashedPassword
            
        };

        // Agregar el nuevo usuario a la lista
        console.log(newUser);
        users.push(newUser);

        // Guardar la lista actualizada en el archivo JSON
        saveUsers(users);

        // Redirigir al login o a otra página de tu elección
        res.redirect('/login');
    },

    //Profile
    profile: (req, res) => {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/login'); // Redirige al login si no hay un usuario en sesión
        }
        res.render('profile', { user });
    },

    // Mostrar el formulario de login
    loginForm: (req, res) => {
        res.render('login', {error: null});
    },

    // Autenticar usuario
    login: (req, res) => {
        const { email, password } = req.body;
        const users = getUsers();
        const user = users.find(user => user.email === email);

        if (!user) {
            // Autenticación fallida
            res.render('login', { error: 'Correo electrónico o contraseña incorrectos' });
        }

        // Verificar la contraseña con bcrypt
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            // Autenticación fallida
            return res.render('login', { error: 'Correo electrónico o contraseña incorrectos' });
        }

        // Autenticación exitosa
        req.session.user = user;
        res.redirect('/profile');
    },

    // Cerrar sesión
    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
};

module.exports = userController;