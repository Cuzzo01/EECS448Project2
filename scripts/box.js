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
    this.div.setAttribute('onmousedown','mouseDown('+i+','+j+',event)');
    this.i = i;
    this.j = j;
    this.w = w
    this.boom = 0
    this.revealed = false
    this.flagged = false
    this.bufferBox = null;
    this.tempBox = null;
    this.origin = null;
    this.cheat = false
  }

  attach(board) {
    board.appendChild(this.div);
  }
  generateBufferBox() {
    this.div.classList.add('mine');
    let rect = this.div.getBoundingClientRect();
    this.origin = [(rect.left+10), (rect.top+10)];
    this.bufferBox = document.createElement('div');
    this.bufferBox.setAttribute("data-originX", rect.left + window.pageXOffset);
    this.bufferBox.setAttribute("data-originY", rect.top + window.pageYOffset);
    this.bufferBox.classList.add('bufferBox');
    document.body.appendChild(this.div);
    this.tempBox = document.createElement('div');
    this.tempBox.classList.add('tempBox');
    this.tempBox.style.gridArea = [(this.i+1).toString(),(this.j+1).toString(), 'span 1', 'span 1'].join(' / ') ;
    document.getElementById('board').appendChild(this.tempBox);
    this.div.style.position = 'absolute';
    this.div.style.top = this.bufferBox.getAttribute('data-originY') + 'px';
    this.div.style.left = this.bufferBox.getAttribute('data-originX') + 'px'
    this.div.appendChild(this.bufferBox);
  }
  deleteBufferBox() {
    this.div.classList.remove('mine');
    this.div.removeChild(this.bufferBox);
    document.getElementById('board').appendChild(this.div);
    document.getElementById('board').removeChild(this.tempBox);
    this.div.style.position = 'relative';
    this.div.style.transition = 'all 0s';
    this.div.style.top = '0px';
    this.div.style.left = '0px'
    this.bufferBox = null;
  }

  runAway(e) {
    let rect = this.div.getBoundingClientRect();
    let left = rect.left + window.pageXOffset;
    let top = rect.top + window.pageYOffset;
    let xpos = e.pageX;
    let ypos = e.pageY;
    let distanceFromOrigin = Math.sqrt(Math.pow(left-this.bufferBox.getAttribute('data-originX'),2) + Math.pow(top-this.bufferBox.getAttribute('data-originY'),2));
    let redValue = clamp((distanceFromOrigin)/20,0,1)*148;
    this.div.style.backgroundColor = `rgba(${redValue+107},${220-redValue},${254-redValue})`;
    let direction = [(left+10) - xpos, (top+10) - ypos];
    let magnitude = Math.sqrt(Math.pow(direction[0],2) + Math.pow(direction[1],2));
    if(magnitude<=22){
      direction = [direction[0]/magnitude,direction[1]/magnitude];
      let amplitude = 1/magnitude;
      if(amplitude<0.046)
        amplitude = 0;
      let newPosition = [left +  amplitude * 30 * direction[0], top +  amplitude * 30 * direction[1]];
      this.div.style.transition = 'all 0s';
      this.div.style.left = newPosition[0] + 'px';
      this.div.style.top = newPosition[1] + 'px';
      return true;
    }
    else{
      this.div.style.transition = 'all 1s';
      this.div.style.top = this.bufferBox.getAttribute('data-originY') + 'px';
      this.div.style.left = this.bufferBox.getAttribute('data-originX') + 'px';
      return false;
    }
  }

  toggleCheat() {
    this.cheat = !this.cheat;
    if (this.cheat) {
      if(this.boom == -1) {
        this.div.classList.add("revealedMine");
      } else {
        this.div.classList.add("revealed");
        if(this.boom != 0)
          this.div.innerHTML = this.boom;
      }
    } else {
      if(this.boom == -1) {
        this.div.classList.toggle("revealedMine");
      } else {
        if (!this.revealed) {
          this.div.classList.toggle("revealed");
          if(this.boom != 0)
            this.div.innerHTML = "";
        }
      }
    }
  }

  /**Checks surrounding boxes for bombs and reveals them if they are not
  * @param {number} i row of gameBoard
  * @param {number} j column of gameBoard
  * @function recurseReveal checks surrounding boxes
  * @function endGameLose checks losing condition
  */
  reveal() {
    // console.log("Reveal called at: " + this.i + " and " + this.j + " ; ");
    this.revealed = true;
    if(this.flagged) {
      this.toggleFlag();
    }
    if(this.boom == -1) {
      this.div.classList.add("revealedMine");
    } else {
      this.div.classList.add("revealed");
      if(this.boom != 0)
        this.div.innerHTML = this.boom;
    }
    if(this.boom == 0 && !this.flagged) {
      this.recurseReveal();
    } else if(this.boom == -1 && !this.flagged) {
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
            if(!gameBoard[newI][newJ].revealed && !gameBoard[newI][newJ].flagged)
              gameBoard[newI][newJ].reveal();
          }
        }
      }
    }
  }

  /**Places a flag to indicate there is a bomb in the box
  *@function endGameWin checks win condition
  */
  toggleFlag() {
    this.flagged = !this.flagged;
    this.div.classList.toggle("flagged");
  }
}
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}
