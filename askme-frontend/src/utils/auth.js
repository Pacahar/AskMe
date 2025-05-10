import { API_URL } from '../config.js'

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

export function saveRefreshToken(token) {
    localStorage.setItem('refreshToken', token)
}

export function getRefreshToken() {
    return localStorage.getItem('refreshToken')
}

export function removeRefreshToken() {
  localStorage.removeItem('refreshToken');
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(API_URL + '/auth/jwt/refresh/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    removeToken();
    removeRefreshToken();
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  saveToken(data.access);
  return data.access;
}