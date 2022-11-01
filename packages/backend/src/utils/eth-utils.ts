export const EthUtils = {
    toKey,
}

function toKey(data: string): Uint8Array {
    const elements = data.split(",").map((e) => Number(e))
    return Uint8Array.of(...elements)
}
