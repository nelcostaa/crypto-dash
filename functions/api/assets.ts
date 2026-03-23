interface Env {
    COINCAP_API_KEY?: string
    COINCAP_API_BASE_URL?: string
}

interface PagesContext {
    env: Env
    request: Request
}

const DEFAULT_BASE_URL = 'https://rest.coincap.io'
const DEFAULT_LIMIT = 100
const MAX_LIMIT = 200
const MAX_OFFSET = 10_000
const UPSTREAM_TIMEOUT_MS = 8_000

type AllowedParam = 'search' | 'ids' | 'limit' | 'offset'

const ALLOWED_QUERY_PARAMS: ReadonlySet<AllowedParam> = new Set([
    'search',
    'ids',
    'limit',
    'offset',
])

function jsonResponse(body: unknown, status: number, cacheControl = 'no-store') {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': cacheControl,
            'x-content-type-options': 'nosniff',
        },
    })
}

function clampInt(value: string | null, min: number, max: number, fallback: number) {
    if (!value) {
        return fallback
    }

    const parsed = Number.parseInt(value, 10)

    if (!Number.isFinite(parsed)) {
        return fallback
    }

    return Math.min(max, Math.max(min, parsed))
}

function buildSafeUpstreamUrl(requestUrl: URL, baseUrl: string) {
    const searchParams = new URLSearchParams()

    for (const [key, value] of requestUrl.searchParams.entries()) {
        if (ALLOWED_QUERY_PARAMS.has(key as AllowedParam) && value.trim().length > 0) {
            searchParams.append(key, value)
        }
    }

    const limit = clampInt(searchParams.get('limit'), 1, MAX_LIMIT, DEFAULT_LIMIT)
    const offset = clampInt(searchParams.get('offset'), 0, MAX_OFFSET, 0)

    searchParams.set('limit', String(limit))
    searchParams.set('offset', String(offset))

    const upstreamUrl = new URL('/v3/assets', baseUrl)
    upstreamUrl.search = searchParams.toString()

    return upstreamUrl.toString()
}

export async function onRequestGet(context: PagesContext) {
    const apiKey = context.env.COINCAP_API_KEY?.trim()

    if (!apiKey) {
        return jsonResponse({ error: 'Missing COINCAP_API_KEY secret in Cloudflare Pages.' }, 500)
    }

    const baseUrl =
        context.env.COINCAP_API_BASE_URL?.trim().replace(/\/+$/, '') || DEFAULT_BASE_URL

    const requestUrl = new URL(context.request.url)
    const upstreamUrl = buildSafeUpstreamUrl(requestUrl, baseUrl)

    try {
        const upstreamResponse = await fetch(upstreamUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: 'application/json',
            },
            signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        })

        const body = await upstreamResponse.text()

        const isSuccess = upstreamResponse.ok
        const cacheControl = isSuccess
            ? 'public, max-age=30, s-maxage=30, stale-while-revalidate=15'
            : 'no-store'

        return new Response(body, {
            status: upstreamResponse.status,
            headers: {
                'content-type':
                    upstreamResponse.headers.get('content-type') ??
                    'application/json; charset=utf-8',
                'cache-control': cacheControl,
                'x-content-type-options': 'nosniff',
            },
        })
    } catch {
        return jsonResponse({ error: 'Failed to reach CoinCap upstream API.' }, 502)
    }
}
