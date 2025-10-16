import { useQuery } from '@/hooks/useQuery' 
import { TResponse } from '@/types/configs'
import { logout, userProfile } from '../endpoints/user_apis'


export const useUserProfileQuery = () => useQuery<TResponse<object>>(userProfile)
export const useLogoutQuery = () => useQuery<TResponse<null>>(logout)