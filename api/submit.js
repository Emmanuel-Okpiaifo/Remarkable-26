export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const appsScriptUrl = String(process.env.APPS_SCRIPT_URL || '').trim()
  if (!appsScriptUrl) {
    return res.status(500).json({
      ok: false,
      error: 'Server missing APPS_SCRIPT_URL.',
    })
  }

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {}

  try {
    const upstream = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    })

    const raw = await upstream.text()
    let parsed = null
    if (raw) {
      try {
        parsed = JSON.parse(raw)
      } catch {
        parsed = null
      }
    }

    if (!upstream.ok) {
      return res.status(502).json({
        ok: false,
        error: parsed?.error || `Upstream returned ${upstream.status}.`,
      })
    }

    return res.status(200).json(parsed || { ok: true })
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: `Upstream request failed: ${error.message}`,
    })
  }
}
