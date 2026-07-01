const STORAGE_KEY = "bletchai_purchased_courses";
export const PURCHASED_EVENT = "bletchai:purchased-courses-updated";

export function getPurchasedCourses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function isCoursePurchased(id) {
  return getPurchasedCourses().includes(id);
}

export function markCoursePurchased(id) {
  const current = getPurchasedCourses();
  if (current.includes(id)) return; // sudah tercatat, tidak perlu duplikat
  const next = [...current, id];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  // beri tahu komponen lain (di tab/halaman yang sama) supaya UI langsung update
  window.dispatchEvent(new CustomEvent(PURCHASED_EVENT, { detail: { id } }));
}