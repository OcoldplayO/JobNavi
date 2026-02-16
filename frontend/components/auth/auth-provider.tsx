"use client"

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react"
import { useRouter } from "next/navigation"

interface User {
    id?: number
    username: string
    nickname?: string
    email?: string
    avatar?: string
    [key: string]: any
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    login: (token: string, user: User) => void
    logout: () => void
    updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Load auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (storedToken && storedUser) {
            try {
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
            } catch (error) {
                console.error("Failed to parse user data from localStorage:", error)
                // Clear invalid data
                localStorage.removeItem("token")
                localStorage.removeItem("user")
            }
        }
        setIsLoading(false)
    }, [])

    const login = useCallback((newToken: string, newUser: User) => {
        setToken(newToken)
        setUser(newUser)
        localStorage.setItem("token", newToken)
        localStorage.setItem("user", JSON.stringify(newUser))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.replace("/login")
    }, [router])

    const updateUser = useCallback((updatedUser: User) => {
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
