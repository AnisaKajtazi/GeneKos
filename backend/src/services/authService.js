const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../domain/repositories/userRepository");

exports.registerUser = async (userData) => {
  const { first_name, last_name, username, email, password, role, phone, gender, date_of_birth, address } = userData;

  const existingUsers = await UserRepository.findAndCountAll({
    where: { username },
    limit: 1,
    offset: 0,
    order: [],
    attributes: ["id"]
  });
  if (existingUsers.count > 0) throw { status: 400, message: "Username ose email ekziston!" };

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserRepository.create({
    first_name,
    last_name,
    username,
    email,
    password: hashedPassword,
    role: role || 'user',
    phone: phone || null,
    gender: gender || null,
    date_of_birth: date_of_birth || null,
    address: address || null
  });

  return user;
};

exports.loginUser = async ({ username, password }) => {
  const users = await UserRepository.findAndCountAll({
    where: { username },
    limit: 1,
    offset: 0,
    order: [],
    attributes: ["id", "username", "password", "role"]
  });

  if (users.count === 0) throw { status: 400, message: "User not found" };

  const user = users.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw { status: 400, message: "Invalid password" };

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { user, token };
};
