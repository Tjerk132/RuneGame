import { writable } from 'svelte/store';
import type { PlayerPosition } from '../state/game/GameState';

export const playerPosition = writable<PlayerPosition | null>(null);