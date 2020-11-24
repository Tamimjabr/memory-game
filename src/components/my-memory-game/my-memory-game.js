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
console.log(IMG_URLS)

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
    my-flipping-tile{
      width:var(--tile-size);
      height:var(--tile-size);
    }
    my-flipping-tile::part(tile-back) {
     border-width: 5px;
    background-image: url("${IMG_URLS[0]}");
    background-repeat: no-repeat;
    background-position: center/80%;
    background-color: teal;
    }
  </style>
  <template id='tile-template'>
    <my-flipping-tile>
      <img />
    </my-flipping-tile>
  </template>
  <div id='game-board'>
  <my-flipping-tile>
  
    </my-flipping-tile>
  </div>

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

    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {

    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {

    }

    /**
     * Get the game board size dimensions.
     *
     * @returns {object} The width and height of the game board.
     */
    get _gameBoardSize () {
      // the default size of the game board if there is no boardsize attribute given
      const gameBoardSize = {
        width: 4,
        height: 4
      }
      // this.getAttribute('boardsize') = this.boardSize
      switch (this.getAttribute('boardsize')) {
        case 'small':
          gameBoardSize.width = gameBoardSize.height = 2
          break
        case 'medium' : {
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
  }
)
