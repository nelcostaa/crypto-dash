interface Env {
    COINCAP_API_KEY?: string
    COINCAP_API_BASE_URL?: string
}

interface PagesContext {
    env: Env
    request: Request
}

export async function onRequestGet(context: PagesContext) {
    const apiKey = context.env.COINCAP_API_KEY?.trim()

    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: 'Missing COINCAP_API_KEY secret in Cloudflare Pages.' }),
            {
                status: 500,
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                },
            }
        )
    }

    const baseUrl =
        context.env.COINCAP_API_BASE_URL?.trim().replace(/\/+$/, '') || 'https://pro.coincap.io'

    const requestUrl = new URL(context.request.url)
    const query = requestUrl.searchParams.toString()
    const upstreamUrl = `${baseUrl}/v2/assets${query ? `?${query}` : ''}`

    const upstreamResponse = await fetch(upstreamUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json',
        },
    })

    const body = await upstreamResponse.text()

    return new Response(body, {
        status: upstreamResponse.status,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'public, max-age=30',
        },
    })
}
