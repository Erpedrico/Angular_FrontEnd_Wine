import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigateComponent } from './components/navigate/navigate.component';
import { BackgroundAudioService } from './services/background-audio.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavigateComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FrontEnd_Angular';
  constructor(private backgroundAudioService: BackgroundAudioService) {}

  ngOnInit(): void {
    this.backgroundAudioService.playMusic();  // Inicia la música al cargar la aplicación
  }
}




