import SstService from "../../services/stt-service";

document.getElementById('recordBtn')?.addEventListener('click', () => {
  SstService.startRecognition(async (text: string) => {
    console.log("Recognized:", text);
    
    const outputElement = document.getElementById("output");
    if (outputElement) {
      outputElement.innerHTML = text;
    }
  });
});