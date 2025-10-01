// src/lib/slug-utils.ts

/**
 * Generate a URL-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a lawyer slug from first and last name
 */
export function generateLawyerSlug(firstName: string, lastName: string): string {
  return generateSlug(`${firstName} ${lastName}`);
}

/**
 * Generate a firm slug from firm name
 */
export function generateFirmSlug(firmName: string): string {
  return generateSlug(firmName);
}

/**
 * Check if a slug is unique and modify if needed
 */
export async function ensureUniqueSlug(
  baseSlug: string, 
  checkFunction: (slug: string) => Promise<boolean>,
  maxAttempts: number = 10
): Promise<string> {
  let slug = baseSlug;
  let attempt = 1;
  
  while (await checkFunction(slug) && attempt <= maxAttempts) {
    slug = `${baseSlug}-${attempt}`;
    attempt++;
  }
  
  if (attempt > maxAttempts) {
    // Fallback to timestamp if we can't find a unique slug
    slug = `${baseSlug}-${Date.now()}`;
  }
  
  return slug;
}