/**
 * The my-memory-game web component module.
 *
 * @author Tamim Jabr <tj222kg@student.lnu.se>
 * @version 1.0.0
 */

import '../my-flipping-tile'

/*
 * Get image URLs.
 */
const NUMBER_OF_IMAGES = 9

// an array with 9 elements, urls
const IMG_URLS = new Array(NUMBER_OF_IMAGES)
for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
  IMG_URLS[i] = (new URL(`images/${i}.png`, import.meta.url)).href
}

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host{
      --tile-size:80px
    }
    #game-board{
    display: grid;
    grid-template-columns: repeat(4,var(--tile-size));
    gap: 20px;
    }
    /*if it is small game so it's enough with two columns*/
    #game-board.small{
      grid-template-columns: repeat(2,var(--tile-size))
    }
    my-flipping-tile{
      width:var(--tile-size);
      height:var(--tile-size);
    }
    my-flipping-tile::part(tile-back) {
     border-width: 5px;
    background-image: url("${IMG_URLS[0]}");
    background-repeat: no-repeat;
    background-position: center/80%;
    background-color:  rgb(233, 210, 109);
    }
    h2{
    text-align: center;
    }
    button{
    margin: 10px;
    padding:10px;
    background-color: green;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size:1.2rem;
    border-radius:10px;
    outline: none;
    color:white
  }
  button:focus{
    color:green;
    background-color:white;
  }
  </style>
  <template id='tile-template'>
    <my-flipping-tile>
      <img />
    </my-flipping-tile>
  </template>
  <div>
  <button id='large'>Large</button>  
  <button id='medium'>Medium</button>  
  <button id='small'>Small</button>  
  </div>
  <div id='game-board'>
  </div>
  <button id='playAgain'>Play again</button>  
  <h2 id='score'></h2>
`

/*
 * Define custom element.
 */
customElements.define('my-memory-game',
  /**
   * Represents a memory game
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this._gameBoard = this.shadowRoot.querySelector('#game-board')
      this._tileTemplate = this.shadowRoot.querySelector('#tile-template')
      this._scoreBoard = this.shadowRoot.querySelector('#score')
      this._playBtn = this.shadowRoot.querySelector('#playAgain')
      // to count the attempts to finish the game
      this._attempts = 0
      // buttons to change the size
      this._largeBtn = this.shadowRoot.querySelector('#large')
      this._mediumBtn = this.shadowRoot.querySelector('#medium')
      this._smallBtn = this.shadowRoot.querySelector('#small')
    }

    /**
     * Gets the board size.
     *
     * @returns {string} The size of the game board.
     */
    get boardSize () {
      return this.getAttribute('boardsize')
    }

    /**
     * Sets the board size.
     *
     * @param {string} value - The size of the game board.
     */
    set boardSize (value) {
      this.setAttribute('boardsize', value)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['boardsize']
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      // if boardsize attribute is not specified give it the value large
      if (!this.hasAttribute('boardsize')) {
        this.setAttribute('boardsize', 'large')
      }
      this._upgradeProperty('boardsize')

      this._gameBoard.addEventListener('tileflip', this._onTileFlip.bind(this))
      this.addEventListener('dragstart', this._onDragStart)
      // fired at the end of the game
      this.addEventListener('gameover', this._onGameOver)
      // when the tiles match or mismatch
      this.addEventListener('tilesmismatch', this._handleMismatch)
      this.addEventListener('tilesmatch', this._handleMatch)
      this._playBtn.addEventListener('click', this._handlePlayAgain.bind(this))
      // add evnet listner for size buttons
      this._largeBtn.addEventListener('click', this._clickLargeBtn.bind(this))
      this._mediumBtn.addEventListener('click', this._clickMediumBtn.bind(this))
      this._smallBtn.addEventListener('click', this._clickSmallBtn.bind(this))
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'boardsize') {
        this._init()
      }
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._gameBoard.removeEventListener('tileflip', this._onTileFlip)
      this.removeEventListener('dragstart', this._onDragStart)
      this.removeEventListener('gameover', this._onGameOver)
      this.removeEventListener('tilesmismatch', this._handleMismatch)
      this.removeEventListener('tilesmatch', this._handleMatch)
      this._playBtn.removeEventListener('click', this._handlePlayAgain)
      this._largeBtn.removeEventListener('click', this._clickLargeBtn)
      this._mediumBtn.removeEventListener('click', this._clickMediumBtn)
      this._smallBtn.removeEventListener('click', this._clickSmallBtn)
    }

    /**
     * Get the game board size dimensions.
     *
     * @returns {object} The width and height of the game board.
     */
    get _gameBoardSize () {
      // the default size of the game board is 4x4 if there is no boardsize attribute given
      const gameBoardSize = {
        width: 4,
        height: 4
      }
      // !this.getAttribute('boardsize') = this.boardSize
      switch (this.boardSize) {
        // when small make the game 2x2
        case 'small':
          gameBoardSize.width = gameBoardSize.height = 2
          break
        case 'medium' : {
          // when medium make the game 4x2
          gameBoardSize.height = 2
          break
        }
      }
      return gameBoardSize
    }

    /**
     * Get all tiles.
     *
     * @returns {object} An object containing grouped tiles.
     */
    get _tiles () {
      const tiles = Array.from(this._gameBoard.children)
      return {
        all: tiles,
        faceUp: tiles.filter(tile => tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        faceDown: tiles.filter(tile => !tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        hidden: tiles.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Run the specified instance property through the class setter.
     *
     * @param {string} prop - The property's name.
     */
    _upgradeProperty (prop) {
      if (Object.hasOwnProperty.call(this, prop)) {
        const value = this[prop]
        delete this[prop]
        this[prop] = value
      }
    }

    /**
     * Initializes the game board size and tiles.
     */
    _init () {
      const { width, height } = this._gameBoardSize
      // the number of the tiles ex. 4*4=16
      const tilesCount = width * height

      // if the new number of tiles given not equal the existing one
      if (tilesCount !== this._tiles.all.length) {
        // remove the tiles from the board
        this._gameBoard.innerHTML = ''

        // add class small if the width ===2, means two columns
        if (width === 2) {
          this._gameBoard.classList.add('small')
        } else {
          this._gameBoard.classList.remove('small')
        }

        // add tiles to the  game board, but they are only with back face, we have to add images to front face at next step
        for (let i = 0; i < tilesCount; i++) {
          this._gameBoard.appendChild(this._tileTemplate.content.cloneNode(true))
        }
      }

      // Create a sequence of numbers between 0 and 15,
      // and then shuffle the sequence.
      // get indexes from 0 to 15 [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      const indexes = [...Array(tilesCount).keys()]

      console.log(indexes)
      // shuffle the indexes ex. [4, 12, 8, 5, 7, 14, 15, 10, 6, 13, 3, 0, 11, 1, 9, 2]

      for (let i = indexes.length - 1; i > 0; i--) {
        // random a number between 0 and i
        const j = Math.floor(Math.random() * (i + 1))
        const temp = indexes[j]
        indexes[j] = indexes[i]
        indexes[i] = temp
      }
      console.log(indexes)

      this._tiles.all.forEach((tile, index) => {
        // ! % is the rest value not division , ex 3%8+1= 4 because 3%8 =3
        // debugging const fi = indexes[index] % (tilesCount / 2) + 1
      // console.log(indexes[index],(tilesCount / 2))
        tile.querySelector('img').setAttribute('src', IMG_URLS[indexes[index] % (tilesCount / 2) + 1])
        // [indexes[index]%(this._tiles/2)+1] result twins of numbers between 1 and 8
        // todo check if necessary
        tile.faceUp = tile.disabled = tile.hidden = false
      })
    }

    /**
     * Handles flip events.
     *
     * @param {CustomEvent} event - The custom event.
     */
    _onTileFlip (event) {
      const tiles = this._tiles
      const tilesToDisable = Array.from(tiles.faceUp)
      console.log(tilesToDisable)
      // if there is more than one tile open, disable all other cards to prevent opening 3 cards
      if (tilesToDisable.length > 1) {
        tilesToDisable.push(...tiles.faceDown)
      }
      console.log(tilesToDisable)
      tilesToDisable.forEach(tile => tile.setAttribute('disabled', ''))
      const [first, second, ...tilesToEnable] = tilesToDisable

      // if there is two cards
      if (second) {
        const isEqual = first.isEqual(second)
        const delay = isEqual ? 1000 : 1500
        window.setTimeout(() => {
          let eventName = 'tilesmismatch'
          if (isEqual) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            eventName = 'tilesmatch'
          } else {
            // if they are not equal put back them and push to the array with tiles to enable
            first.removeAttribute('face-up')
            second.removeAttribute('face-up')
            tilesToEnable.push(first, second)
          }
          this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: { first, second }
          }))
          // check if it was the last one and all tiles are hidden
          if (tiles.all.every(tile => tile.hidden)) {
            tiles.all.forEach(tile => (tile.disabled = true))
            //! the game is over
            this.dispatchEvent(new CustomEvent('gameover', {
              bubbles: true
            }))
            this._init()
          } else {
            tilesToEnable.forEach(tile => (tile.removeAttribute('disabled')))
          }
        }, delay)
      }
    }

    /**
     * Handles drag start events. This is needed to prevent the
     * dragging of tiles.
     *
     * @param {DragEvent} event - The drag event.
     */
    _onDragStart (event) {
      // Disable element dragging.
      event.preventDefault()
      event.stopPropagation()
    }

    /**
     * Handle when the game is over.
     *
     * @param {CustomEvent} event - The custom event.
     */
    _onGameOver (event) {
      this._scoreBoard.textContent = `Your number of attempts: ${this._attempts}`
    }

    /**
     * Handles tilesmismatch events.
     *
     * @param {CustomEvent} event - The custom event.
     */
    _handleMismatch (event) {
      this._attempts++
    }

    /**
     * Handles tilesmatch events.
     *
     * @param {CustomEvent} event - The custom event.
     */
    _handleMatch (event) {
      this._attempts++
    }

    /**
     * Handles click on "Play again".
     *
     * @param {MouseEvent} event - The custom event.
     */
    _handlePlayAgain (event) {
      this._attempts = 0
      this._scoreBoard.textContent = ''
      const tiles = this._tiles
      const tilesToEnable = Array.from(tiles.all)
      console.log(tilesToEnable)
      tilesToEnable.forEach(tile => {
        tile.removeAttribute('disabled')
        tile.removeAttribute('face-up')
      })
      this._init()
    }

    /**
     * Handles click on "Large" button.
     *
     * @param {MouseEvent} event - The custom event.
     */
    _clickLargeBtn (event) {
      this.setAttribute('boardsize', 'large')
    }

    /**
     * Handles click on "Medium" button.
     *
     * @param {MouseEvent} event - The custom event.
     */
    _clickMediumBtn (event) {
      this.setAttribute('boardsize', 'medium')
    }

    /**
     * Handles click on "Small" button.
     *
     * @param {MouseEvent} event - The custom event.
     */
    _clickSmallBtn (event) {
      this.setAttribute('boardsize', 'small')
    }
  }

)
