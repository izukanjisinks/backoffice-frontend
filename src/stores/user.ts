import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'employee'
  isActive: boolean
}

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      isActive: true,
    },
    {
      id: '2',
      name: 'Manager User',
      email: 'manager@example.com',
      role: 'manager',
      isActive: true,
    },
    {
      id: '3',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'employee',
      isActive: true,
    },
    {
      id: '4',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'employee',
      isActive: true,
    },
    {
      id: '5',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'manager',
      isActive: true,
    },
    {
      id: '6',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'employee',
      isActive: false,
    },
  ])

  const activeUsers = computed(() => users.value.filter(u => u.isActive))

  function getUserById(id: string): User | undefined {
    return users.value.find(u => u.id === id)
  }

  function getUserByName(name: string): User | undefined {
    return users.value.find(u => u.name === name)
  }

  return {
    users,
    activeUsers,
    getUserById,
    getUserByName,
  }
})
