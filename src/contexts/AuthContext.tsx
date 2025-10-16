'use client'
import { createContext } from 'react'

interface AuthContextType {
	user: any
	isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
