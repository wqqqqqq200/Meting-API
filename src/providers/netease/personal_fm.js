/**
 * 网易云私人漫游（私人 FM）
 *
 * id 参数即漫游模式，对应客户端「私人漫游」里的模式切换：
 *
 * | id 值 | 含义 |
 * |-------|------|
 * | 留空 / DEFAULT | 默认漫游：综合听歌记录做常规个性化推荐 |
 * | FAMILIAR | 熟悉模式：多推收藏、常听、关注过的歌手与相似曲风 |
 * | EXPLORE | 探索模式：多推较少听过的新歌、冷门歌，拓展曲库 |
 * | SCENE_RCMD | 场景漫游：按生活场景推荐，需配合子模式（见下） |
 * | aidj | AI DJ：AI 串烧混剪，歌曲之间带过渡衔接 |
 *
 * SCENE_RCMD 子模式（id 格式 SCENE_RCMD:子模式）：
 * | 子模式 | 含义 |
 * |--------|------|
 * | EXERCISE | 运动：节奏明快、适合锻炼 |
 * | FOCUS | 专注：适合工作、学习，偏轻音乐/纯音乐 |
 * | NIGHT_EMO | 深夜：适合夜晚、情绪向的慢歌 |
 */
import { request, map_song_list } from './util.js'

const MODES = new Set(['DEFAULT', 'FAMILIAR', 'EXPLORE', 'SCENE_RCMD', 'aidj'])
const SUB_MODES = new Set(['EXERCISE', 'FOCUS', 'NIGHT_EMO'])

const parseMode = (id) => {
    if (!id) return null

    const upper = id.toUpperCase()
    if (upper === 'AIDJ') return { mode: 'aidj' }
    if (MODES.has(upper)) return { mode: upper }

    if (id.includes(':')) {
        const [modePart, subModePart] = id.split(':')
        const mode = modePart.toUpperCase() === 'AIDJ' ? 'aidj' : modePart.toUpperCase()
        if (!MODES.has(mode)) return null
        const subMode = subModePart?.toUpperCase()
        return {
            mode,
            ...(subMode && SUB_MODES.has(subMode) ? { subMode } : {}),
        }
    }

    return null
}

export const get_personal_fm = async (id = '', cookie = '') => {
    const modeConfig = parseMode(id)
    const data = modeConfig
        ? { ...modeConfig, limit: 3 }
        : {}

    const res = await request(
        'POST',
        'https://music.163.com/weapi/v1/radio/get',
        data,
        { crypto: 'weapi', cookie: cookie || {} },
    )

    if (!res.data?.length) {
        throw res
    }

    return map_song_list({ songs: res.data })
}
