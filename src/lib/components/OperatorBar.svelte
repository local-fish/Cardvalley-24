<script lang="ts">
	import { operators } from '$lib/operators';
	import type { Operator } from '$lib/operators';

	let { selectedOp, canSubmit, onSelect, onSubmit, onSkip, blacklist } = $props<{
		selectedOp: Operator | null;
		canSubmit: boolean;
		onSelect: (op: Operator) => void;
		onSubmit: () => void;
    onSkip: () => void;
		blacklist?: string;
	}>();
</script>

<div class="operators">
	{#each operators as op}
		<button
			class:active={selectedOp?.symbol === op.symbol && !blacklist?.includes(op.symbol)}
			disabled={blacklist?.includes(op.symbol) ?? false}
			onclick={() => onSelect(op)}
		>
			{op.symbol}
		</button>
	{/each}
	<button class="submit" onclick={onSubmit} disabled={!canSubmit}> Submit </button>
	<button class="skip" onclick={onSkip}> Skip </button>
</div>

<style>
	.operators {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin-top: 1rem;
		background: rgba(255, 245, 220, 0.85);
		padding: 8px 12px;
		border-radius: 999px;
		box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);
	}

	.operators button {
		width: 42px;
		height: 42px;
		border-radius: 999px;
		border: 3px solid #c8873a;
		background: #f5c97a;
		color: #7a3d00;
		font-size: 1.2rem;
		font-weight: bold;
		cursor: pointer;
		transition:
			transform 0.1s ease,
			background 0.1s ease;
		box-shadow: 0 3px 0 #a8651a;
		line-height: 1;
	}

	.operators button:hover:not(.submit, .skip) {
		background: #fad88a;
		transform: translateY(-2px);
	}

	.operators button:active {
		transform: translateY(2px);
		box-shadow: 0 1px 0 #a8651a;
	}

	.operators button.active {
		background: #e8622a;
		border-color: #a03a0a;
		color: white;
		box-shadow: 0 3px 0 #7a2a00;
	}

	.operators button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		transform: none;
	}

	.operators .submit {
		background: #6abf5e;
		border-color: #3a8a30;
		color: white;
		box-shadow: 0 3px 0 #2a6a20;
		width: auto;
		padding: 0 16px;
	}

	.operators .submit:hover:not(:disabled) {
		background: #7acf6e;
		transform: translateY(-2px);
	}

	.operators .skip {
		background: #b43c28;
		border-color: #91392a;
		color: white;
		box-shadow: 0 3px 0 #91392a;
		width: auto;
		padding: 0 16px;
	}

	.operators .skip:hover:not(:disabled) {
		background: #d1503b;
		transform: translateY(-2px);
	}
</style>
