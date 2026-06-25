import Providers from "../providers/index.js"
import { format as lyricFormat, get_url } from "../util.js"
import store from "../admin/store.js"
import { isValidQuality } from "../quality.js"

const parseCookieString = (cookieString) => {
    if (!cookieString) return {}
    const cookies = {}
    cookieString.split(';').forEach(item => {
        const [key, value] = item.trim().split('=')
        if (key && value) {
            cookies[key] = value
        }
    })
    return cookies
}

export default async (ctx) => {

    const p = new Providers()

    const query = ctx.req.query()
    const server = query.server || 'netease'
    const type = query.type || 'playlist'
    const id = query.id || '6907557348'
    const quality = query.quality?.toLowerCase()

    if (!p.get_provider_list().includes(server) || !p.get(server).support_type.includes(type)) {
        ctx.status(400)
        return ctx.json({ status: 400, message: 'server 参数不合法', param: { server, type, id } })
    }

    if (!isValidQuality(server, quality)) {
        ctx.status(400)
        return ctx.json({ status: 400, message: 'quality 参数不合法', param: { server, quality } })
    }

    let cookie = ''
    const storedCookie = store.getActiveCookie(server)
    if (storedCookie) {
        cookie = storedCookie.cookie
    }

    let data = await p.get(server).handle(type, id, cookie, { quality })

    if (type === 'url') {
        let url = data

        if (!url) {
            ctx.status(403)
            return ctx.json({ error: 'no url' })
        }
        if (url.startsWith('@'))
            return ctx.text(url)

        return ctx.redirect(url)
    }

    if (type === 'pic') {
        return ctx.redirect(data)
    }

    if (type === 'lrc') {
        return ctx.text(lyricFormat(data.lyric, data.tlyric || ''))
    }


    return ctx.json(data.map(x => {
        for (let i of ['url', 'pic', 'lrc']) {
            const _ = String(x[i])
            if (!_.startsWith('@') && !_.startsWith('http') && _.length > 0) {
                const qualityParam = i === 'url' && quality ? `&quality=${quality}` : ''
                const linkType = i === 'url' && type === 'search_playlist' ? 'playlist' : i
                x[i] = `${get_url(ctx)}?server=${server}&type=${linkType}&id=${_}${qualityParam}`
            }
        }
        return x
    }))
}
