export default {
    isBlank(s) {
        return !s || !/\S/.test(s)
    },
    trim(s) {
        return s && s.replace(/^\s+|\s+$/g, '')
    }
}