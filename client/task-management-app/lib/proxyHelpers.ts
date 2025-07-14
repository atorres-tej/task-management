import { NextResponse } from 'next/server'

export async function handleBackendResponse(response: Response): Promise<NextResponse> {
  // Check if the response is ok
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
}

export function createHeaders(authHeader: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (authHeader) {
    headers.Authorization = authHeader
  }

  return headers
}
