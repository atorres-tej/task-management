import { NextRequest, NextResponse } from 'next/server'
import { API_CONSTANTS } from '@/lib/constants'

const API_BASE_URL = API_CONSTANTS.BASE_URL

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    // Get query parameters from the request
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (authHeader) {
      headers.Authorization = authHeader
    }

    // Build the URL with query parameters
    const url = queryString 
      ? `${API_BASE_URL}/api/tasks?${queryString}`
      : `${API_BASE_URL}/api/tasks`
    
    console.log('Proxy forwarding request to:', url)

    const response = await fetch(url, {
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
    console.error('Error in tasks proxy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const body = await request.json()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (authHeader) {
      headers.Authorization = authHeader
    }

    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error in tasks proxy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
