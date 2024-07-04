import { writable } from 'svelte/store';
import type { PlayerPosition } from '../state/game/GameState';
import type { SceneMutation } from '../scenes/game/useGameRenderScene';

export const playerPosition = writable<PlayerPosition | null>(null);

export const sceneMutation = writable<SceneMutation | null>(null);