import { fetchQQSearch } from "./search_api.js"

export const map_song_list = (songs = []) => {
    return songs.map(song => ({
        title: song.name,
        author: (song.singer || []).reduce((i, v) => ((i ? i + " / " : i) + v.name), ''),
        pic: song.album?.mid
            ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.album.mid}.jpg`
            : '',
        id: song.mid,
        url: song.mid,
        lrc: song.mid,
        songmid: song.mid,
    }))
}

export const get_search_songs = async (id, cookie = '') => {
    const body = await fetchQQSearch(id, 0, cookie)
    return map_song_list(body.song?.list || [])
}
