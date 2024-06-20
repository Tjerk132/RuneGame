import type { RuneClient } from "rune-games-sdk"
import type { Cells, GameState, PersistedData } from "./state/game/GameState"

declare global {
    const Rune: RuneClient<GameState, GameActions, PersistedData>
}

const findWinningCombo = (cells: Cells) => {
    return (
        [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ].find((combo) =>
            combo.every((i) => cells[i] && cells[i] === cells[combo[0]])
        ) || null
    )
}

const setup = (allPlayerIds: string[]) => ({
    cells: new Array(9).fill(null),
    winCombo: null,
    lastMove: {
        playerId: null,
        time: 0
    },
    playerIds: allPlayerIds,
    moveDuration: 0
});

Rune.initLogic({
    persistPlayerData: true,
    minPlayers: 2,
    maxPlayers: 3,
    setup: setup,
    actions: {
        claimCell: (cellIndex, { game, playerId, allPlayerIds }) => {
            if (
                game.cells[cellIndex] !== null ||
                playerId === game.lastMove.playerId
            ) {
                // Player has made the last move, opponent's turn
                throw Rune.invalidAction()
            }

            game.cells[cellIndex] = playerId
            game.lastMove = {
                playerId: playerId,
                time: Rune.gameTime() / 1000
            };

            game.winCombo = findWinningCombo(game.cells)

            //if a winning row is created by a player
            if (game.winCombo) {
                const [player1, player2] = allPlayerIds
                //game over, player with the winning row
                Rune.gameOver({
                    players: {
                        [player1]: game.lastMove.playerId === player1 ? "WON" : "LOST",
                        [player2]: game.lastMove.playerId === player2 ? "WON" : "LOST",
                    },
                })
            }

            game.freeCells = game.cells.findIndex((cell) => cell === null) !== -1
            //if no free cells, both players have lost
            if (!game.freeCells) {
                Rune.gameOver({
                    players: {
                        [game.playerIds[0]]: "LOST",
                        [game.playerIds[1]]: "LOST",
                    },
                })
            }
        },
    },
    update({ game, allPlayerIds }) {
        game.moveDuration = (Rune.gameTime() / 1000) - game.lastMove.time;
    },
    events: {
        playerJoined(playerId, eventContext) {
            //give gold to player when joined, for persisted data test
            eventContext.game.persisted[playerId].goldCurrency += 10;

            if (eventContext.game.playerIds.length === 2) {
                //Indicate player is spectator
            }
            else
                console.log(['player', playerId, 'joined'].join(' '));
        },
        playerLeft(playerId, eventContext) {
            console.log(['player', playerId, 'left'].join(' '));
        },
    }
})
