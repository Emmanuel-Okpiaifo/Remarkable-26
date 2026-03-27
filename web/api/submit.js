export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const appsScriptUrl = String(process.env.APPS_SCRIPT_URL || '').trim()
  const appsScriptKey = String(process.env.APPS_SCRIPT_KEY || '').trim()

  const isScriptDomain = /^https:\/\/script\.google\.com\/macros\/s\//i.test(appsScriptUrl)
  const hasExecPath = /\/exec(?:[/?#].*)?$/i.test(appsScriptUrl)
  if (!appsScriptUrl || !appsScriptKey || !isScriptDomain || !hasExecPath) {
    return res.status(500).json({
      ok: false,
      error: 'Server is missing APPS_SCRIPT_URL or APPS_SCRIPT_KEY configuration.',
    })
  }

  const incoming = typeof req.body === 'object' && req.body !== null ? req.body : {}
  const payload = {
    apiKey: appsScriptKey,
    ...incoming,
  }

  try {
    const upstream = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })

    const rawText = await upstream.text()
    let parsed = null
    if (rawText) {
      try {
        parsed = JSON.parse(rawText)
      } catch {
        parsed = null
      }
    }

    const responseBody = parsed ?? { ok: upstream.ok, status: upstream.status, raw: rawText }
    return res.status(upstream.ok ? 200 : 502).json(responseBody)
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: `Upstream request failed: ${error.message}`,
    })
  }
}
