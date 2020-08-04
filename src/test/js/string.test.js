import string from 'string'

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
        expect(string.trim(null)).toBeNull()
    });
});