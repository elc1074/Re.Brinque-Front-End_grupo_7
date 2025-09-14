export function getCurrentAuth() {
  if (typeof window === 'undefined') return null;

  const user = sessionStorage.getItem('user');
  const token = sessionStorage.getItem('token');
  const authType = sessionStorage.getItem('auth_type');

  return {
    user: user ? JSON.parse(user) : null,
    token,
    authType,
    isAuthenticated: !!user && !!token,
    isGoogleAuth: authType === 'google',
    isNormalAuth: authType === 'normal'
  };
}

export function logout() {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('auth_type');
  sessionStorage.removeItem('last_google_sync');
  
  fetch('/api/auth/signout', { method: 'POST' }).catch(console.error);
}