import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ClickAudioService {
  private audio = new Audio();

  constructor() {
  }

  playMusic(audioUrl: string) {
    this.audio.src = audioUrl;
    this.audio.load();  // Asegúrate de que el archivo esté listo para reproducirse
    this.audio.play();
  }

  pauseMusic(): void {
    this.audio.pause();
  }

  stopMusic(): void {
    this.audio.pause();
    this.audio.currentTime = 0;  // Reiniciar el audio
  }
}
