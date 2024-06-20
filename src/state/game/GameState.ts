import type { PlayerId } from "rune-games-sdk/multiplayer"

export type Cells = (PlayerId | null)[]

export type GameMove = {
    playerId: PlayerId | null
    time: number
}

export type PersistedData = {
    goldCurrency: number
}

export interface GameState {
    cells: Cells
    winCombo: number[] | null
    lastMove: GameMove
    playerIds: PlayerId[]
    freeCells?: boolean
    moveDuration: number
}
