function validateAuth(data) {
  const errors = [];
  const { name, email } = data || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name is required (minimum 2 characters)', code: 'INVALID_NAME' });
    return errors;
  }

  if (name.trim().length > 80) {
    errors.push({ field: 'name', message: 'Name too long (max 80 characters)', code: 'INVALID_NAME' });
    return errors;
  }

  if (email && typeof email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push({ field: 'email', message: 'Invalid email format', code: 'INVALID_EMAIL' });
    }
  }

  return errors.length ? errors : null;
}

module.exports = validateAuth;
