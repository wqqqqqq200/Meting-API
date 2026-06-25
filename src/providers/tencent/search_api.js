import { changeUrlQuery } from "./util.js"

export const parseCookieString = (cookieString) => {
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

export const fetchQQSearch = async (query, searchType, cookie = '') => {
    const cookieObj = parseCookieString(cookie)
    const uin = cookieObj.uin || '0'
    const qqmusic_key = cookieObj.qqmusic_key || ''

    const data = {
        req: {
            method: 'DoSearchForQQMusicDesktop',
            module: 'music.search.SearchCgiService',
            param: {
                query,
                page_num: 1,
                num_per_page: 30,
                search_type: searchType,
            },
        },
        comm: {
            uin,
            format: 'json',
            ct: 24,
            cv: 0,
            authst: qqmusic_key,
        },
    }

    const url = changeUrlQuery({ data: JSON.stringify(data) }, 'https://u.y.qq.com/cgi-bin/musicu.fcg')
    const result = await fetch(url, {
        headers: { Referer: 'https://y.qq.com/' },
    })
    const json = await result.json()

    return json?.req?.data?.body || {}
}
