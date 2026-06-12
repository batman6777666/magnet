function success(res, data, status = 200) {
  return res.status(status).json(data);
}

function error(res, message, status = 500, code = 'INTERNAL_ERROR') {
  return res.status(status).json({
    success: false,
    error: message,
    code,
  });
}

module.exports = { success, error };
