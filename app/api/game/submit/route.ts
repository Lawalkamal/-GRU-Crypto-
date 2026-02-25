import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { score, duration } = await request.json()

    // Basic server-side validation
    if (typeof score !== 'number' || score < 0 || score > 9999) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
    }
    if (typeof duration !== 'number' || duration < 0 || duration > 7200) {
      return NextResponse.json({ error: 'Invalid duration' }, { status: 400 })
    }

    // Use the server-side function to credit tokens (prevents cheating)
    const { data, error } = await supabase.rpc('credit_game_tokens', {
      p_user_id: user.id,
      p_score: score,
      p_duration: duration,
    })

    if (error) {
      console.error('Error crediting tokens:', error)
      return NextResponse.json({ error: 'Failed to record game' }, { status: 500 })
    }

    return NextResponse.json({ success: true, ...data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
