import { decks } from '@/store/deckStore'
import { generateImage } from './generationTools'

export async function handleGenerateNewCard(event: any) {
  console.log('[DEBUG] Starting handleGenerateNewCard');
  console.log('[DEBUG] Event:', event);
  
  if (!event?.detail) {
    console.error('[DEBUG] Event or event.detail is undefined');
    return;
  }

  const { category, details } = event.detail;
  console.log('[DEBUG] Extracted category:', category);
  console.log('[DEBUG] Extracted details:', details);

  // Validate category exists
  if (!category) {
    console.error('[DEBUG] Category is undefined');
    event.detail.success = false;
    event.detail.message = 'Category is required but was not provided';
    return;
  }

  // Find the deck
  console.log('[DEBUG] Finding deck for category:', category);
  console.log('[DEBUG] Available decks:', decks.value);
  
  const deck = decks.value.find((d) => 
    d.topic && d.topic.toLowerCase() === category.toLowerCase()
  );

  if (!deck) {
    console.error('[DEBUG] No deck found for category:', category);
    event.detail.success = false;
    event.detail.message = `Deck with category "${category}" not found.`;
    return;
  }

  try {
    const prompt = details ? `${category}, ${details}` : category;
    console.log('[DEBUG] Generated prompt:', prompt);

    console.log('[DEBUG] Calling generateImage');
    const b64Image = await generateImage(prompt);
    console.log('[DEBUG] Image generated successfully');

    // Create new card
    const newCard = {
      image: b64Image,
      description: details
        ? `New image for ${category}: ${details}`
        : `New image for ${category}`,
      review: {
        lastReviewed: Date.now(),
        nextDue: Date.now() + 3 * 86400000,
        interval: 3,
        repetition: 1
      }
    };

    // Ensure cards array exists
    if (!Array.isArray(deck.cards)) {
      console.log('[DEBUG] Initializing cards array');
      deck.cards = [];
    }

    console.log('[DEBUG] Adding new card to deck');
    deck.cards.push(newCard);
    deck.modified = Date.now();

    event.detail.success = true;
    event.detail.message = `Generated new card for category "${category}"`
    console.log('[DEBUG] Card generation completed successfully');
  } catch (err: any) {
    console.error('[DEBUG] Error in card generation:', err);
    event.detail.success = false;
    event.detail.message = `Failed to generate new card: ${err.message}`;
  }
}

export async function handleUpdateCard(event: any) {
  console.log('[VOIX] Update card triggered:', event.detail)
  if (!event?.detail) {
    console.error('Event or event.detail is undefined')
    return
  }

  const { category, details, cardIndex } = event.detail

  // Find the deck
  const deck = decks.value.find((d) => 
    d.topic && d.topic.toLowerCase() === category.toLowerCase()
  )

  if (!deck || !deck.cards) {
    event.detail.success = false
    event.detail.message = `Deck with category "${category}" not found.`
    return
  }

  try {
    // Generate new image with the variation
    const prompt = `${category}, ${details}`
    console.log('Generated variation prompt:', prompt)
    
    const b64Image = await generateImage(prompt)
    
    // Update the existing card
    deck.cards[cardIndex] = {
      ...deck.cards[cardIndex],  // Keep other properties
      image: b64Image,          // Update image
      description: details      // Update description
    }
    
    deck.modified = Date.now()

    event.detail.success = true
    event.detail.message = `Updated card in category "${category}"`
    console.log('Successfully updated card for category:', category)
  } catch (err: any) {
    event.detail.success = false
    event.detail.message = `Failed to update card: ${err.message}`
    console.error('Error updating card:', err)
  }
}