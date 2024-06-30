import type { PlayerPosition } from "./GameState"

//find way to use actiontype
type ActionType = "claimCell" | "action2"

export type GameActions = {
    claimCell: (cellIndex: number) => void
    selectCharacter: (characterId: number) => void
    confirmPosition: (position: PlayerPosition) => void
}