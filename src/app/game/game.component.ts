import { Component, OnInit, Output } from '@angular/core';
import { Game } from 'src/models/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation= false;
  game: Game | any;
  currentCard: undefined
  @Output() playsers: any;

  name: string | any;

  constructor(private router:ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  this.newGame();
  this.router.params.subscribe((params)=>{
    console.log(params);
    this.firestore.collection('games').doc(params['id']).valueChanges().subscribe((game:any)=>{
      console.log('Game updated:',game);
      this.game.currentPlayer = game.currentPlayer;
      this.game.playedCards = game.playedCards;
      this.game.player = game.player;
      this.game.stack = game.stack;
    });
  });
  
  }
  takeCard(){
    if(!this.pickCardAnimation){
    this.currentCard = this.game.stack.pop();
    console.log(this.currentCard)
    this.pickCardAnimation = true;
    
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

    setTimeout(() => {
      this.game.playedCards.push(this.currentCard)
      this.pickCardAnimation = false;
    }, 1000);
  }
  }
  newGame(){
    this.game = new Game();
    // this.firestore.collection('games').add(this.game.toJSON());
    // console.log(this.game);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      console.log('The dialog was closed', name);
      this.name = name;
      //Keine Players erstellen ohne Namen
      if(this.name && this.name.length > 0){
      this.game.players.push(name)
      }
    });
  }
}
function DialogOverviewExampleDialog(DialogOverviewExampleDialog: any, arg1: { width: string; data: { name: string | undefined;}; }) {
  throw new Error('Function not implemented.');
}

