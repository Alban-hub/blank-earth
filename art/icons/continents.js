// Continent silhouettes — six abstract blob shapes inside a dashed-circle
// world frame. The shape paths are deliberately impressionistic, not
// geographically accurate (matching the editorial illustration tone).
//
// Each path is the silhouette inside a 64×64 viewBox; the contBadge helper
// wraps it in the dashed circle frame and applies the ink colour.
import { registerArt } from '../_registry.js';
import { contBadge } from '../_helpers.js';

registerArt('cont-EU', (ink) => contBadge(ink, 'M14 36 C18 22 28 16 38 18 C48 20 52 28 50 36 C48 44 38 50 28 48 C20 46 12 44 14 36 Z'));
registerArt('cont-AS', (ink) => contBadge(ink, 'M10 24 C18 16 30 14 42 18 C54 22 56 34 50 44 C42 54 26 52 18 46 C10 40 6 32 10 24 Z'));
registerArt('cont-AF', (ink) => contBadge(ink, 'M22 12 C34 12 44 22 42 34 C42 44 36 52 28 52 C20 52 16 42 18 32 C18 22 16 16 22 12 Z'));
registerArt('cont-NA', (ink) => contBadge(ink, 'M14 18 C26 12 42 16 48 26 C52 36 42 44 32 42 C22 42 14 50 12 40 C10 30 8 22 14 18 Z'));
registerArt('cont-SA', (ink) => contBadge(ink, 'M28 10 C38 12 42 22 38 32 C36 44 28 54 24 50 C20 46 22 38 22 30 C22 20 22 10 28 10 Z'));
registerArt('cont-OC', (ink) => contBadge(ink, 'M16 28 C24 22 36 24 42 30 C46 36 38 44 28 42 C20 40 12 34 16 28 Z M48 18 a2 2 0 1 0 0.1 0 Z M50 44 a2 2 0 1 0 0.1 0 Z'));
