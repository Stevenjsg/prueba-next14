// convert string to slug
export function stringToSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "")
}
export function slugToString(slug: string) {
  return slug.toString().toLowerCase().replace(/-/g, " ")
}
