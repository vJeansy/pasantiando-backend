export default function capitalize(text?: string): string {
  return typeof text === "string" && text.trim() !== ""
    ? text.charAt(0).toUpperCase() + text.slice(1)
    : "";
}