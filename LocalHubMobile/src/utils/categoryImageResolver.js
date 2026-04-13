const norm = (v) => String(v || '').toLowerCase().trim();

const CATEGORY_BY_KEYWORD = [
  ['home', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800'],
  ['appliance', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800'],
  ['clean', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800'],
  ['pest', 'https://images.unsplash.com/photo-1583842183201-9018448ec629?q=80&w=800'],
  ['beauty', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800'],
  ['groom', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800'],
  ['mover', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800'],
  ['health', 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=800'],
  ['medical', 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=800'],
  ['auto', 'https://images.unsplash.com/photo-1487754164641-a095905fd481?q=80&w=800'],
  ['event', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800'],
  ['wedding', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800'],
  ['tutor', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800'],
  ['education', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800'],
  ['emergency', 'https://images.unsplash.com/photo-1583842183201-9018448ec629?q=80&w=800'],
  ['estate', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800'],
  ['daily', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800'],
  ['grocery', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800'],
  ['food', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800'],
  ['restaurant', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800'],
  ['hotel', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800'],
];

const SUB_BY_KEYWORD = [
  ['electric', 'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18?q=80&w=800'],
  ['plumb', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800'],
  ['carpent', 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=800'],
  ['paint', 'https://images.unsplash.com/photo-1562591176-3293099a0bf3?q=80&w=800'],
  ['restaurant', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800'],
  ['hotel', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800'],
  ['cafe', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800'],
  ['bakery', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800'],
  ['cater', 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800'],
  ['tiffin', 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800'],
  ['ac', 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=800'],
  ['fridge', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800'],
  ['refrigerator', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800'],
  ['washing', 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=800'],
  ['tv', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800'],
];

export function resolveCategoryImage(category) {
  const name = norm(category?.name || category);
  for (const [kw, img] of CATEGORY_BY_KEYWORD) if (name.includes(kw)) return img;
  return category?.image || category?.image_url || '';
}

export function resolveSubcategoryImage(sub, parentName = '') {
  const name = norm(sub?.name || sub);
  for (const [kw, img] of SUB_BY_KEYWORD) if (name.includes(kw)) return img;
  if (parentName) {
    const byParent = resolveCategoryImage({ name: parentName });
    if (byParent) return byParent;
  }
  return sub?.image || sub?.image_url || '';
}

