export function getStatus(
  expiresDate: Date,
  now: Date
): "EXPIRED" | "EXPIRES TODAY" | "VALID" {
  if (
    expiresDate.getTime() < now.getTime() &&
    expiresDate.getDate() !== now.getDate()
  ) {
    return "EXPIRED";
  } else if (
    expiresDate.getDate() === now.getDate() &&
    expiresDate.getMonth() === now.getMonth() &&
    expiresDate.getFullYear() === now.getFullYear()
  ) {
    return "EXPIRES TODAY";
  } else if (expiresDate.getTime() < now.getTime()) {
    return "EXPIRED";
  } else {
    return "VALID";
  }
}
