export function getStatus(
  expiresDate: Date,
  now: Date
): "EXPIRED" | "EXPIRES TODAY" | "VALID" {
  if (expiresDate < now) {
    return "EXPIRED";
  } else if (
    expiresDate.getDate() === now.getDate() &&
    expiresDate.getMonth() === now.getMonth() &&
    expiresDate.getFullYear() === now.getFullYear()
  ) {
    return "EXPIRES TODAY";
  } else {
    return "VALID";
  }
}
