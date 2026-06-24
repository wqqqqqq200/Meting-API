import { request } from './util.js'
import { map_song_list } from "./util.js"

export const get_playlist = async (id, cookie = '') => {
    const data = {
        id,
        n: 100000,
        s: 8,
    }
    const limit = 200

    let res = await request('POST', `https://music.163.com/api/v6/playlist/detail`, data, { crypto: 'api', cookie: cookie || {} })

    const trackIds = res.playlist?.trackIds || []
    const songs = []

    for (let offset = 0; offset < trackIds.length; offset += limit) {
        const idsData = {
            c:
                '[' +
                trackIds
                    .slice(offset, offset + limit)
                    .map((item) => '{"id":' + item.id + '}')
                    .join(',') +
                ']',
        }

        res = await request(
            'POST',
            `https://music.163.com/api/v3/song/detail`,
            idsData,
            { crypto: 'weapi', cookie: cookie || {} }
        )

        if (res.songs?.length) {
            songs.push(...res.songs)
        }
    }

    return map_song_list({ songs })
}
