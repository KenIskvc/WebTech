import SstService from "../../services/stt-service";

document.getElementById('recordBtn')?.addEventListener('click', () => {
  SstService.startRecognition(async (text) => {
    console.log("Recognized:", text);
  });
});