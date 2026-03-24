# Phaser Platformer

Un jeu de plateforme 2D développé avec **Phaser 3** mettant en scène un chat dans un univers de pirate.

## Aperçu

Le joueur incarne un chat qui doit traverser des niveaux remplis d'ennemis, de pièges et de collectibles pour récupérer un cristal et terminer le jeu.

## Fonctionnalités

- **2 niveaux** : un tutoriel (sélection) et un niveau principal
- **Système de combat** : tir de projectiles avec cooldown
- **Ennemis** avec IA de patrouille et points de vie
- **Collectibles** : bouteilles de rhum (score) et cristal (objectif)
- **Plateformes mobiles** activables via des leviers
- **Système de vie** (100 HP) et **chronomètre** (60 secondes par niveau)
- **Effets sonores** et musique de fond

## Contrôles

| Touche | Action |
|--------|--------|
| ← → | Se déplacer |
| Espace | Sauter |
| E | Tirer |
| O | Activer un levier |

## Scènes du jeu

1. **Accueil** — Écran titre
2. **Sélection** — Niveau tutoriel
3. **Niveau 1** — Niveau principal (récupérer le cristal pour gagner)
4. **Game Over** — Écran de fin avec option de recommencer

## Technologies

- [Phaser 3](https://phaser.io/) (v3.60.0)
- [Parcel](https://parceljs.org/) (bundler)
- Cartes créées avec [Tiled](https://www.mapeditor.org/)

## Installation

```bash
npm install
npm start
```

Le jeu se lance sur `http://localhost:1234`.

## Structure du projet

```
├── index.html          # Point d'entrée HTML
├── index.js            # Configuration Phaser et déclaration des scènes
├── accueil.js          # Scène d'accueil
├── selection.js        # Scène tutoriel
├── niveau1.js          # Scène niveau principal
├── gameover.js         # Scène game over
├── src/
│   ├── map.json        # Carte du tutoriel (Tiled)
│   ├── map2.json       # Carte du niveau 1 (Tiled)
│   └── assets/         # Sprites, tilesets, sons
```

## Crédits

Développé avec Phaser 3 et le moteur physique Arcade.
