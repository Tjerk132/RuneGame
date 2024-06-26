import type { RuneClient } from "rune-games-sdk"
import type { Cells, GameState, PersistedData } from "./state/game/GameState"
import type { GameActions } from "./state/game/GameActions";
import { characters } from "./state/game/Characters"

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

const colors = ['red', 'blue', 'brown', 'yellow', 'pink', 'purple'];

const setup = (allPlayerIds: string[]) => ({
    characters,
    playerPositions: allPlayerIds.map(playerId => ({
        playerId: playerId,
        position: null
    })),
    cells: new Array(9).fill(null),
    winCombo: null,
    lastMove: {
        playerId: null,
        time: 0
    },
    players: allPlayerIds.map((playerId,index) => ({
        playerId: playerId,
        character: null,
        color: colors[index]
    })),
    playerIds: allPlayerIds,
    moveDuration: 0
}) as GameState;

Rune.initLogic({
    persistPlayerData: true,
    minPlayers: 2,
    maxPlayers: 6,
    // landscape: true,
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
                //give gold to winner
                game.persisted[game.lastMove.playerId!].goldAmount += 10;
                console.log('winner gold 10 to player ', game.persisted[game.lastMove.playerId!]);

                const [player1, player2] = allPlayerIds
                //game over, player with the winning row win
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
        selectCharacter(characterId, { game, playerId, allPlayerIds }) {
            const character = game.characters.find(character => character.id === characterId)

            let player = game.players.find(player => player.playerId === playerId);
            if (player) {
                player.character = character ?? null;
            }
        },
        confirmPosition(location, { game, playerId }) {},
    },
    update({ game, allPlayerIds }) {
        game.moveDuration = (Rune.gameTime() / 1000) - game.lastMove.time;
        // if (game.winCombo) {
        //     //give gold to winner
        //     game.persisted[game.lastMove.playerId!].goldCurrency += 10;
        //     console.log('winner gold 10 to player ', game.persisted[game.lastMove.playerId!]);
        // }
    },
    events: {
        playerJoined(playerId, eventContext) {
            //give gold to player when joined, for persisted data test

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
