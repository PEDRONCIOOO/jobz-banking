export interface MockUser {
  id: string
  name: string
  email: string
  password: string
}

export const mockUsers: MockUser[] = [
  { id: '1', name: 'Pedro Trotta', email: 'pedro@jobz.com', password: '123456' },
]
