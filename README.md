# Virtuous

Virtuous is a custom-built 2D tile-based game engine focused on deterministic simulation, AI behaviors, and data-driven rendering.
It was implemented from scratch using React, TypeScript, Tailwind, and Vite.

While Virtuous currently presents as a small roguelike-style game, the core goal is to explore engine architecture, simulation, and extensible systems design, rather than content-heavy gameplay.

Inspiration for style and theme were drawn primarily from classic games like Gauntlet (a favorite from my early childhood) and The Legend of Zelda (NES).  
I am a big fan of emergent gameplay (some great examples being Minecraft, Metal Gear Solid V, and Baldur's Gate 3) and always appreciate when game developers go the extra mile to give the world life. As Virtuous continues to develop, I aim to add more and more systems and rules that allow the player to draw out emergent moments.

## High-Level Idea

This project is an experiment in building a lightweight, deterministic game engine suitable for

- Grid-based games
- AI behavior experimentation
- Camera and rendering systems
- Separation of simulation and rendering

The engine runs a fixed-timestep simulation and renders independently, enabling consistent AI behavior and predictable world updates.

## World

The player is placed in a world that is full of sin - pride, greed, lust, etc. There are also neutral characters that the player may interact with. It is up to the player to decide whether they will rid the world of evil, or if they will become more corrupt than the world itself.  
The world is 2D, top down, similar to older Zelda games. Each of the enemy types will have specific attributes that correlate to the deadly sin that they represent. Depending on the player’s actions, they will either become more virtuous or more sinful.

## Current State

Virtuous is currently in an MVP state. While the full vision has not yet been realized, there is/are:

- a fully playable loop
- stable simulation
- multiple AI behaviors interacting correctly
- quality-of-life features, such as save/load and zooming.

## Ideas for Next Sprint

### Engine / Systems

- Zones; zone different parts of the world to be the preferred place for different entities
- Doors and chests; unlockable doors and chests that the player can open using keys

### AI

- More enemy types that correspond more to the core design of Virtuous
- More neutral types for more interesting interactions between NPCs

### Rendering

- Tile-based environmental animations (e.g. torches / water)
- More world sections that are stitched together smoothly

## Sources

- Assets: DawnLike - DawnBringer / DragonDePlatino
- Fonts: Google Fonts / CodeMan38
- Config for GitHub Actions: Medium / Mike Tickle

## Screenshots

### Gameplay
<img width="2496" height="1321" alt="debug-mode" src="https://github.com/user-attachments/assets/3f72a032-f51b-4ffd-b14c-a7e2f8c0f3d6" />

### Debug Render Mode

<img width="2496" height="1321" alt="gameplay" src="https://github.com/user-attachments/assets/ab94cc70-2403-40e9-9119-a3c00886bc4d" />

