const AVATAR_COLORS = [
  ['#7c6ff7', '#5a4dd6'],
  ['#00cec9', '#00b5ad'],
  ['#fd79a8', '#e84393'],
  ['#fdcb6e', '#e17055'],
  ['#55efc4', '#00b894'],
  ['#74b9ff', '#0984e3'],
  ['#a29bfe', '#6c5ce7'],
  ['#fab1a0', '#e17055'],
];

/**
 * Get a deterministic gradient pair for a given string (name or id).
 */
export function getAvatarGradient(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Get initials from a name (up to 2 characters).
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
