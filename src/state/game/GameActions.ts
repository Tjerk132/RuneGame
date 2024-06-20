//find way to use actiontype
type ActionType = "claimCell" | "action2"

type GameActions = {
    claimCell: (cellIndex: number) => void
}