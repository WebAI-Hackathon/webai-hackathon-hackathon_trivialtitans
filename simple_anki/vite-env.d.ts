interface ImportMetaEnv {
    readonly VITE_LLM_API_KEY: string;
    // Add more variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }