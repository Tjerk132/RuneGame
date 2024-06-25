import type { Character } from "./GameState";

export const characters = [
    {
        id: 1,
        name: 'fred',
        health: 100,
        abilities: [
            {
                type: "assist",
                damageDelta: 20
            },
            {
                type: "hinder",
                damageDelta: -12
            }
        ]
    },
    {
        id: 2,
        name: 'kees',
        health: 120,
        abilities: [
            {
                type: "assist",
                damageDelta: 10
            },
            {
                type: "hinder",
                damageDelta: -18
            }
        ]
    }
] as Character[];