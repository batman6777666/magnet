function normalizeName(name) {
  return name
    .replace(/[\(\[]\s*\d{4}\s*[\)\]]/g, '')
    .replace(/[\(\[]\s*(hd|4k|bluray|dvdrip|webrip|web-dl)\s*[\)\]]/gi, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildUrl(type, normalizedName, season, episode) {
  if (type === 'movie') {
    return `https://multimovies.homes/movies/${normalizedName}/`;
  }
  const ep = typeof episode === 'number' ? episode : parseInt(episode, 10) || 1;
  const sn = typeof season === 'number' ? season : parseInt(season, 10) || 1;
  return `https://multimovies.homes/episodes/${normalizedName}-${sn}x${ep}/`;
}

module.exports = { normalizeName, buildUrl };
