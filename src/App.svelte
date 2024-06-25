<script lang="ts">
  import type { GameStateWithPersisted, PlayerId } from "rune-games-sdk";
  import type { GameState, PersistedData } from "./state/game/GameState";
  import selectSoundAudio from "./assets/select.wav";
  import "./App.scss";

  let game = $state<GameStateWithPersisted<GameState, PersistedData>>();
  let mPlayerId = $state<PlayerId | undefined>();
  let playerGoldCurrency = $state<number>(0);
  let playerSelectedCharacter = $state<string | undefined>(undefined);

  const selectSound = new Audio(selectSoundAudio);

  $effect(() => {
    Rune.initClient({
      onChange: ({ game: updatedGame, action, yourPlayerId }) => {
        game = updatedGame;
        mPlayerId = yourPlayerId;

        if (mPlayerId) {
          playerGoldCurrency = game.persisted[mPlayerId]?.goldCurrency || 0;
        }

        if (action && action.name === "claimCell") selectSound.play();

        if (action && action.name === "selectCharacter" && action.playerId === mPlayerId)
          playerSelectedCharacter =
            game.players.find((player) => player.playerId)?.character?.name;
      },
    });
  });
</script>

{#if game}
  {#if !playerSelectedCharacter}
    Please select a characters
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
      selected {playerSelectedCharacter}
  {/if}

  $ {playerGoldCurrency}
  <br />
  {game.moveDuration}
  <div id="board" class:initial={!game.lastMove.playerId}>
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
  </ul>
{/if}
