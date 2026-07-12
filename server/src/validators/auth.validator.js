const validateRegister = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push("Name is required and must be at least 3 characters");
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("A valid email is required");
  }

  if (!data.password || data.password.length < 8) {
    errors.push("Password is required and must be at least 8 characters");
  }

  return errors;
};

const validateLogin = (data) => {
  const errors = [];

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("A valid email is required");
  }

  if (!data.password) {
    errors.push("Password is required");
  }

  return errors;
};

module.exports = { validateRegister, validateLogin };
