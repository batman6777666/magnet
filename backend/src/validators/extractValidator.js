function validateExtract(data) {
  const errors = [];
  const { name, type } = data || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push({ field: 'name', message: 'Missing required field: name', code: 'MISSING_NAME' });
  }

  if (!type || !['movie', 'series'].includes(type)) {
    errors.push({ field: 'type', message: 'Field "type" must be "movie" or "series"', code: 'INVALID_TYPE' });
  }

  if (type === 'series') {
    const rawSeason = parseInt(data?.season, 10);
    const rawEpisode = parseInt(data?.episode, 10);
    if (!(rawSeason >= 1)) {
      errors.push({ field: 'season', message: 'Season must be a positive number', code: 'MISSING_SEASON_EPISODE' });
    }
    if (!(rawEpisode >= 1)) {
      errors.push({ field: 'episode', message: 'Episode must be a positive number', code: 'MISSING_SEASON_EPISODE' });
    }
  }

  return errors.length ? errors : null;
}

module.exports = validateExtract;
