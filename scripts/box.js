/** @fileOverview This class describes boxes and the definitions of their traits
  * @author Kevin Dinh, Eric Seals, Eric D. Fan, Evan Trout
  * @constructor
  * @property boom boolean to decide if the box is a bomb
  * @property revealed boolean to decide if the box has been revealed
  * @property flagged boolean to decided if the box has a flag
  */

// only the draw function is internal to the Box
class Box {
  constructor(i, j, w, boom) {
    this.div = document.createElement('div');
    this.div.classList.add('box');
    this.div.style.gridArea = [(i+1).toString(),(j+1).toString(), 'span 1', 'span 1'].join(' / ') ;
    this.div.setAttribute('onclick','mouseReleased('+i+','+j+')');
    this.i = i;
    this.j = j;
    this.w = w
    this.boom = 0
    this.revealed = false
    this.flagged = false
  }


  attach(board) {
    board.appendChild(this.div);
  }

  /**Checks surrounding boxes for bombs and reveals them if they are not
  * @param {number} i row of gameBoard
  * @param {number} j column of gameBoard
  * @function recurseReveal checks surrounding boxes
  * @function endGameLose checks losing condition
  */
  reveal() {
    console.log("Reveal called at: " + this.i + " and " + this.j + " ; ");
    this.revealed = true;
    this.div.innerHTML = this.boom;
    if( this.boom == 0 && !this.flagged ) {
      this.recurseReveal();
    } else if( this.boom == -1 && !this.flagged ) {
      endGameLose();
    }

  }
  /**Recursion function to check surrounding boxes for bombs
  * @param {number} curI row of gameBoard
  * @param {number} curJ column of gameBoard
  * @function reveal checks the next bomb in the recursion
  */
  recurseReveal() {
    for( let i = -1; i <= 1; i++ ) {
      for( let j = -1; j <= 1; j++ ) {
        let newI = this.i + i
        let newJ = this.j + j
        if (newI >= 0 && newI < gameBoard.length) {
          if (newJ >= 0 && newJ < gameBoard[newI].length) {
            if(!gameBoard[newI][newJ].revealed)
              gameBoard[newI][newJ].reveal();
          }
        }
      }
    }
  }
}
/**Places a flag to indicate there is a bomb in the box
*@function endGameWin checks win condition
*/
function toggleFlag(row, col) {
  gameBoard[row][col].flagged = !gameBoard[row][col].flagged;
}
