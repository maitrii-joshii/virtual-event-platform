const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 6;
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { UserAlreadyExistsError, LoginError } = require('../errors/authError');
const { id } = require('zod/locales');

class AuthService {
    // Register a new user
    registerUser = async(name = undefined, email = undefined, password = undefined, role = undefined) => {
        const existingUser = await userRepository.findByEmailAndRole(email, role);
        if(existingUser) {
            throw new UserAlreadyExistsError();
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const userEntity = {
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        }
        const user = await userRepository.create(userEntity);
        
        return user;
    };

    // Login a user and return a JWT token
    loginUser = async(email, password, role) => {
        const user = await userRepository.findByEmailAndRole(email, role);

        if(!user) {
            throw new LoginError();
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new LoginError();
        }

        const token = jwt.sign({ email: user.email, role: user.role, id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

        return token;
    };
}


module.exports = new AuthService();