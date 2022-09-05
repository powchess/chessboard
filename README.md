![example workflow](https://github.com/powchess/chessboard/actions/workflows/main.yml/badge.svg)
![npm](https://img.shields.io/npm/dt/@powchess/chessboard)
![NPM](https://img.shields.io/npm/l/@powchess/chessboard)
[![npm](https://img.shields.io/npm/v/@powchess/chessboard)](https://www.npmjs.com/package/@powchess/chessboard)

# Svelte Chessboard

This is the Chessboard UI Package which is used on [PowChess](https://powchess.com).

## Installation

```sh
npm install --save-dev @powchess/chessboard
```

### Usage

```html
<script lang="ts">
	import Chessboard, { type ChessboardConfig } from '@powchess/chessboard';
	const config: ChessboardConfig = {};
</script>

<Chessboard {config} />
```
