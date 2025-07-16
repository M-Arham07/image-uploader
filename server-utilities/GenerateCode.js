export default function GenerateCode() {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    const code = letters[Math.floor(Math.random() * letters.length)] + Math.floor(Math.random() * 10).toString() + letters[Math.floor(Math.random() * letters.length)] + Math.floor(Math.random() * 10)
    return code;
}