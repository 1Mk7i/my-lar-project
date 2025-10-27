import { BaseApiService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { TestConnectionResponse } from '../types'

export class SystemService extends BaseApiService {
  async testConnection(): Promise<TestConnectionResponse> {
    console.log('🔧 Тестування базового підключення...')
    try {
      const response = await this.get<TestConnectionResponse>(API_ENDPOINTS.test)
      console.log('✅ Підключення успішне:', response)
      return response
    } catch (error) {
      console.error('❌ Тест підключення не вдався:', error)
      throw error
    }
  }

  async checkHealth(): Promise<any> {
    return this.get(API_ENDPOINTS.health)
  }
}

export const systemService = new SystemService()

// Debug logging
console.log('🔍 system.service.ts - systemService created:', systemService)
console.log('🔍 system.service.ts - testConnection method:', systemService.testConnection)
