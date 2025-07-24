<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    ankiCard: {
      type: Object,
      required: true
    }
  });

  
  
  const card = ref(props.ankiCard);
  let selectedCard = ref(null);
</script>

<template>
  <section class="anki-card-image">
    <div 
      @click="selectedCard = cardData"
      class="anki-card"
      :class="{selected: selectedCard === cardData}"
      v-for="cardData in card">
      
      <div class="card-body card-image">
        <img :src="`${cardData.image}`" alt="Card Image" />
      </div>
      <!-- <div class="card-body card-description">
        <p>{{ cardData.description }}</p>
      </div> -->
    </div>
  </section>
  <section class="anki-card-description">
    <div v-if="selectedCard"  class="card-content">
        {{ selectedCard.description }}
    </div>
    <div v-else class="card-content">
        <p>Select a card to view its description.</p>
    </div>
  </section>
</template>


<style scoped>
  .anki-card {
    border: 1px solid #eee;
    width: 280px;
    height: 280px;
    cursor: pointer;
  }

  section.anki-card-image {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      width: 60%
    }

  .anki-card-description {
    width: 30%;
    position: sticky;
    top: 100px;
    height: 100px;
  }

  .selected {
    border: 2px solid #4CAF50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
  }

  .card-image {
    display: flex;
    justify-content: center;
  }

</style>