import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get token balance
    const { data: balance, error: balanceError } = await supabase
      .from('token_balances')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Get recent game sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get withdrawal requests
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (balanceError && balanceError.code !== 'PGRST116') {
      console.error('Balance error:', balanceError)
    }

    return NextResponse.json({
      balance: balance || { balance: 0, total_earned: 0, total_withdrawn: 0 },
      sessions: sessions || [],
      withdrawals: withdrawals || [],
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
