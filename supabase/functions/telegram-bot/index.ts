import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Acestea vor fi citite din Secrets-ul de pe serverul Supabase
const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

serve(async (req) => {
  try {
    const update = await req.json()

    // 1. Când utilizatorul trimite contactul (numărul de telefon)
    if (update.message?.contact) {
      const phoneNumber = update.message.contact.phone_number.replace('+', '')
      const chatId = update.message.chat.id.toString()

      // Căutăm în profiles folosind coloana de telefon (asigură-te că se numește phone_number)
      const { data: profile, error: searchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', phoneNumber)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({ 
            telegram_chat_id: chatId,
            telegram_enabled: true,
            telegram_verified_at: new Date().toISOString()
          })
          .eq('id', profile.id)

        await sendToTelegram(chatId, "✅ Cont conectat cu succes! Vei primi notificări aici.")
      } else {
        await sendToTelegram(chatId, "❌ Numărul nu a fost găsit în aplicație. Te rugăm să verifici setările profilului în app.")
      }
    } 
    
    // 2. Mesajul de start
    else if (update.message?.text === "/start") {
      await sendToTelegram(update.message.chat.id, "Salut! Apasă butonul de mai jos pentru a activa notificările:", {
        keyboard: [[{ text: "📲 Trimite numărul de telefon", request_contact: true }]],
        one_time_keyboard: true,
        resize_keyboard: true
      })
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 })
  }
})

async function sendToTelegram(chatId: string, text: string, replyMarkup?: any) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      reply_markup: replyMarkup,
      parse_mode: 'HTML'
    })
  })
}