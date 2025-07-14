import { NextRequest, NextResponse } from 'next/server'
import { API_CONSTANTS } from '@/lib/constants'

const API_BASE_URL = API_CONSTANTS.BASE_URL

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (authHeader) {
      headers.Authorization = authHeader
    }

    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'GET',
      headers,
    })

    // Check if the response is ok and has content
    if (!response.ok) {
      console.error(`Backend responded with status: ${response.status}`)
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      )
    }

    // Check if response has content
    const text = await response.text()
    if (!text) {
      console.error('Backend returned empty response')
      return NextResponse.json(
        { error: 'Empty response from backend' },
        { status: 500 }
      )
    }

    // Try to parse JSON
    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError)
      console.error('Response text:', text)
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error in users proxy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
