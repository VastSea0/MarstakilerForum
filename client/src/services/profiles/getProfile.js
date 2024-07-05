import { useApiPrivate } from '@/combosables/useApi'

export const getUserProfile = async (id) => {
  try {
    const { data } = await useApiPrivate().get(`/auth/user/${id}`)
    console.log(data)
    return data.data
  } catch (error) {
    throw new Error(error.message)
  }
}
