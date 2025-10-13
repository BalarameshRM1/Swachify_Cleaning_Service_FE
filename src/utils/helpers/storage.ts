export function getUserDetails(): any | null {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}