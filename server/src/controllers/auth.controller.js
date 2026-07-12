const { validateRegister, validateLogin } = require("../validators/auth.validator");
const { registerUser, loginUser, getUserProfile } = require("../services/auth.service");
const { generateToken } = require("../utils/generateToken");

const authController = {
  register: async (req, res, next) => {
    try {
      const errors = validateRegister(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors[0] });
      }

      await registerUser(req.body);

      res.status(201).json({
        success: true,
        message: "Registration Successful",
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const errors = validateLogin(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors[0] });
      }

      const user = await loginUser(req.body);
      const token = generateToken(user);

      res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const user = await getUserProfile(req.user._id);

      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          phone: user.phone,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
