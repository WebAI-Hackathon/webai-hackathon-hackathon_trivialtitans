<script setup>
import Card from './Card.vue';
import data from '../model/ankidata.json';

const ankiCards = data;

console.log(ankiCards);

</script>

<template>
  <div class="cards-container">
    <div class="cards">
      <h1>Cards</h1>
      <h3>List of cards</h3>
      <li v-for="ankiCard in ankiCards" :key="ankiCard.id">
        {{  ankiCard.topic }} <br /> {{ ankiCard.cards }} <br />
      </li>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.cards h1,
.cards h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .cards h1,
  .cards h3 {
    text-align: left;
  }
}
</style>
