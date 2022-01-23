import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  //Yastagbel
  @Input() name: any
  @Input() playerActive: boolean = false;
  constructor() { 
  }

  ngOnInit(): void {
  }

}
