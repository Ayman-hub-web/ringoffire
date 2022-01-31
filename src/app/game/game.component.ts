import { Component, OnInit, Output } from '@angular/core';
import { Game } from 'src/models/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game | any;
  @Output() playsers: any;

  name: string | any;
  gameId:string;

  constructor(private router:ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  this.newGame();
  this.router.params.subscribe((params)=>{
    console.log(params);
    this.gameId = params['id'];

    this.firestore.collection('games').doc(this.gameId).valueChanges().subscribe((game:any)=>{
      console.log('Game updated:',game);
      this.game.currentPlayer = game.currentPlayer;
      this.game.playedCards = game.playedCards;
      this.game.players = game.players;
      this.game.stack = game.stack;
      this.game.currentCard = game.currentCard;
      this.game.pickCardAnimation = game.pickCardAnimation;
    });
  });
  
  }
  takeCard(){
    if(!this.game.pickCardAnimation){
    this.game.currentCard = this.game.stack.pop();
    console.log(this.game.currentCard);
    this.game.pickCardAnimation = true;
    
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    this.saveGame();

    setTimeout(() => {
      this.game.playedCards.push(this.game.currentCard);
      this.game.pickCardAnimation = false;
      this.saveGame();
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
      this.game.players.push(name);
      this.saveGame();
      }
    });
  }
  saveGame(){
    this.firestore.collection('games').doc(this.gameId).update(this.game.toJSON());
  }
}
// function DialogOverviewExampleDialog(DialogOverviewExampleDialog: any, arg1: { width: string; data: { name: string | undefined;}; }) {
//   throw new Error('Function not implemented.');
// }

