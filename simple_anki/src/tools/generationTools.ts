import { lastGeneratedCard, setLastGeneratedCard } from "@/store/deckBuffer";
const LLM_API_KEY = import.meta.env.VITE_LLM_API_KEY;

async function generateImage(prompt: string): Promise<string> {
  const response = await fetch("https://api.litviva.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API_KEY}`
    },
    body: JSON.stringify({
      model: "hackathon/text2image",
      prompt,
      n: 1,
      size: "1024x1024"
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || response.statusText);
  }

  const data = await response.json();
  return data.data[0].b64_json;
}

export function registerCreateImageTool() {
  const tool = document.querySelector('tool[name="create_image"]');
  tool?.addEventListener("call", async (event: any) => {
    const { prompt } = event.detail;
    const outputEl = document.getElementById("output");

    if (outputEl) outputEl.innerHTML = "Generating...";

    try {
      const base64 = await generateImage(prompt);
      console.log('[VOIX] base64 size:', base64?.length)

      setLastGeneratedCard({
        concept: prompt,
        imageBase64: base64,
        description: ""
      });

      if (outputEl)
        outputEl.innerHTML = `<img src=\"data:image/png;base64,${base64}\" alt=\"Generated Image\" />`;

      event.detail.success = true;
      event.detail.message = "Image created and ready to save.";
    } catch (err: any) {
      console.error(err);
      if (outputEl)
        outputEl.innerHTML = `<span class=\"warn\">Error: ${err.message}</span>`;
      event.detail.success = false;
      event.detail.message = "Image generation failed.";
    }
  });
}

export function registerRecreateImageTool() {
  const tool = document.querySelector('tool[name="recreate_image"]')
  tool?.addEventListener('call', async (event: any) => {
    const card = lastGeneratedCard.value
    if (!card) {
      event.detail.success = false
      event.detail.message = 'No concept to recreate.'
      return
    }

    try {
      const base64 = await generateImage(card.concept)
      setLastGeneratedCard({
        concept: card.concept,
        description: card.description,
        imageBase64: base64
      })

      event.detail.success = true
      event.detail.message = 'Image re-created with same concept.'
    } catch (err) {
      event.detail.success = false
      event.detail.message = 'Failed to recreate image.'
    }
  })
}

export function registerUpdateImageTool() {
  const tool = document.querySelector('tool[name="update_image"]')
  tool?.addEventListener('call', async (event: any) => {
    const { prompt } = event.detail

    try {
      const base64 = await generateImage(prompt)
      setLastGeneratedCard({
        concept: prompt,
        description: '',
        imageBase64: base64
      })

      event.detail.success = true
      event.detail.message = 'Image updated with new concept.'
    } catch (err) {
      event.detail.success = false
      event.detail.message = 'Failed to update image.'
    }
  })
}
