<script lang="ts">
  import type { GameStateWithPersisted } from "rune-games-sdk";
  import type {
    GameState,
    PersistedData,
    Player,
  } from "./state/game/GameState";
  import selectSoundAudio from "./assets/select.wav";
  import { gameScene } from "./scenes/game/gameScene";
  import { playerPosition } from "./store/store";
  import "./App.scss";

  let game = $state<GameStateWithPersisted<GameState, PersistedData>>();
  let mPlayer = $state<Player | undefined>();
  let playerGoldAmount = $state<number>(0);

  //render terrain
  const { render: renderGame } = gameScene();
  window.requestAnimationFrame(() => renderGame());

  const selectSound = new Audio(selectSoundAudio);

  $effect(() => {
    Rune.initClient({
      onChange: ({ game: updatedGame, action, yourPlayerId }) => {
        game = updatedGame;
        mPlayer = game.players.find(
          (player) => player.playerId === yourPlayerId,
        );

        if (mPlayer) {
          playerGoldAmount = game.persisted[mPlayer.playerId]?.goldAmount || 0;
        }

        if (action && action.name === "claimCell") selectSound.play();

        if (action && action.name === "confirmPosition") {
          const player = game.players.find(
            (player) => player.playerId === action.playerId,
          );

          playerPosition.update((p) => ({
            playerId: action.playerId,
            color: player?.color ?? null,
            position: action.params.position,
          }));
        }
      },
    });
  });
</script>

<div id="game">
  {#if game}
    {#if !mPlayer?.character}
      Please select a characters
      <br />
      {#each game.characters as character}
        <button
          onclick={() => {
            Rune.actions.selectCharacter(character.id);
          }}
        >
          {character.name}
        </button>
      {/each}
    {:else}
      selected {mPlayer?.character?.name}
    {/if}
    <br />
    You are {mPlayer?.color}
    <br />
    $ {playerGoldAmount}
    <br />
    {game.moveDuration}
    <!-- <div id="board" class:initial={!game.lastMove.playerId}>
    {#each game.cells as cell, index}
      {@const cellValue = cell}
      <button
        onclick={() => {
          Rune.actions.claimCell(index);
        }}
        data-player={(cellValue !== null
          ? game.playerIds.indexOf(cellValue)
          : -1
        ).toString()}
        data-dim={String(
          (game.winCombo && !game.winCombo.includes(index)) ||
            (!game.freeCells && !game.winCombo),
        )}
        {...game.cells[index] ||
        game.lastMove.playerId === mPlayerId ||
        game.winCombo
          ? { "data-disabled": "" }
          : {}}
      >
      </button>
    {/each}
  </div>
  <ul id="playersSection">
    {#each game.playerIds as playerId, index}
      {@const player = Rune.getPlayerInfo(playerId)}
      <li
        data-player={index.toString()}
        data-your-turn={String(
          game.playerIds[index] !== game.lastMove.playerId &&
            !game.winCombo &&
            game.freeCells,
        )}
      >
        <img src={player?.avatarUrl} alt="player avatar" />
        <span>
          {player.displayName}
          {#if player.playerId === mPlayerId}
            <span>
              <br />
              (You)
            </span>
          {/if}
        </span>
      </li>
    {/each}
  </ul> -->
  {/if}
</div>
