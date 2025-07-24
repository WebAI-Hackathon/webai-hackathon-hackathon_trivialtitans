<script setup>
import Card from './Card.vue';
import { ref } from 'vue';
import userData from '../model/userdata.json';


const user = ref(userData);



const props = defineProps({
  selectedCard: {
    type: Number,
    default: 0
  },
  ankiCards: {
    type: Array,
    required: true
  }
});

const selectedCard = ref(props.selectedCard);
const ankiCards = ref(props.ankiCards);
console.log(selectedCard.value);
console.log(ankiCards);

</script>

<template>
  <nav @click="selectedCard = 0;">
    home
  </nav>
  <main>
    <div class="anki-container">
      <div class="card-list" v-if="selectedCard === 0">

        <h1>Welcome, <span class="green">{{ user.name }}</span></h1>
        <h3>Here are your Anki cards</h3>
        <div 
          v-for="ankiCard in ankiCards" 
          :key="ankiCard.id"
          @click="selectedCard = parseInt(ankiCard.id); console.log(typeof selectedCard)"
          class="card-list-item">
          {{ ankiCard.topic }} <br />
        </div>
      </div>
      <div v-else class="card-container">
        <Card :ankiCard="ankiCards[selectedCard - 1].cards" />
      </div>
    </div>
  </main>
</template>

<style scoped>
  .anki-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h1 {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
    top: -10px;
  }

  h3 {
    font-size: 1.2rem;
  }

  .card-list h1,
  .card-list h3 {
    text-align: center;
  }

  .card-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    gap: 20px;
  }

  .card-list-item {
    padding: 10px;
    border: 1px solid #eee;
    background-color: #2222;
    cursor: pointer;
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .card-list-item:hover {
    background-color: #333;
    box-shadow: 5px -5px hsla(160, 100%, 37%, 1);
    transition: all 0.3s ease-in-out;
  }

  .card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px
  }


@media (min-width: 1024px) {

  .card-list h1,
  .card-list h3 {
    text-align: left;
  }
}
</style>
