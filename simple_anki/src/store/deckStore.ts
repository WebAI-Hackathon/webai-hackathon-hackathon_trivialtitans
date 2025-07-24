// deckStore.ts
import { ref, watch } from 'vue'

// Load saved decks or start empty
const savedDecks = localStorage.getItem('decks')
export const decks = ref(savedDecks ? JSON.parse(savedDecks) : [])

// Save to localStorage on any change
watch(decks, (newVal) => {
  localStorage.setItem('decks', JSON.stringify(newVal))
}, { deep: true })
