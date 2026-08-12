export const generateId = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const group = item[key] || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
};

export const sortByDate = (arr, field, order = 'asc') => {
  return [...arr].sort((a, b) => {
    const da = new Date(a[field]);
    const db = new Date(b[field]);
    return order === 'asc' ? da - db : db - da;
  });
};

export const filterBySearch = (arr, query, fields) => {
  if (!query.trim()) return arr;
  const q = query.toLowerCase();
  return arr.filter((item) =>
    fields.some((field) => String(item[field] || '').toLowerCase().includes(q))
  );
};

export const calcAge = (dob) => {
  if (!dob) return null;
  return Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));
};

export const safeJsonParse = (str, fallback = null) => {
  try { return JSON.parse(str); } catch { return fallback; }
};
