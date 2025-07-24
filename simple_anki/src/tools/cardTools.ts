import { deck } from "@/store/deckstate";

export function registerDeleteCardTool() {
  const tool = document.querySelector('tool[name="delete_card"]')
  tool?.addEventListener('call', (event: any) => {
    const { index } = event.detail

    if (index < 0 || index >= deck.cards.length) {
      event.detail.success = false
      event.detail.message = `Invalid card index: ${index}`
      return
    }

    const deleted = deck.cards.splice(index, 1)
    deck.modified = Date.now()

    event.detail.success = true
    event.detail.message = `Deleted card at index ${index}: ${deleted[0].description}`
  })
}

export function registerExportDeckTool() {
  const tool = document.querySelector('tool[name="export_deck"]');
  tool?.addEventListener("call", () => {
    const json = JSON.stringify(deck, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "anki_deck.json";
    link.click();
  });
}