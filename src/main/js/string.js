export default {
    isBlank(s) {
        return !s?.match(/\S/)
    },
    trim(s) {
        return s?.replace(/^\s+|\s+$/g, '')
    },
    escape(s) {
        return s?.replace(/\n/g, '<br/>');
    }
}