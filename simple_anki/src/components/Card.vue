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
  <div class="anki-card" v-for="x in card" @click="selectedCard = x; console.log(selectedCard)">
    <div class="card-body card-image">
      <h2>{{ x.image }}</h2>      
      <img :src="`/assets/${x.image}`" alt="Card Image" />
    </div>
    <div class="card-body card-description">
      <p>{{ x.description }}</p>
    </div>
  </div>
  <div v-if="selectedCard" class="modal">
    <div class="modal-content">
      <span class="close">&times;</span>
      <div >{{ selectedCard.image}}</div>
      <div>
        {{ selectedCard.description }}
      </div>
    </div>
  </div>
</template>


<style scoped>
  .anki-card {
    border: 1px solid #eee;
    width: 200px;
    height: 200px;
  }
</style>