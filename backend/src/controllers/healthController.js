function health(_req, res) {
  res.json({ status: 'ok', uptime: Math.floor(process.uptime()) });
}

module.exports = { health };
