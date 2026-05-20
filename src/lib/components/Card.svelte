<script lang="ts">
	import { asset } from '$app/paths';
	import type { PlayingCard } from '$lib/cards';

	let { card, selected, order, onclick } = $props<{
		card: PlayingCard;
		selected: boolean;
		order: number | null;
		onclick: () => void;
	}>();

	const toCleanString = (num: number, decimals: number) =>
		num.toFixed(decimals).replace(/\.?0+$/, '');
</script>

<button class="card" class:selected {onclick}>
	<img class="base" src={asset(card.image)} alt="Card" />
	<img class="highlight" src={asset(card.highlight)} alt="Card" />

	<div class="overlays" class:selected>
		{#if order !== null}
			<span class="order-badge">{order}</span>
		{/if}
		{#if card.isResult}
			<span class="badge">{card.stackCount ?? 2}</span>
			<span class="value">{toCleanString(card.displayValue, 3)}</span>
		{/if}
	</div>
</button>

<style>
	.card {
		position: relative;
		width: 150px;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		outline: none;
	}

	.card img {
		display: block;
		width: 150px;
		height: 206px;
		object-fit: cover;
		transform: scale(1);
		transition:
			opacity 0.15s ease,
			transform 0.25s ease;
	}

	.card img.highlight {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		transform: scale(1.08);
		transition:
			opacity 0.15s ease,
			transform 0.25s ease;
	}

	.card.selected img.highlight {
		opacity: 1;
		transform: scale(1);
	}

	.card.selected img {
		width: 100%;
		height: auto;
		opacity: 0;
		transform: scale(0.8);
	}

	.overlays {
		position: absolute;
		inset: 0;
		transform: scale(1);
		transition: transform 0.25s ease;
	}

	.overlays.selected {
		transform: scale(0.85);
	}

	.value {
		position: absolute;
		bottom: 16px;
		left: 12px;
		right: 12px;
		text-align: center;
		background: #4f5b8faf;
		color: white;
		font-size: 1.2rem;
		font-weight: bold;
		border-radius: 999px;
		padding: 2px 5px;
	}

	.badge {
		position: absolute;
		top: 6px;
		right: 6px;
		background: #e63;
		color: white;
		font-size: 1rem;
		font-weight: bold;
		padding: 2px 5px;
		border-radius: 999px;
		line-height: 1;
	}

	.order-badge {
		position: absolute;
		top: 6px;
		left: 6px;
		background: white;
		color: black;
		font-size: 1rem;
		font-weight: bold;
		border-radius: 999px;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		padding: 2px 5px;
	}
</style>
