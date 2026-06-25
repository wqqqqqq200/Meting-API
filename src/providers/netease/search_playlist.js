import { request } from "./util.js"

export const map_playlist_list = (playlists = []) => {
    return playlists.map(playlist => ({
        title: playlist.name,
        author: playlist.creator?.nickname || '',
        pic: playlist.coverImgUrl || '',
        id: String(playlist.id),
        url: String(playlist.id),
        trackCount: playlist.trackCount || 0,
    }))
}

export const get_search_playlists = async (id, cookie = '') => {
    const data = {
        s: id,
        type: 1000,
        limit: 30,
        offset: 0,
        total: true,
    }

    const res = await request('POST', `https://interface.music.163.com/eapi/cloudsearch`, data, {
        crypto: 'eapi',
        cookie: cookie || {},
        url: '/api/cloudsearch/pc'
    })

    return map_playlist_list(res.result?.playlists || [])
}
