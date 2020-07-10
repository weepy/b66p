export function uuid(n) {
    const s=[]
    const chars = "abcdefghijlkmnopqstruvwxyz"
    for(let i=0; i<n;i++) {
        const ch = chars[(Math.random()*chars.length)|0]
        s.push(ch)
    }
    return s.join("")
}