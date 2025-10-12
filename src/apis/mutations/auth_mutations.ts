import { useForm } from '@/hooks/useForm'
import { login, register } from '@/apis/endpoints/auth_apis'
import { LoginType, RegisterType } from '../types/auth_type'

export const useLoginMutation = (data: LoginType) => useForm<LoginType>(login, data)
export const useRegistrationMutation = (data: RegisterType) => useForm<RegisterType>(register, data)
