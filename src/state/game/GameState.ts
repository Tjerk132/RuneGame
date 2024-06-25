import type { PlayerId } from "rune-games-sdk/multiplayer"

export type Cells = (PlayerId | null)[]

export type Character = {
    id: number
    name: string
    health: number
    abilities: Ability[]
}

export type Ability = {
    type: 'assist' | 'hinder'
    damageDelta: number //based on power, effectiveness, etc..
}

export type GameMove = {
    playerId: PlayerId | null
    time: number
}

export type PersistedData = {
    goldCurrency: number
}

export interface GameState {
    characters: Character[]
    cells: Cells
    winCombo: number[] | null
    lastMove: GameMove
    players: { playerId: PlayerId, character: Character | null }[]
    playerIds: PlayerId[]
    freeCells?: boolean
    moveDuration: number
}
