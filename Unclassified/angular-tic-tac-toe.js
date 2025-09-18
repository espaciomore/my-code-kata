// @ts-ignore
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-area',
  template: `
    <div id="statusArea" className="status">Next player: <span id="player">{{ player }}</span></div>
    <div id="winnerArea" className="winner">Winner: <span id="winner">None</span></div>
    <button (click)="reset($event)">Reset</button>
    <section>
      <div class="row" *ngFor="let row of [1, 2, 3]">
        <button *ngFor="let col of [1, 2, 3]" (click)="playRecieved($event, player)" id="{{row+''+col}}" class="square" style="vertical-align:top;width:40px;height:40px;" clickable></button>
      </div>
    </section>
  `,
  styles: []
})

export class MainAppComponent implements OnInit {
  public player: string
  private isOver: boolean;
  private winningMatrix;

  ngOnInit() { 
    this.player = 'X'
    this.isOver = false
    this.winningMatrix = [
        [[1,1,1], [0,0,0], [0,0,0]],
        [[0,0,0], [1,1,1], [0,0,0]],
        [[0,0,0], [0,0,0], [1,1,1]],
        [[1,0,0], [0,1,0], [0,0,1]],
        [[0,0,1], [0,1,0], [1,0,0]],
        [[1,0,0], [1,0,0], [1,0,0]],
        [[0,1,0], [0,1,0], [0,1,0]],
        [[0,0,1], [0,0,1], [0,0,1]]
      ]
  }

  // p : current player
  public playRecieved(event, p): void {
    if (this.isOver) return

    let currentPlayer = p

    // set current play (only if the space is empty)
    var btn = event.target || event.srcElement || event.currentTarget

    if (btn && !btn.textContent) {
      btn.textContent = currentPlayer
    }

    // get current player's play matrix
    let playerMatrix = [[0,0,0], [0,0,0], [0,0,0]]
    let full = 0

    for (let row of [1, 2, 3]) {
      for (let col of [1, 2, 3]) {
        let btnValue = document.getElementById(row+''+col).innerText == currentPlayer ? 1 : 0;

        playerMatrix[row-1][col-1] += btnValue;

        full += btnValue
      }
    }
    
    if (this.isWinner(playerMatrix)) {
      // end game with a winner
      document.getElementById('winner').innerText = currentPlayer
      this.isOver = true
    } else if (full == 9) {
      // end game with no winner
      document.getElementById('winner').innerText = 'None (End of Game)'
      this.isOver = true
    } else {
      // change player turn
      this.player = this.player == "X" ? "Y" : "X";
      document.getElementById('player').innerText = this.player;
    }
  }

  public reset(event): void {
    // just reload
    window.location.reload()
  }

  // m : matrix of current play
  private isWinner(m): boolean {
    let winCount = 0;

    for (let w of this.winningMatrix) {
      for (let i of [0, 1, 2]) {
        for (let j of [0, 1, 2]) {
          if (w[i][j] == 1 && m[i][j] == 1) {
            winCount++
          }
        }
      }

      if (winCount > 2) {
        break
      } else {
        winCount = 0
      }
    }

    return winCount == 3
  }
}
