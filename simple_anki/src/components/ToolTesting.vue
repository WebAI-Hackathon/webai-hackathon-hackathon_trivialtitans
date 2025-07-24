<script setup>
import { computed, onMounted } from 'vue'
import { lastGeneratedCard, setLastGeneratedCard } from '@/store/deckBuffer'
import { registerCreateImageTool } from '@/tools/generationTools'
import { registerDeleteCardTool } from '@/tools/cardTools'

const imagePreview = computed(() => {
  return lastGeneratedCard.value?.imageBase64
    ? `data:image/png;base64,${lastGeneratedCard.value.imageBase64}`
    : null
})

onMounted(() => {
    registerCreateImageTool()
    registerDeleteCardTool()
})
</script>

<template>
    <div class="preview-container">
        <h3>Generated Image Preview</h3>
        <div v-if="imagePreview">
            <img :src="imagePreview" alt="Generated preview" />
        </div>
        <p v-else>No image has been generated yet.</p>
    </div>

    <context name="deck_cards">
        <!-- Filled dynamically with JSON representation of deck.cards -->
    </context>

    <tool name="create_image" description="Generate an image from a prompt">
        <prop name="prompt" type="string" required />
    </tool>

    <tool name="delete_card" description="Delete a card by its index">
        <prop name="index" type="number" required />
    </tool>
</template>

<style scoped>
.preview-container {
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px dashed #888;
  border-radius: 8px;
  background-color: #1e1e1e;
  color: #fff;
  text-align: center;
  max-width: 350px;
  margin-left: auto;
  margin-right: auto;
}

img {
  max-width: 100%;
  border: 2px solid lime;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
}
</style>
