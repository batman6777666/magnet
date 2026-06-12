function validate(validator) {
  return (req, res, next) => {
    const errors = validator(req.body);
    if (errors) {
      return res.status(400).json({
        success: false,
        error: errors[0].message,
        code: errors[0].code,
      });
    }
    next();
  };
}

module.exports = validate;
