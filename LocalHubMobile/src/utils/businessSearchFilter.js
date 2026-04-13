import { mockCategories } from '../services/categoryService';

const norm = (s) => (s == null ? '' : String(s)).trim().toLowerCase();

function normalizeQuery(s) {
  return norm(s)
    .replace(/&/g, ' and ')
    .replace(/\brestaurantrs\b/g, 'restaurants')
    .replace(/\bresturant\b/g, 'restaurant')
    .replace(/\brestuarant\b/g, 'restaurant')
    .replace(/\bfoods\b/g, 'food')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(s) {
  return normalizeQuery(s)
    .split(/[\s,/|]+/)
    .map((t) => t.replace(/[^a-z0-9]/gi, ''))
    .filter(Boolean);
}

const CATEGORY_ALIASES = {
  'food and dining': ['restaurants and food', 'restaurants', 'food'],
  'restaurants and food': ['food and dining', 'restaurants', 'food'],
  'daily needs': ['daily life', 'groceries'],
  'daily life': ['daily needs', 'groceries'],
};

/** Same subcategory label (allows minor API vs mock differences). */
function subcategoryLabelsMatch(businessSub, targetSub) {
  const a = norm(businessSub);
  const b = norm(targetSub);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  const ta = tokens(businessSub);
  const tb = tokens(targetSub);
  if (ta.length && tb.length && tb.every((t) => ta.some((x) => x.includes(t) || t.includes(x)))) return true;
  return false;
}

function categoryLabelsMatch(businessCat, targetCat) {
  const a = normalizeQuery(businessCat);
  const b = normalizeQuery(targetCat);
  if (!a || !b) return false;
  if (a === b) return true;
  if ((CATEGORY_ALIASES[a] || []).includes(b) || (CATEGORY_ALIASES[b] || []).includes(a)) return true;
  if (a.includes(b) || b.includes(a)) return true;
  const ta = tokens(a).filter((t) => t.length > 2);
  const tb = tokens(b).filter((t) => t.length > 2);
  if (!ta.length || !tb.length) return false;
  const overlap = tb.filter((t) => ta.some((x) => x.includes(t) || t.includes(x)));
  return overlap.length >= Math.max(1, Math.ceil(tb.length / 2));
}

function businessHaystack(b) {
  return [
    b.name,
    b.category,
    b.category_name,
    b.subcategory,
    b.subcategory_name,
    b.description,
    b.title,
  ]
    .map(normalizeQuery)
    .join(' ');
}

/**
 * Strict match when user opened search from Categories (subcategory tile / search chip).
 * Prevents unrelated listings (e.g. Electronics when user chose Restaurants).
 */
export function matchesStrictBrowse(b, ctx) {
  const subId = ctx.subcategoryId != null ? String(ctx.subcategoryId) : '';
  const catId = ctx.categoryId != null ? String(ctx.categoryId) : '';
  const subName = ctx.subcategoryName || '';
  const catName = ctx.categoryName || '';

  const bSubId = String(b.subcategory_id ?? b.subcategoryId ?? '');
  const bCatId = String(b.category_id ?? b.categoryId ?? '');
  const bSub = b.subcategory || b.subcategory_name || '';
  const bCat = b.category || b.category_name || '';
  const hay = businessHaystack(b);

  if (subId && bSubId && bSubId === subId) return true;

  if (subName) {
    const subMatch = subcategoryLabelsMatch(bSub, subName);
    const nameMatch = matchesFreeTextQuery({ ...b, description: '', title: '' }, subName);
    if (!subMatch && !nameMatch) return false;
    if (catId && bCatId && bCatId === catId) return true;
    if (catName && categoryLabelsMatch(bCat, catName)) {
      return true;
    }
    if (catId && !bCatId && catName && categoryLabelsMatch(bCat, catName)) return true;
    if (!catId && catName && categoryLabelsMatch(bCat, catName)) return true;
    // If backend omits category mapping completely, rely on subcategory/name match only.
    if (!bCat && !bCatId) return true;
    return false;
  }

  if (catId) {
    if (bCatId && bCatId === catId) return true;
    if (catName && categoryLabelsMatch(bCat, catName)) return true;
    return false;
  }

  if (catName) {
    return categoryLabelsMatch(bCat, catName);
  }

  return false;
}

/** Free search: match query text across common fields. */
export function matchesFreeTextQuery(b, query) {
  const q = normalizeQuery(query);
  if (!q) return true;
  const hay = businessHaystack(b);
  if (hay.includes(q)) return true;

  // Token-based fallback for phrases / minor typos ("restaurants and food")
  const qTokens = tokens(q).filter((t) => t.length > 2);
  if (!qTokens.length) return false;
  const hTokens = tokens(hay);
  return qTokens.every((qt) => hTokens.some((ht) => ht.includes(qt) || qt.includes(ht)));
}

export function filterBusinessesByContext(businesses, ctx) {
  const list = Array.isArray(businesses) ? businesses : [];
  const strict =
    ctx.strictBrowse &&
    !!(ctx.subcategoryId || ctx.subcategoryName || ctx.categoryId || ctx.categoryName);

  if (strict) {
    return list.filter((b) => matchesStrictBrowse(b, ctx));
  }

  return list.filter((b) => matchesFreeTextQuery(b, ctx.query || ''));
}

let seededCache;

/** One demo provider per mock subcategory — aligned category_id / subcategory_id for filtering. */
export function getSeededBusinesses() {
  if (seededCache) return seededCache;
  const out = [];
  const SHOP_SUFFIXES = [
    'Experts',
    'Solutions',
    'Center',
    'Hub',
  ];
  const CITY_PROFILES = [
    { city: 'Sangli', area: 'MG Road', latitude: 16.8524, longitude: 74.5815 },
    { city: 'Miraj', area: 'Station Road', latitude: 16.8302, longitude: 74.6420 },
    { city: 'Pune', area: 'Shivaji Nagar', latitude: 18.5204, longitude: 73.8567 },
    { city: 'Kolhapur', area: 'Tarabai Park', latitude: 16.7050, longitude: 74.2433 },
  ];

  let n = 0;
  for (const cat of mockCategories) {
    for (const sub of cat.subcategories || []) {
      for (let i = 0; i < SHOP_SUFFIXES.length; i += 1) {
        n += 1;
        const suffix = SHOP_SUFFIXES[i];
        const cityProfile = CITY_PROFILES[i % CITY_PROFILES.length];
        const latJitter = ((n % 5) - 2) * 0.003;
        const lngJitter = ((n % 7) - 3) * 0.003;
        out.push({
          id: `seed-${sub.id}-${i + 1}`,
          name: `${sub.name} ${suffix}`,
          category: cat.name,
          category_name: cat.name,
          category_id: String(cat.id),
          subcategory: sub.name,
          subcategory_name: sub.name,
          subcategory_id: String(sub.id),
          city: cityProfile.city,
          locality: cityProfile.area,
          rating: 4.1 + ((n % 9) * 0.1),
          reviews: 18 + (n % 45) * 4,
          address: `${cityProfile.area}, ${cityProfile.city}, Maharashtra`,
          latitude: cityProfile.latitude + latJitter,
          longitude: cityProfile.longitude + lngJitter,
          image: sub.image || cat.image,
          distance: `${(n % 6) + 1}.${(n % 9)} km`,
          tier: n % 3 === 0 ? 'premium' : (n % 2 === 0 ? 'standard' : 'basic'),
          featured: n % 5 === 0,
          description: `Trusted ${sub.name} provider in ${cat.name}. Fast response and verified service professionals.`,
        });
      }
    }
  }
  seededCache = out;
  return seededCache;
}

export function mergeBusinessLists(apiRows, seeds) {
  const byId = new Map();
  for (const b of seeds || []) {
    if (b?.id != null) byId.set(String(b.id), b);
  }
  for (const b of apiRows || []) {
    if (b?.id == null) continue;
    const k = String(b.id);
    if (!byId.has(k)) byId.set(k, b);
    else {
      const prev = byId.get(k);
      byId.set(k, { ...prev, ...b, image: b.image_url || b.image || prev.image });
    }
  }
  return Array.from(byId.values());
}
