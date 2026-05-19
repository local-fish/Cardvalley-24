<script lang="ts">
	import { cards, type PlayingCard } from '$lib/cards';
	import { questions, type Question } from '$lib/questions';
	import { operators } from '$lib/operators';
	import { fade } from 'svelte/transition';
	import type { Operator } from '$lib/operators';
	import Card from '$lib/components/Card.svelte';
	import OperatorBar from '$lib/components/OperatorBar.svelte';
	import type { LevelResult, Move } from '$lib/userData';

	let selectedOp: Operator | null = $state(null);
	let selectedCards: number[] = $state([]);
	let currentLevel: number = $state(0);
	const puzzle: Question = $derived(questions[currentLevel]);
	let hand: PlayingCard[] = $derived(
		puzzle.cards.map((cardIndex, i) => ({
			...cards[cardIndex - 1],
			handId: i,
			displayValue: cards[cardIndex - 1].value,
			isResult: false,
			stackCount: 1,
		})),
	);
	let results: LevelResult[] = $state([]);
	// --- Timer ---
	let elapsedMs: number = $state(0);
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	function startTimer() {
		stopTimer();
		elapsedMs = 0;
		timerInterval = setInterval(() => {
			elapsedMs += 1000;
		}, 1000);
	}

	function stopTimer() {
		if (timerInterval !== null) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	function formatTime(ms: number): string {
		return `${Math.floor(ms / 1000)}s`;
	}

	startTimer();

	function selectCard(card: PlayingCard) {
		if (selectedCards.includes(card.handId)) {
			selectedCards = selectedCards.filter((id) => id !== card.handId);
			return;
		}
		if (selectedCards.length >= 2) return;
		selectedCards = [...selectedCards, card.handId];
	}

	function canSubmit() {
		return selectedCards.length === 2 && selectedOp !== null;
	}

	let moveLog: Move[] = $state([]);

	function merge() {
		const op = operators.find((o) => o.symbol === selectedOp?.symbol);
		const [a, b] = selectedCards.map((id) => hand.find((c) => c.handId === id));
		const result = op?.fn(a?.displayValue ?? 0, b?.displayValue ?? 0);
		const count = (a?.stackCount ?? 1) + (b?.stackCount ?? 1);
		moveLog = [
			...moveLog,
			{
				cardA: a?.displayValue ?? 0,
				cardB: b?.displayValue ?? 0,
				op: selectedOp?.symbol ?? '',
				result: result ?? 0,
			},
		];

		hand = hand
			.filter((c) => c.handId !== b?.handId)
			.map((c) =>
				c.handId === a?.handId
					? { ...c, displayValue: result, isResult: true, stackCount: count }
					: c,
			) as PlayingCard[];

		selectedCards = [];
		selectedOp = null;
		if (hand.length === 1) {
			stopTimer();
			results = [
				...results,
				{
					level: currentLevel + 1,
					//moves: moveLog,
					timeMs: elapsedMs,
					correct: Math.abs((result ?? 0) - 24) < 0.0001,
				},
			];
			console.log(JSON.stringify(results, null, 2));
		}
	}

	const won = $derived(hand.length === 1 && Math.abs(hand[0].displayValue - 24) < 0.0001);
	const lost = $derived(hand.length === 1 && Math.abs(hand[0].displayValue - 24) > 0.0001);

	function nextLevel() {
		if (currentLevel < questions.length - 1) {
			currentLevel++;
			resetLevel();
		}
	}

	function resetLevel() {
		hand = questions[currentLevel].cards.map((cardIndex, i) => ({
			...cards[cardIndex - 1],
			handId: i,
			displayValue: cards[cardIndex - 1].value,
			isResult: false,
			stackCount: 1,
		}));
		selectedCards = [];
		selectedOp = null;
		//moveLog = [];
		startTimer();
	}
</script>

<svelte:head>
	{#each Object.values(cards) as card}
		<link rel="preload" as="image" href={card.image} />
		<link rel="preload" as="image" href={card.highlight} />
	{/each}
</svelte:head>

<div class="page">
	<div class="timer">{formatTime(elapsedMs)}</div>
  <div> Make this into 24! </div>

	{#if won}
		<div class="correct" transition:fade={{ duration: 300 }}>
			<span>Correct!</span>
			<button class="next" onclick={nextLevel}>Next →</button>
		</div>
	{/if}
	{#if lost}
		<div class="correct" transition:fade={{ duration: 300 }}>
			<div class="wrong">Wrong Answer</div>
			<button class="next" onclick={nextLevel}>Next →</button>
		</div>
	{/if}

	<div class="hand">
		{#each hand as card (card.handId)}
			<Card
				{card}
				selected={selectedCards.includes(card.handId)}
				order={selectedCards.includes(card.handId) ? selectedCards.indexOf(card.handId) + 1 : null}
				onclick={() => selectCard(card)}
			/>
		{/each}
	</div>

	<OperatorBar
		{selectedOp}
		canSubmit={canSubmit()}
		onSelect={(op) => (selectedOp = op)}
		onSubmit={merge}
		blacklist={puzzle.blacklist}
	/>
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
	.hand {
		display: flex;
		gap: 1rem;
	}

	.page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-image: url('/background.png');
		background-size: cover;
		background-position: center;
	}

	.timer {
		position: fixed;
		top: 1rem;
		right: 1.5rem;
		font-size: 1.4rem;
		font-weight: bold;
		color: white;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
		font-variant-numeric: tabular-nums;
		z-index: 10;
	}

	.correct {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		background: rgba(0, 0, 0, 0.7);
		pointer-events: all;
		z-index: 2;
	}

	.correct span {
		font-size: 3rem;
		font-weight: bold;
		color: white;
		text-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
	}

	.wrong {
		font-size: 3rem;
		font-weight: bold;
		color: #a14b42;
		text-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
	}

	.next {
		background: #6abf5e;
		border: 3px solid #3a8a30;
		color: white;
		font-size: 1.2rem;
		font-weight: bold;
		padding: 10px 28px;
		border-radius: 999px;
		cursor: pointer;
		box-shadow: 0 4px 0 #2a6a20;
		transition: transform 0.1s ease;
	}

	.next:hover {
		transform: translateY(-2px);
	}

	.next:active {
		transform: translateY(2px);
		box-shadow: 0 2px 0 #2a6a20;
	}
</style>
