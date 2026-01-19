// src/services/api.js
export const fetchProtectedData = async () => {
    const response = await fetch('/api/protected-data/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch protected data');
    return await response.json();
  };
  
  // Usage in components:
  import { fetchProtectedData } from '../services/api';
  
  const data = await fetchProtectedData();