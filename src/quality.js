export const VALID_QUALITY = {
    tencent: ['128', 'standard', '320', 'exhigh', 'flac', 'lossless'],
    netease: ['128', 'standard', 'higher', '320', 'exhigh', 'flac', 'lossless', 'hires'],
}

export const isValidQuality = (server, quality) => {
    if (!quality) return true
    return VALID_QUALITY[server]?.includes(quality.toLowerCase()) ?? false
}
