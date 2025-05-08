export function saveToken(token) {
    localStorage.setItem('accessToken', token);
}
  
export function getToken() {
    return localStorage.getItem('accessToken');
}

export function removeToken() {
    localStorage.removeItem('accessToken');
}

export function isAuthenticated() {
    return !!getToken();
}
  