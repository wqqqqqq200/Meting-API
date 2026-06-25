import { get_playlist } from "./playlist.js";
import { get_song_url, get_song_info, get_pic } from "./song.js";
import { get_lyric } from "./lyric.js"
import { get_search_songs } from "./search.js"
import { get_search_playlists } from "./search_playlist.js"

const support_type = ['url', 'pic', 'lrc', 'song', 'playlist', 'search', 'search_playlist']

const handle = async (type, id, cookie = '', options = {}) => {
    let result;
    switch (type) {
        case 'lrc':
            result = await get_lyric(id, cookie)
            break
        case 'pic':
            result = await get_pic(id, cookie)
            break
        case 'url':
            result = await get_song_url(id, cookie, options)
            break
        case 'song':
            result = await get_song_info(id, cookie)
            break
        case 'playlist':
            result = await get_playlist(id, cookie)
            break
        case 'search':
            result = await get_search_songs(id, cookie)
            break
        case 'search_playlist':
            result = await get_search_playlists(id, cookie)
            break
        default:
            return -1;
    }
    return result
}

export default {
    register: (ctx) => {
        ctx.register('tencent', { handle, support_type })
    }
}
