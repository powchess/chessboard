<script lang="ts">
	import moveSound from './assets/sounds/move.wav';
	import captureSound from './assets/sounds/capture.wav';
	import castleSound from './assets/sounds/castle.wav';
	import undoSound from './assets/sounds/undo.mp3';
	import { MoveTypeSound } from './types/chessboard';

	export let settings: {
		move: boolean;
		capture: boolean;
		castle: boolean;
		undo: boolean;
	};

	const sounds: {
		move?: HTMLAudioElement;
		capture?: HTMLAudioElement;
		castle?: HTMLAudioElement;
		undo?: HTMLAudioElement;
	} = {
		move: undefined,
		capture: undefined,
		castle: undefined,
		undo: undefined
	};

	const resetSounds = (): void => {
		if (sounds.castle) {
			sounds.castle.pause();
			sounds.castle.currentTime = 0;
		}
		if (sounds.move) {
			sounds.move.pause();
			sounds.move.currentTime = 0;
		}
		if (sounds.capture) {
			sounds.capture.pause();
			sounds.capture.currentTime = 0;
		}
		if (sounds.undo) {
			sounds.undo.pause();
			sounds.undo.currentTime = 0;
		}
	};

	const allowPlaySound = (sound?: 'castle' | 'move' | 'undo' | 'capture') =>
		sound === undefined || settings[sound];

	export function playMoveSound(moveType: MoveTypeSound) {
		resetSounds();
		switch (moveType) {
			case MoveTypeSound.MOVE:
				if (sounds.move && allowPlaySound('move')) sounds.move.play();
				break;
			case MoveTypeSound.CAPTURE:
				if (sounds.capture && allowPlaySound('capture')) sounds.capture.play();
				break;
			case MoveTypeSound.CASTLING:
				if (sounds.castle && allowPlaySound('castle')) sounds.castle.play();
				break;
			case MoveTypeSound.UNDO:
				if (sounds.undo && allowPlaySound('undo')) {
					sounds.undo.volume = 0.3;
					sounds.undo.play();
				}
				break;
			default:
				break;
		}
	}
</script>

{#if settings.move}
	<audio bind:this={sounds.move} preload="auto">
		<track kind="captions" />
		<source src={moveSound} />
	</audio>
{/if}
{#if settings.capture}
	<audio bind:this={sounds.capture} preload="auto">
		<track kind="captions" />
		<source src={captureSound} />
	</audio>
{/if}
{#if settings.castle}
	<audio bind:this={sounds.castle} preload="auto">
		<track kind="captions" />
		<source src={castleSound} />
	</audio>
{/if}
{#if settings.undo}
	<audio bind:this={sounds.undo} preload="auto">
		<track kind="captions" />
		<source src={undoSound} />
	</audio>
{/if}
