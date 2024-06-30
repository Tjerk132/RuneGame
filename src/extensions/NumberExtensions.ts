// https://stackoverflow.com/a/72732727
export const randomInt = (seed: number) => {
    var m_as_number = 2 ** 53 - 111
    var m = 2n ** 53n - 111n
    var a = 5667072534355537n
    var s = BigInt(seed) % m
    return () => {
        return Number(s = s * a % m) / m_as_number
    }
}