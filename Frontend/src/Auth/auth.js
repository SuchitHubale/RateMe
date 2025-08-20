export function isAuthenticated(currrole) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  console.log("isAuthenticated checking....")

  // Optional: Add extra validation, e.g., check token expiry
  return token && user ? true : false;
}
