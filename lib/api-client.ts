// lib/api-client.ts
// DEPRECATED: This file is kept for backward compatibility
// Please use the new modular API structure from lib/api/

import { apiClient as newApiClient } from './api'

console.warn('⚠️ lib/api-client.ts is deprecated. Please use lib/api/ instead.')

export const apiClient = newApiClient
