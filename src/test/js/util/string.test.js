import string from 'util/string'

describe('string', () => {
    it('blank?', () => {
        expect(string.isBlank(null)).toBe(true)
        expect(string.isBlank(undefined)).toBe(true)
        expect(string.isBlank('')).toBe(true)
        expect(string.isBlank(' ')).toBe(true)
        expect(string.isBlank('a')).toBe(false)
    });

    it('trim', () => {
        expect(string.trim('a')).toBe('a')
        expect(string.trim(' a')).toBe('a')
        expect(string.trim('a ')).toBe('a')
        expect(string.trim(' a ')).toBe('a')
        expect(string.trim('a b')).toBe('a b')
        expect(string.trim('a  ')).toBe('a')
        expect(string.trim('  a')).toBe('a')
        expect(string.trim(null)).toBeUndefined()
    });

    it('escape line-break to <br/>', () => {
        expect(string.escape('a')).toBe('a')
        expect(string.escape('\n')).toBe('<br/>')
        expect(string.escape('\n\n')).toBe('<br/><br/>')
        expect(string.escape(null)).toBeUndefined()
    })
});