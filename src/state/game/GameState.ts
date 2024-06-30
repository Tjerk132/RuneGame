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

export type Player = {
    playerId: PlayerId
    character: Character | null
    color: string
}

export type PersistedData = {
    goldAmount: number
}

export type PlayerPosition = {
    playerId: PlayerId | null;
    position: Position | null;
    color: string | null
}

export type Position = {
    [key: string]: number
}

export interface GameState {
    characters: Character[]
    playerPositions: PlayerPosition[];
    cells: Cells
    winCombo: number[] | null
    lastMove: GameMove
    players: Player[]
    playerIds: PlayerId[]
    freeCells?: boolean
    moveDuration: number
}
