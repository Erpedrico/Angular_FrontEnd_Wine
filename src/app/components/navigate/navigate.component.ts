import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule
import { RouterLink } from '@angular/router';
import { ClickAudioService } from '../../services/click-audio.service';

@Component({
  selector: 'app-navigate',
  standalone: true,
  imports: [RouterModule, RouterLink],
  templateUrl: './navigate.component.html',
  styleUrl: './navigate.component.css'
})
export class NavigateComponent {
  constructor(private clickAudioService: ClickAudioService) {}

  // Método para manejar el clic en el botón y reproducir sonido
  onPlaySound() {
    const audioURL = 'assets/audio/botton-sound-wine.mp3';
    this.clickAudioService.playMusic(audioURL);
  }
}
