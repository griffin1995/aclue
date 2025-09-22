'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

/**
 * Authentication Server Actions
 *
 * Server-side authentication actions for the App Router migration.
 * These actions handle authentication logic on the server for optimal security and performance.
 *
 * Features:
 * - Server-side form processing
 * - JWT token handling
 * - Secure authentication flow
 * - Error handling and validation
 */

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  name: string
}

export interface AuthResult {
  success: boolean
  error?: string
  user?: {
    id: string
    email: string
    name: string
  }
}

/**
 * Server action to handle user login
 * @param formData - Form data from login form
 */
export async function loginAction(formData: FormData): Promise<AuthResult> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate form data
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      }
    }

    // In a real implementation, this would:
    // 1. Validate credentials against Supabase
    // 2. Create JWT tokens
    // 3. Set secure cookies
    // 4. Return user data

    // Mock implementation for foundation
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      return {
        success: false,
        error: 'Invalid credentials'
      }
    }

    const authData = await response.json()

    // Set authentication cookies
    cookies().set('auth_token', authData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Redirect to dashboard on success
    redirect('/dashboard')

  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Authentication failed. Please try again.'
    }
  }
}

/**
 * Server action to handle user registration
 * @param formData - Form data from registration form
 */
export async function registerAction(formData: FormData): Promise<AuthResult> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    // Validate form data
    if (!email || !password || !name) {
      return {
        success: false,
        error: 'All fields are required'
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address'
      }
    }

    // Password strength validation
    if (password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long'
      }
    }

    // In a real implementation, this would:
    // 1. Create user account in Supabase
    // 2. Send verification email
    // 3. Create JWT tokens
    // 4. Set secure cookies

    // Mock implementation for foundation
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.detail || 'Registration failed'
      }
    }

    const authData = await response.json()

    // Set authentication cookies
    cookies().set('auth_token', authData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Redirect to dashboard on success
    redirect('/dashboard')

  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: 'Registration failed. Please try again.'
    }
  }
}

/**
 * Server action to handle user logout
 */
export async function logoutAction(): Promise<void> {
  try {
    // Clear authentication cookies
    cookies().delete('auth_token')

    // Redirect to home page
    redirect('/')
  } catch (error) {
    console.error('Logout error:', error)
    // Even if there's an error, redirect to home
    redirect('/')
  }
}

/**
 * Server function to get current user from session
 */
export async function getCurrentUser(): Promise<AuthResult['user'] | null> {
  try {
    const authToken = cookies().get('auth_token')?.value

    if (!authToken) {
      return null
    }

    // In a real implementation, this would:
    // 1. Validate JWT token
    // 2. Fetch user data from Supabase
    // 3. Return user information

    // Mock implementation for foundation
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const userData = await response.json()
    return userData

  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}