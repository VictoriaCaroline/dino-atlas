import { httpApi } from './http'
import { mockApi } from './mock'

export const usandoMock = import.meta.env.VITE_MOCK === 'true'
export const api = usandoMock ? mockApi : httpApi
