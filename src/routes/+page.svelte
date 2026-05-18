<script>
  import { cards } from '$lib/cards.js';
</script>

<div class="hand">
  {#each cards as card (card.id)}
    <div class="card">
      <img src={card.image} alt="Card {card.value}" />
    </div>
  {/each}
</div>

<style>
  .hand {
    display: flex;
    gap: 1rem;
  }

  .card {
    width: 100px;
    cursor: pointer;
  }

  .card img {
    width: 100%;
    height: auto;
  }
</style>
