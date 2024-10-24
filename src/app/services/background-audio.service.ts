import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackgroundAudioService {
  private audio = new Audio();

  constructor() {
    this.audio.src = 'assets/musica-de-fondo.mp3';  // Ruta al archivo de audio
    this.audio.load();
    this.audio.loop = true;  // Para que la música se reproduzca en bucle
  }

  playMusic(): void {
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
