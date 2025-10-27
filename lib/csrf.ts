// lib/csrf.ts
import axios from 'axios';

const CSRF_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

export const initializeCSRF = async (): Promise<boolean> => {
  try {
    await axios.get(`${CSRF_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    console.log('✅ CSRF token initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize CSRF token:', error);
    return false;
  }
};