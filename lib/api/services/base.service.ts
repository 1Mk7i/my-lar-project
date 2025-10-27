import axios, { AxiosInstance } from 'axios'
import { API_CONFIG } from '../config'
import { setupRequestInterceptor, setupResponseInterceptor } from '../interceptors'

export class BaseApiService {
  protected client: AxiosInstance

  constructor() {
    this.client = axios.create(API_CONFIG)
    this.setupInterceptors()
  }

  private setupInterceptors() {
    setupRequestInterceptor(this.client)
    setupResponseInterceptor(this.client)
  }

  protected async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params })
    return response.data
  }

  protected async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  protected async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  protected async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url)
    return response.data
  }
}
