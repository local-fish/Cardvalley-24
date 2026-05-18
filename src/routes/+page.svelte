<script lang="ts">
import { cards, type PlayingCard } from '$lib/cards.js';
import { easy } from '$lib/questions.js';

import { operators } from '$lib/operators.js';
import type { Operator } from '$lib/operators.js';

let selectedOp: Operator | null = $state(null);
let selectedCards: number[] = $state([]); // max 2 handIds
const puzzle = easy[0]; // later this can be dynamic
let hand: PlayingCard[] = $state(puzzle.cards.map((cardIndex, i) => ({
  ...cards[cardIndex - 1],
  handId: i, 
  displayValue: cards[cardIndex - 1].value, // can diverge from base value
  isResult: false, // true if this card is a merged result
  stackCount: 1,
})));

function selectCard(card: PlayingCard) {
  if (!selectedOp) return; // must pick op first
  if (selectedCards.includes(card.handId)) {
    // deselect
    selectedCards = selectedCards.filter(id => id !== card.handId);
    return;
  }
  if (selectedCards.length >= 2) return;
  selectedCards = [...selectedCards, card.handId];

  if (selectedCards.length === 2) merge();
}

function merge() {
  const op = operators.find(o => o.symbol === selectedOp?.symbol);
  const [a, b] = selectedCards.map(id => hand.find(c => c.handId === id));
  const result = op?.fn(a?.displayValue ?? 0, b?.displayValue ?? 0);
  const count = (a?.stackCount ?? 1) + (b?.stackCount ?? 1);

  hand = hand
    .filter(c => c.handId !== b?.handId)
    .map(c => c.handId === a?.handId
      ? { ...c, displayValue: result, isResult: true, stackCount: count}
      : c
    ) as PlayingCard[];

  selectedCards = [];
  selectedOp = null;
}
</script>

<div class="hand">
  {#each hand as card (card.handId)}
    <button class="card" class:selected={selectedCards.includes(card.handId)} onclick={() => selectCard(card)}>
      <img class="base" src={card.image} alt="Card" />
      <img class="highlight" src={card.highlight} alt="Card" />
      {#if card.isResult}
        <span class="badge">{card.stackCount ?? 2}</span>
        <span class="value">{card.displayValue}</span>
      {/if}
    </button>
  {/each}
</div>
<div class="operators">
  {#each operators as op}
    <button
      class:active={selectedOp?.symbol == op.symbol}
      onclick={() => selectedOp = op}
    >
      {op.symbol}
    </button>
  {/each}
</div>

<div>
  <div> debug info </div>
  <div> {selectedOp?.symbol} </div>
</div>
<p>Target: 24</p>

<style>
.card {
  position: relative;
  width: 100px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;   
  outline: none;
}

.value {
  position: absolute;
  bottom: 16px;
  left: 12px; right: 12px;
  text-align: center;
  background: rgba(128,77,233,0.5);
  color: white;
  font-size: 1.2rem;
  border-radius: 999px;
  padding: 2px 0;
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #e63;
  color: white;
  font-size: 0.65rem;
  font-weight: bold;
  padding: 2px 5px;
  border-radius: 999px;
  line-height: 1;
}
.hand {
  display: flex;
  gap: 1rem;
}

.card {
  width: 100px;
  cursor: pointer;
}

.card.selected img {
  width: 100%;
  height: auto;
  opacity: 0;
  transform: scale(0.8); /* shrinks into place */
}
button.active {
  background: yellow;
}

.card img {
  display: block;
  width: 100px;
  height: 137px; /* or whatever your base card height is */
  object-fit: cover;
  transform: scale(1); /* shrinks into place */
  transition: opacity 0.15s ease, transform 0.25s ease;
}

.card img.highlight {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: scale(1.08); /* highlight is naturally bigger */
  transition: opacity 0.15s ease, transform 0.25s ease;
}

.card.selected img.highlight {
  opacity: 1;
  transform: scale(1); /* shrinks into place */
}
</style>
