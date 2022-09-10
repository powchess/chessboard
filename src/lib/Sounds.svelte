<script lang="ts">
	import moveSound from './assets/sounds/move.wav';
	import captureSound from './assets/sounds/capture.wav';
	import castleSound from './assets/sounds/castle.wav';
	import undoSound from './assets/sounds/undo.mp3';
	import type { MoveTypeSound } from './boardConfig';

	export let settings: {
		MOVE: boolean;
		CAPTURE: boolean;
		CASTLE: boolean;
		UNDO: boolean;
	};

	const sounds: {
		MOVE?: HTMLAudioElement;
		CAPTURE?: HTMLAudioElement;
		CASTLE?: HTMLAudioElement;
		UNDO?: HTMLAudioElement;
	} = {
		MOVE: undefined,
		CAPTURE: undefined,
		CASTLE: undefined,
		UNDO: undefined
	};

	const resetSounds = (): void => {
		if (sounds.CASTLE) {
			sounds.CASTLE.pause();
			sounds.CASTLE.currentTime = 0;
		}
		if (sounds.MOVE) {
			sounds.MOVE.pause();
			sounds.MOVE.currentTime = 0;
		}
		if (sounds.CAPTURE) {
			sounds.CAPTURE.pause();
			sounds.CAPTURE.currentTime = 0;
		}
		if (sounds.UNDO) {
			sounds.UNDO.pause();
			sounds.UNDO.currentTime = 0;
		}
	};

	const allowPlaySound = (sound?: MoveTypeSound) => sound === undefined || settings[sound];

	export function playMoveSound(moveType: MoveTypeSound) {
		resetSounds();
		switch (moveType) {
			case 'MOVE':
				if (sounds.MOVE && allowPlaySound('MOVE')) sounds.MOVE.play();
				break;
			case 'CAPTURE':
				if (sounds.CAPTURE && allowPlaySound('CAPTURE')) sounds.CAPTURE.play();
				else if (sounds.MOVE && allowPlaySound('MOVE')) sounds.MOVE.play();
				break;
			case 'CASTLE':
				if (sounds.CASTLE && allowPlaySound('CASTLE')) sounds.CASTLE.play();
				else if (sounds.MOVE && allowPlaySound('MOVE')) sounds.MOVE.play();
				break;
			case 'UNDO':
				if (sounds.UNDO && allowPlaySound('UNDO')) {
					sounds.UNDO.volume = 0.3;
					sounds.UNDO.play();
				} else if (sounds.MOVE && allowPlaySound('MOVE')) sounds.MOVE.play();
				break;
			default:
				break;
		}
	}
</script>

{#if settings.MOVE}
	<audio bind:this={sounds.MOVE} preload="auto">
		<track kind="captions" />
		<source src={moveSound} />
	</audio>
{/if}
{#if settings.CAPTURE}
	<audio bind:this={sounds.CAPTURE} preload="auto">
		<track kind="captions" />
		<source src={captureSound} />
	</audio>
{/if}
{#if settings.CASTLE}
	<audio bind:this={sounds.CASTLE} preload="auto">
		<track kind="captions" />
		<source src={castleSound} />
	</audio>
{/if}
{#if settings.UNDO}
	<audio bind:this={sounds.UNDO} preload="auto">
		<track kind="captions" />
		<source src={undoSound} />
	</audio>
{/if}
