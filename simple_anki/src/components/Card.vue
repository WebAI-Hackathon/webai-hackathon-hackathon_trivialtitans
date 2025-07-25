<script setup>
import { ref } from 'vue';
import { handleUpdateCard, handleGenerateNewCard } from '../tools/cardHandlers.ts';
import { decks } from '../store/deckStore';

const props = defineProps({
  ankiCard: {
    type: Object,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const card = ref(props.ankiCard);
let selectedCard = ref(null);
const editingDescription = ref(false);
const newDescription = ref('');

// Add function to handle description edit
const handleEditDescription = (cardData) => {
  newDescription.value = cardData.description;
  editingDescription.value = true;
};

// Add function to save description changes
const handleSaveDescription = () => {
  const deck = decks.value.find(d => 
    d.topic.toLowerCase() === props.category.toLowerCase()
  );
  
  if (deck && deck.cards) {
    // Find the index of the selected card in the deck's cards array
    const index = deck.cards.findIndex(c => c === selectedCard.value);
    
    if (index !== -1) {
      // Update the card's description
      deck.cards[index] = {
        ...deck.cards[index],
        description: newDescription.value
      };
      deck.modified = Date.now();
      
      // Update the local refs
      card.value = deck.cards;
      selectedCard.value = deck.cards[index];
      editingDescription.value = false;
    }
  }
};

const handleRegenerateImage = (cardData, index) => {
  // Add slight variation to the original description
  const variation = `, variation ${Math.floor(Math.random() * 1000)}`;
  const event = {
    detail: {
      category: props.category,
      details: cardData.description + variation,
      cardIndex: index
    }
  };
  handleUpdateCard(event);
};

const handleDeleteCard = (index) => {
  // Find the deck
  const deck = decks.value.find(d => 
    d.topic.toLowerCase() === props.category.toLowerCase()
  );
  
  if (deck && deck.cards) {
    // Remove the card at the specified index
    deck.cards.splice(index, 1);
    deck.modified = Date.now();
    
    // Update the local card ref to trigger re-render
    card.value = deck.cards;
    
    // Clear selection if deleted card was selected
    if (selectedCard.value === card.value[index]) {
      selectedCard.value = null;
    }
  }
};

// Add debug wrapper for the tool call
const handleToolCall = (event) => {
  console.log('Tool called with event:', event);
  console.log('Category:', props.category);
  handleGenerateNewCard(event);
};
</script>

<template>
  <section class="anki-card-image">
    <tool 
      name="create_specific_image" 
      :description="`Create a new image for category '${props.category}'`"
      @call="handleToolCall">
      <prop name="category" :value="props.category" type="string" required></prop>
      <prop name="details" type="string" required></prop>
    </tool>
    <div 
      v-for="(cardData, index) in card"
      @click="selectedCard = cardData"
      class="anki-card"
      :class="{selected: selectedCard === cardData}">
      
      <div class="card-body card-image">
        <img :src="`${cardData.image}`" alt="Card Image" />
        <!-- Add buttons that only show when card is selected -->
        <div v-if="selectedCard === cardData" class="card-actions">
          <button 
            class="edit-btn"
            @click.stop="handleEditDescription(cardData)">
            ✏️ Edit
          </button>
          <button 
            class="regenerate-btn"
            @click.stop="handleRegenerateImage(cardData, index)">
            🔄 Regenerate
          </button>
          <button 
            class="delete-btn"
            @click.stop="handleDeleteCard(index)">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  </section>
  <section class="anki-card-description">
    <div v-if="selectedCard" class="card-content">
      <div v-if="editingDescription" class="edit-description">
        <textarea 
          v-model="newDescription"
          rows="3"
          class="description-input"
        ></textarea>
        <div class="edit-actions">
          <button 
            class="save-btn"
            @click="handleSaveDescription()">
            Save
          </button>
          <button 
            class="cancel-btn"
            @click="editingDescription = false">
            Cancel
          </button>
        </div>
      </div>
      <div v-else>
        {{ selectedCard.description }}
      </div>
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

  .card-body {
    position: relative; /* For absolute positioning of the button */
  }

  .card-actions {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    gap: 8px;
  }

  .regenerate-btn,
  .delete-btn {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .delete-btn {
    background: rgba(220, 53, 69, 0.7); /* Red background for delete button */
  }

  .regenerate-btn:hover,
  .delete-btn:hover {
    opacity: 1;
  }

  .delete-btn:hover {
    background: rgba(220, 53, 69, 0.9);
  }

  .edit-btn {
    background: rgba(0, 123, 255, 0.7); /* Blue background for edit button */
  }

  .edit-btn:hover {
    background: rgba(0, 123, 255, 0.9);
  }

  .edit-description {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .description-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
  }

  .edit-actions {
    display: flex;
    gap: 8px;
  }

  .save-btn,
  .cancel-btn {
    padding: 4px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .save-btn {
    background: #28a745;
    color: white;
  }

  .cancel-btn {
    background: #6c757d;
    color: white;
  }

  .save-btn:hover {
    background: #218838;
  }

  .cancel-btn:hover {
    background: #5a6268;
  }
</style>