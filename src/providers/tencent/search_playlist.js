import { fetchQQSearch } from "./search_api.js"

export const map_playlist_list = (playlists = []) => {
    return playlists.map(playlist => ({
        title: playlist.dissname,
        author: playlist.creator?.name || '',
        pic: (playlist.imgurl || '').replace('http://', 'https://'),
        id: String(playlist.dissid),
        url: String(playlist.dissid),
        trackCount: playlist.song_count || 0,
    }))
}

export const get_search_playlists = async (id, cookie = '') => {
    const body = await fetchQQSearch(id, 3, cookie)
    return map_playlist_list(body.songlist?.list || [])
}
