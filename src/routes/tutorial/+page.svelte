<script lang="ts">
	import { cards, type PlayingCard } from '$lib/cards';
	import { questions, type Question } from '$lib/questions';
	import { operators } from '$lib/operators';
	import { fade } from 'svelte/transition';
	import type { Operator } from '$lib/operators';
	import Card from '$lib/components/Card.svelte';
	import OperatorBar from '$lib/components/OperatorBar.svelte';
	import { type LevelResult, type Move } from '$lib/userData';
	import { goto } from '$app/navigation';
	import { asset, resolve } from '$app/paths';
	import { tutorial } from '$lib/tutorial';

	let selectedOp: Operator | null = $state(null);
	let selectedCards: number[] = $state([]);
	let currentLevel: number = $state(0);
  let hearts: number = $state(3);
	const puzzle: Question = $derived(tutorial[currentLevel]);
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

	function selectCard(card: PlayingCard) {
		if (selectedCards.includes(card.handId)) {
			selectedCards = selectedCards.filter((id) => id !== card.handId);
			return;
		}
    if(step == 1) return;
    if(selectedCards.length == 0 && step == 0) updateStep(1);
    if(selectedCards.length == 1 && step == 2) updateStep(3);
		if (selectedCards.length >= 2) return;
		selectedCards = [...selectedCards, card.handId];
	}

	function canSubmit() {
		return selectedCards.length === 2 && selectedOp !== null;
	}

	let moveLog: Move[] = $state([]);

	async function merge() {
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
    if(step == 3) updateStep(4);
		if (hand.length === 1) {
      const correct = Math.abs((result ?? 0) - 24) < 0.0001;
      if(correct) correctCount++;
      else incorrect++;
      if (!correct){
        hearts = Math.max(0, hearts - 1);
        if (hearts === 0) {
          endGame();
          return;
        }
      }
		}
	}

	const won = $derived(hand.length === 1 && Math.abs(hand[0].displayValue - 24) < 0.0001);
	const lost = $derived(hand.length === 1 && Math.abs(hand[0].displayValue - 24) > 0.0001);
  let giveUpPending: boolean = $state(false);
  let skipPending: boolean = $state(false);
  let givenUp = $state(false);
  let gameOver: boolean = $state(false);
  let totalTime: number = $state(0);
  let correctCount: number = $state(0);
  let incorrect: number = $state(0);

	function nextLevel() {
    if (won) hearts = 999;
		if (currentLevel < tutorial.length - 1) {
			currentLevel++;
			resetLevel();
		} else {
      endGame();
    }
	}

	function resetLevel() {
    givenUp = false;
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
	}

  async function giveUp() {
    incorrect++;
    endGame();
    return;
  }

  function startSkip(){
    skipPending = true;
  }
  function stopSkip(){
    skipPending = false;
  }
  async function skip() {
    skipPending = false;
    givenUp = true;
    incorrect++;
    hearts = Math.max(0, hearts - 1);
    if (hearts === 0) {
      endGame();
      return;
    }

    selectedCards = [];
    selectedOp = null;
  }

 function endGame() {
    gameOver = true;
  }
  let stepText = $state("Klik kartu pertamamu");
  let step = $state(0);
  function updateStep(newStep: number){
    if(step != 4) step = newStep;
    switch(step){
      case 0:
        stepText = "Klik kartu pertamamu";
        break;
      case 1:
        stepText = "Klik operasional +";
        break;
      case 2:
        stepText = "Klik kartu keduamu";
        break;
      case 3:
        stepText = "Klik submit";
        break;
      case 4:
        stepText = "Nomor abu abu pada kartu akan menunjukkan hasil penjumblahan tadi";
        break;
    }
  }

</script>

<svelte:head>
	{#each Object.values(cards) as card}
		<link rel="preload" as="image" href={card.image} />
		<link rel="preload" as="image" href={card.highlight} />
	{/each}
</svelte:head>

<div class="page">
  <!--
  <div class="hearts">
    {#each Array(5) as _, i}
      <img
        src={asset('/heart.png')}
        alt="heart"
        class="heart"
        class:lost={i >= hearts}
      />
    {/each}
  </div>
  -->
  <div class="heading"> Angka Targetmu adalah 24 </div>
  <div class="heading"> {stepText} </div>

  {#if won && !gameOver}
    <div class="correct" transition:fade={{ duration: 300 }}>
      <span>Bagus Sekali!</span>
      {#if puzzle.afterMessage}
        <div class="panel">
          <p class="after-message">{puzzle.afterMessageHeading}</p>
          <p>{puzzle.afterMessage}</p>
        </div>
      {/if}
      <button class="next" onclick={nextLevel}>Next →</button>
    </div>
  {/if}
  {#if lost && !gameOver}
    <div class="correct" transition:fade={{ duration: 300 }}>
      <div class="wrong">Coba Lagi!</div>
      {#if puzzle.afterMessage}
        <div class="panel">
          <p class="after-message">{puzzle.afterMessageHeading}</p>
          <p>{puzzle.afterMessage}</p>
        </div>
      {/if}
      <button class="next" onclick={nextLevel}>Next →</button>
    </div>
  {/if}
  {#if skipPending && !gameOver}
    <div class="correct" transition:fade={{ duration: 300 }}>
      <span>Apakah anda yakin?</span>
      <span>Kamu akan kehilangan 1 nyawa</span>
      <div>
        <button disabled class="confirm-yes" style="opacity: 0.6" onclick={skip}>Iya</button>
        <button class="next" onclick={stopSkip}>Tidak</button>
      </div>
    </div>
  {/if}

  {#if givenUp}
    <div class="correct" transition:fade={{ duration: 300 }}>
      <span>Jangan Menyerah!</span>
      {#if puzzle.afterMessage}
        <div class="panel">
          <p class="after-message">{puzzle.afterMessageHeading}</p>
          <p>{puzzle.afterMessage}</p>
        </div>
      {/if}
      <button class="next" onclick={nextLevel}>Next →</button>
    </div>
  {/if}
  {#if gameOver}
    <div class="correct" transition:fade={{ duration: 300 }}>
      <span>Start Game!</span>
      <button class="next" onclick={() => goto(resolve('/game'))}>Start Game</button>
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
		onSelect={(op) => {selectedOp = op; if(step == 1) updateStep(2)}}
		onSubmit={merge}
    onSkip={startSkip}
		blacklist={puzzle.blacklist?.concat(step < 1 ? '+' : '')}
	/>
  {#if giveUpPending}
  <div class="give-up-confirm">
    <span>Apakah anda yakin?</span>
    <button class="give-up-yes" onclick={() => { giveUpPending = false; giveUp(); }}>Yes</button>
    <button class="give-up-no" onclick={() => giveUpPending = false}>No</button>
    </div>
  {:else}
    <button disabled style="opacity: 0.6" class="give-up" onclick={() => giveUpPending = true}>Give Up</button>
  {/if}
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
  .panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 245, 220, 0.92);
    padding: 2rem 2.5rem;
    border-radius: 20px;
    max-width: 480px;
    box-shadow: 0 8px 0 rgba(0,0,0,0.15);
    text-align: center;
  }
  .heading {
    margin-bottom: 50px;
		font-size: 1.4rem;
		font-weight: bold;
		color: white;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
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
    max-width: 40rem;
    text-align: center;
		font-size: 2rem;
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

  /*
  .hearts {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  .heart {
    width: 36px;
    height: 36px;
    object-fit: contain;
    transition: opacity 0.2s ease, filter 0.2s ease;
  }

  .heart.lost {
    opacity: 0.25;
    filter: grayscale(1);
  }
  */

  .give-up {
    margin-top: 0.5rem;
    background: #b43c2840;
    border: 2px solid #b43c2880;
    color: #ffc8be;
    font-size: 0.85rem;
    font-weight: bold;
    padding: 6px 18px;
    border-radius: 999px;
    cursor: pointer;
    transition: transform 0.1s ease, background 0.1s ease;
    box-shadow: 0 3px 0 #64140a4d;
  }
  .give-up-confirm {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-weight: bold;
    color: #ffffff;
    font-size: 0.85rem;
  }
  .give-up-yes {
    background: #b43c2880;
    border: 2px solid #b43c28cc;
    color: #ffffff;
    font-size: 0.8rem;
    font-weight: bold;
    padding: 4px 12px;
    border-radius: 999px;
    cursor: pointer;
    transition: transform 0.1s ease, background 0.1s ease;
    box-shadow: 0 3px 0 #64140a66;
  }
  .give-up-yes:hover {
    background: #b43c28cc;
    transform: translateY(-2px);
  }
  .give-up-yes:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #64140a66;
  }
  .give-up-no {
    background: #ffffff26;
    border: 2px solid #ffffff4d;
    color: #ffffff;
    font-size: 0.8rem;
    font-weight: bold;
    padding: 4px 12px;
    border-radius: 999px;
    cursor: pointer;
    transition: transform 0.1s ease, background 0.1s ease;
    box-shadow: 0 3px 0 #00000033;
  }
  .give-up-no:hover {
    background: #ffffff4d;
    transform: translateY(-2px);
  }
  .give-up-no:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #00000033;
  }  
  .after-message {
    color: #7a3d00;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.5;
    padding: 10px 16px;
    border-radius: 12px;
    margin: 0;
  }
  .panel p {
    color: #5a3000;
    line-height: 1.6;
    margin: 0;
    white-space: pre-line;
  }
  .confirm-yes {
		border-radius: 999px;
		border: 3px solid;
		font-size: 1.2rem;
		font-weight: bold;
		cursor: pointer;
		transition:
			transform 0.1s ease,
			background 0.1s ease;
		box-shadow: 0 3px 0 #a8651a;
		line-height: 1;
		background: #b43c28;
		border-color: #91392a;
		color: white;
		box-shadow: 0 3px 0 #91392a;
		padding: 10px 28px;
    margin-right: 24px;
	}

  .confirm-yes:hover:not(:disabled) {
		background: #d1503b;
		transform: translateY(-2px);
	}
</style>
