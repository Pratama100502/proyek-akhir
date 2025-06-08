const Camera = {
  stream: null,

  async initialize() {
    const videoElement = document.getElementById('camera');
    const captureButton = document.getElementById('capture-btn');
    const canvasElement = document.getElementById('canvas');
    const previewImage = document.getElementById('photo-preview');
    const imageDataField = document.getElementById('image-data');

    if (!videoElement || !captureButton || !canvasElement || !previewImage || !imageDataField) {
      console.error("Beberapa elemen kamera tidak ditemukan.");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.stream = mediaStream;
      videoElement.srcObject = mediaStream;

      captureButton.addEventListener('click', () => {
        const context = canvasElement.getContext('2d');
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        const capturedImage = canvasElement.toDataURL('image/png');
        previewImage.src = capturedImage;
        imageDataField.value = capturedImage;
      });
    } catch (error) {
      console.error("Tidak dapat mengakses kamera:", error);
    }
  },

  stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null; // Hapus referensi setelah dimatikan
      console.log("Kamera dimatikan.");
    }
  }
};

export default Camera;
