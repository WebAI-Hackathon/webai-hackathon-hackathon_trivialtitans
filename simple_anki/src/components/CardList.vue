<script setup>
import Card from './Card.vue'
import { ref } from 'vue'
import { handleCreateCategory } from '../tools/categoryHandlers.ts'
import { handleCreateImagesByCategory, handleCreateImagesAll } from '../tools/categoryHandlers.ts'
import userData from '../model/userdata.json'
import { decks } from '../store/deckStore'
import { saveAs } from 'file-saver'

const user = ref(userData)

const ankiCards = decks

const props = defineProps({
  selectedCard: {
    type: Number,
    default: 0
  },
  ankiCards: {
    type: Array,
    required: true
  }
})



let selectedCard = ref(props.selectedCard)

async function downloadApkg() {
  const resp = await fetch('http://localhost:3001/api/export-apkg', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(decks.value) // Ensure decks.value contains valid data
  });

  if (!resp.ok) {
    const { error } = await resp.json();
    alert('Export failed: ' + error);
    return;
  }

  const blob = await resp.blob();
  saveAs(blob, 'image_decks.apkg'); // Save the file locally
  alert('APKG exported 🎉 – open it with Anki.');
}
</script>

<template>
  <nav @click="selectedCard = 0;">
    home
  </nav>

  <tool name="export_apkg" description="Export decks as .apkg file" @call="downloadApkg">
    <prop name="decks" type="array" required />
  </tool>

  <tool name="create_category" description="Create a new image category" @call="handleCreateCategory">
    <prop name="name" type="string" required></prop>
  </tool>

  <tool name="create_images_by_category" description="Generate images for a given category" @call="handleCreateImagesByCategory">
    <prop name="category" type="string" required></prop>
    <prop name="count" type="number" required></prop>
  </tool>

  <tool name="create_images_all_category" description="Generate images for all category" @call="handleCreateImagesAll">
    <prop name="count" type="number" required></prop>
  </tool>

  <main>
    <div class="anki-container">
      <div class="card-list" v-if="selectedCard === 0">

        <h1>Welcome, <span class="green">{{ user.name }}</span></h1>
        <div class="message">
          <h3>Here are your <span class="green">Anki cards</span>
            <img src="../assets/anki.svg" width="40px" alt="" />
          </h3>
        </div>
        <div class="card-list-item-header">
          <h3>Topic</h3>
          <h3>Date Created</h3>
        </div>
        <div
          v-for="(ankiCard, idx) in ankiCards"
          :key="ankiCard.id"
          @click="selectedCard = idx+1; console.log(`Index ${idx}, selectedCard: ${selectedCard}`)"
          class="card-list-item"
          >
            <context>
              {{ ankiCard.topic }}
            </context>
            <context>
              {{ Date(ankiCard.createdAt).slice(0, 24) }}
            </context>
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

  .card-list-item-header,
  .card-list-item {
    padding: 10px;
    border: 1px solid #eee;
    background-color: #2222;
    cursor: pointer;
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-list-item-header {
    border-left: none;
    border-right: none;
    border-top: none;
    display: flex;
    border-bottom-color: hsla(160, 100%, 37%, 1);
  }

  .card-list-item:hover {
    background-color: #333;
    box-shadow: 5px 5px hsla(160, 100%, 37%, 1);
    transition: all 0.3s ease-in-out;
  }

  .card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    position: relative;
  }

  nav {
    height: 40px;
    position: sticky;
    cursor: pointer;
    border-bottom: 1px solid #eee;

  }

  main {
    margin-top: 50px;
  }

  .message h3 {
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
