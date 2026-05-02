// Four hemisphere icons — globe with one half (top/bottom/left/right) filled in.
// All four share the hemiBadge helper, just passing different fill positions.
import { registerArt } from '../_registry.js';
import { hemiBadge } from '../_helpers.js';

registerArt('hemi-N', (ink) => hemiBadge(ink, 'top'));
registerArt('hemi-S', (ink) => hemiBadge(ink, 'bottom'));
registerArt('hemi-E', (ink) => hemiBadge(ink, 'right'));
registerArt('hemi-W', (ink) => hemiBadge(ink, 'left'));
