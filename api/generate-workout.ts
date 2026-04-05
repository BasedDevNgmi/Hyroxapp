import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }

  const { system, user } = req.body as { system?: string; user?: string }
  if (!system || !user) {
    return res.status(400).json({ error: 'Missing system or user prompt' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        temperature: 0.3,
        system,
        messages: [{ role: 'user', content: user }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return res.status(502).json({ error: `Claude API error: ${response.status}`, details: errorText })
    }

    const data = await response.json()
    const textBlock = data.content?.find((b: { type: string }) => b.type === 'text')
    if (!textBlock?.text) {
      return res.status(502).json({ error: 'No text response from Claude' })
    }

    // Parse the JSON from Claude's response
    let workout
    try {
      workout = JSON.parse(textBlock.text)
    } catch {
      // Try to extract JSON from markdown code block
      const jsonMatch = textBlock.text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        workout = JSON.parse(jsonMatch[1])
      } else {
        return res.status(422).json({ error: 'Could not parse JSON from Claude response', raw: textBlock.text })
      }
    }

    return res.status(200).json(workout)
  } catch (err) {
    return res.status(500).json({ error: 'Internal error', details: String(err) })
  }
}
