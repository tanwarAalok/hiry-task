const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const db = require('../config/database');
const { users } = require('../db/schema');
const { sql } = require('drizzle-orm');

exports.findByEmail = async (email) => {
    return db.select().from(users).where(sql`${users.email} = ${email}`).limit(1);
};

exports.createUser = async (userData) => {
    return db.insert(users).values(userData).returning();
};

exports.registerUser = async (name, email, password, image) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.createUser({ name, email, password: hashedPassword, image });
    return newUser[0];
};

exports.loginUser = async (email, password) => {
    const [user] = await this.findByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new Error('Invalid password');
    }
    const token = jwt.sign({ id: user.id });
    return { token, user: { id: user.id, name: user.name, email: user.email, image: user.image } };
};