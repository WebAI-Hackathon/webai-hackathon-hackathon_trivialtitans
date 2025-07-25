<script setup>
import { ref, computed } from 'vue';
import { handleUpdateCard, handleGenerateNewCard, handleThemeImageGeneration } from '../tools/cardHandlers.ts';
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
    // Use image comparison since it's unique for each card
    const index = deck.cards.findIndex(c => c.image === selectedCard.value.image);
    
    if (index !== -1) {
      // Update the card's description
      deck.cards[index] = {
        ...deck.cards[index],
        description: newDescription.value
      };
      deck.modified = Date.now();
      
      // Update the local refs
      card.value = [...deck.cards]; // Create new array reference to trigger reactivity
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

const handleThemedImageGeneration = (event) => {
  console.log('Themed tool called with event:', event);
  console.log('Category:', props.category);
  handleThemeImageGeneration(event);
};

// Add storage calculation
const calculateStorageUsage = computed(() => {
  const storageData = JSON.stringify(decks.value);
  const sizeInMB = (new Blob([storageData]).size / (1024 * 1024)).toFixed(2);
  const maxSize = 5; // Chrome typically allows 5-10MB, being conservative with 5MB
  const percentUsed = ((sizeInMB / maxSize) * 100).toFixed(1);
  
  return {
    current: sizeInMB,
    max: maxSize,
    percent: percentUsed,
    remaining: (maxSize - sizeInMB).toFixed(2)
  };
});
</script>

<template>
  <div class="card-layout">
    <!-- Add storage indicator at the top -->
    <div class="storage-indicator" :class="{ 'warning': calculateStorageUsage.percent > 80 }">
      Storage: {{ calculateStorageUsage.current }}MB / {{ calculateStorageUsage.max }}MB 
      ({{ calculateStorageUsage.percent }}%)
      <div class="progress-bar">
        <div 
          class="progress" 
          :style="{ width: `${calculateStorageUsage.percent}%` }"
        ></div>
      </div>
      <div v-if="calculateStorageUsage.percent > 80" class="warning-text">
        Warning: Storage nearly full! Consider exporting and clearing some cards.
      </div>
    </div>

    <section class="anki-card-image">
      <tool 
        name="create_specific_image" 
        :description="`Create a new image for category '${props.category}'`"
        @call="handleToolCall">
        <prop name="category" :value="props.category" type="string" required></prop>
        <prop name="details" type="string" required></prop>
      </tool>

      <tool 
        name="create_themed_image" 
        :description="`Create a ${props.category} image in specific style`"
        @call="handleThemedImageGeneration">
        <prop name="category" :value="props.category" type="string" required></prop>
        <prop 
          name="theme" 
          type="string" 
          required 
          :options="['cartoon', 'realistic', 'fantasy']"
          description="Choose the visual style for the image">
        </prop>
      </tool>
      <div 
        v-for="(cardData, index) in card"
        @click="selectedCard = cardData"
        class="anki-card"
        :class="{selected: selectedCard === cardData}">
        
        <div class="card-body card-image">
          <img :src="`${cardData.image}`" alt="Card Image" />
          <div v-if="selectedCard === cardData" class="card-actions">
            <button class="edit-btn" @click.stop="handleEditDescription(cardData)">
              ✏️ Edit
            </button>
            <button class="regenerate-btn" @click.stop="handleRegenerateImage(cardData, index)">
              🔄 Regenerate
            </button>
            <button class="delete-btn" @click.stop="handleDeleteCard(index)">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="anki-card-description" v-if="selectedCard">
      <div class="description-panel">
        <div class="description-header">
          <h3>Description</h3>
          <button 
            v-if="!editingDescription" 
            class="edit-btn-small"
            @click="handleEditDescription(selectedCard)"
          >
            ✏️ Edit
          </button>
        </div>
        
        <!-- Fixed text field/label next to description -->
        <div class="description-content">
          <div class="fixed-info">
            <label class="fixed-label">Category:</label>
            <div class="fixed-text">{{ props.category }}</div>
            
            <label class="fixed-label">Card ID:</label>
            <div class="fixed-text">{{ card.indexOf(selectedCard) + 1 }}</div>
            
            <label class="fixed-label">Status:</label>
            <div class="fixed-text status-active">Active</div>
          </div>
          
          <div class="description-section">
            <div v-if="editingDescription" class="edit-description">
              <textarea 
                v-model="newDescription"
                rows="3"
                class="description-input"
                placeholder="Enter card description..."
              ></textarea>
              <div class="edit-actions">
                <button class="save-btn" @click="handleSaveDescription()">
                  Save
                </button>
                <button class="cancel-btn" @click="editingDescription = false">
                  Cancel
                </button>
              </div>
            </div>
            <div v-else class="description-text">
              {{ selectedCard.description }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.card-layout {
  display: flex;
  gap: 40px;
  width: 100%;
  align-items: flex-start;
  flex-wrap: wrap; /* Add this for better responsiveness */
}

section.anki-card-image {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 65%; /* Reduced to give more space to description */
  justify-content: center;
}

.anki-card {
  border: 1px solid #eee;
  width: 700px;
  height: 700px;
  cursor: pointer;
  flex-shrink: 0;
}

.card-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* Add this to ensure full width */
  height: 100%;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Maintains aspect ratio */
}

.anki-card-description {
  position: sticky;
  top: 20px;
  width: 30%; /* Increased from 25% */
  min-width: 300px; /* Ensure minimal readable width */
  background: rgba(0, 0, 0, 0.2); /* Slightly darker for better contrast */
  border-radius: 8px;
  padding: 25px; /* Increased padding */
  max-height: 90vh; /* Increased from 80vh */
  overflow-y: auto;
}

.description-panel {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Increased from 15px */
}

.description-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.description-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fixed-info {
  background: rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid hsla(160, 100%, 37%, 1);
}

.fixed-label {
  font-weight: bold;
  color: hsla(160, 100%, 37%, 1);
  font-size: 0.9rem;
  display: block;
  margin-top: 10px;
}

.fixed-label:first-child {
  margin-top: 0;
}

.fixed-text {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 4px;
  font-family: monospace;
  font-size: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-active {
  color: #28a745;
  font-weight: bold;
}

.description-section {
  flex: 1;
}

.edit-btn-small {
  background: rgba(0, 123, 255, 0.7);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.edit-btn-small:hover {
  background: rgba(0, 123, 255, 0.9);
}

.description-panel h3 {
  margin: 0;
  color: hsla(160, 100%, 37%, 1);
  font-size: 1.2rem;
  /* Remove margin-bottom since we're using flex now */
}

.description-text {
  line-height: 1.8; /* Increased from 1.6 */
  white-space: pre-wrap;
  font-size: 1.1rem; /* Larger text */
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 120px;
}

.selected {
  border: 2px solid #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
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
  padding: 12px; /* Increased padding */
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 120px; /* Taller default height */
  font-size: 1.1rem; /* Match text size */
  background: rgba(255, 255, 255, 0.9);
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

/* Add responsive breakpoints */
@media (max-width: 1200px) {
  .card-layout {
    justify-content: center;
  }

  section.anki-card_image {
    width: 100%;
  }

  .anki-card-description {
    width: 100%;
    position: relative;
    max-width: 700px; /* Match card width */
    margin-top: 20px;
  }
  
  .description-content {
    flex-direction: row;
    gap: 15px;
  }
  
  .fixed-info {
    flex: 0 0 200px;
  }
  
  .description-section {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .anki-card {
    width: 100%;
    max-width: 700px;
    height: auto;
    aspect-ratio: 1; /* Maintain square shape */
  }

  .card-actions {
    flex-direction: column;
    right: 50%;
    transform: translateX(50%);
    align-items: center;
  }
  
  .description-content {
    flex-direction: column;
  }
  
  .fixed-info {
    flex: none;
  }
}

/* Add these styles to your existing styles */
.storage-indicator {
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.storage-indicator.warning {
  background: rgba(255, 193, 7, 0.2);
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  margin-top: 5px;
}

.progress {
  height: 100%;
  background: hsla(160, 100%, 37%, 1);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.warning .progress {
  background: #ffc107;
}

.warning-text {
  color: #856404;
  font-size: 0.8rem;
  margin-top: 5px;
}
</style>