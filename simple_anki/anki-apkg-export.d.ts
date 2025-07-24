declare module 'anki-apkg-export' {
    interface Card {
      // Define the structure of a card if needed
    }
  
    interface ApkgExporterOptions {
      // Define any options if necessary
    }
  
    class ApkgExporter {
      constructor(name: string, options?: ApkgExporterOptions);
      addMedia(filename: string, buffer: Buffer): Promise<string>;
      addCard(front: string, back: string): void;
      save(): Promise<Buffer>;
    }
  
    export default ApkgExporter;
  }