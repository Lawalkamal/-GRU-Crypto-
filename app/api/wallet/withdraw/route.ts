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

    const { amount, walletAddress } = await request.json()

    if (typeof amount !== 'number' || amount < 100) {
      return NextResponse.json(
        { error: 'Minimum withdrawal is 100 $GRU' },
        { status: 400 },
      )
    }

    if (!walletAddress || typeof walletAddress !== 'string' || !walletAddress.startsWith('0x')) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 },
      )
    }

    // Check balance
    const { data: balance } = await supabase
      .from('token_balances')
      .select('balance, total_withdrawn')
      .eq('user_id', user.id)
      .single()

    if (!balance || Number(balance.balance) < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 },
      )
    }

    // Create withdrawal request
    const { error: withdrawError } = await supabase
      .from('withdrawal_requests')
      .insert({
        user_id: user.id,
        amount,
        wallet_address: walletAddress,
        status: 'pending',
      })

    if (withdrawError) {
      console.error('Withdraw error:', withdrawError)
      return NextResponse.json({ error: 'Failed to create withdrawal' }, { status: 500 })
    }

    // Deduct from balance and add to total_withdrawn
    const { error: updateError } = await supabase
      .from('token_balances')
      .update({
        balance: Number(balance.balance) - amount,
        total_withdrawn: Number(balance.total_withdrawn) + amount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Balance update error:', updateError)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
