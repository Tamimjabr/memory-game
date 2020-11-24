/**
 * The my-flipping-tile web component module.
 *
 * @author Tamim Jabr <tj222kg@student.lnu.se>
 * @version 1.0.0
 */

const IMG_URL = new URL('images/lnu-symbol.png', import.meta.url).href

const template = document.createElement('template')
template.innerHTML = `
<style>
  :host{
    display:block;
    height:80px;
    width:80px;
    position:relative;
    perspective: 1000px;
  }
  /*because the host is getting the attribut not the button
  on face-up show the front and hide the back of the tile*/
  /*
  :host([face-up]) #front{
    display: inline-block;
  }
  :host([face-up]) #back{
    display: none;
  }*/
  :host([face-up]) #tile {
      transform: rotateY(180deg);
  }

  :host([hidden]) #tile{
    cursor:default;
    pointer-events: none;
    box-shadow: none;
    border: 1px dotted black;
  }
  /*hdie everything in #title*/
  :host([hidden]) #tile>* {
        visibility: hidden;
    }
  #tile[disabled]{
      cursor: default;
      pointer-events: none;
      box-shadow: none;
      border-style: dashed;
      border-color: #858585;
    }
  #tile{
    display:inline-block;
    height:100%;
    width:100%;
    padding :0;
    border: solid 1px #767676;
    border-radius: 10px;
    outline: none;
    background-color: white;
    cursor:pointer;
    box-shadow: 0px 0 10px  #ccc;
     /* flipping */
    transform-style: preserve-3d;
    transition: 1s;

  }
  #tile:focus {
      border-color: #000;
      box-shadow: 0px 0 10px black;
    }
    #front, #back {
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      border-radius: 8px;
      margin:2px;
      /* flipping */
      position: absolute;
      top:0;
      left:0;
      backface-visibility: hidden;
    }
    
    #front {
      background-color:#fff;
    /*  display: none;*/
    /* flipping */
     transform: rotateY(180deg)
    }
    #back {
      background:#ffe001 url("${IMG_URL}");
      background-position: center center;
      background-size:50%;
      background-repeat: no-repeat;
      display: inline-block;
    }
    slot{
      width:100%;
      height:100%;
      display:flex;
      justify-content:center;
      align-items:center;
    }
    slot>* {
        max-width: 80%;
        max-height: 80%;
    }
    ::slotted(img) {
        max-width: 80%;
        max-height: 80%;
    }
</style>
<button part='tile-main' id='tile'>
<div part='tile-front' id='front'>
  <slot></slot>
</div>
<div part='tile-back' id='back'></div>
</button>
`

customElements.define(
  'my-flipping-tile',
  /**
   * Representing a flipping tile.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' }).appendChild(
        template.content.cloneNode(true)
      )

      // Get the tile element in the shadow root.
      this._tile = this.shadowRoot.querySelector('#tile')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['face-up', 'disabled', 'hidden']
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.addEventListener('click', this._onClick)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.removeEventListener('click', this._onClick)
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'disabled' || name === 'hidden') {
        // Determine if the disabled attribute should be present or absent.
        const isPresent = Boolean(newValue) || newValue === ''
        // disable the tile both when hidden or disabled
        if (isPresent) {
          this._tile.setAttribute('disabled', '')
          this.blur()
        } else {
          this._tile.removeAttribute('disabled')
        }
      }
    }

    /**
     * Specifies whether this instance contains the same content as another tile.
     *
     * @param {*} other - The tile to test for equality
     * @returns {boolean} true if other has the same content as this tile instance.
     */
    isEqual (other) {
      return this.isEqualNode(other)
    }

    /**
     * Handles click events.
     *
     * @param {MouseEvent} event - The mouse event.
     */
    _onClick (event) {
      // Flip if main button, no other button and key pressed.
      //! event.buttons means that the only primary button is pressed so the value is 1

      if (
        (event.button === 0 &&
          event.buttons < 2 &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey)
      ) {
        this._flip()
      }
    }

    /**
     * Flips the current instance, if it is not disabled.
     */
    _flip () {
      if (this.hasAttribute('hidden') || this.hasAttribute('disabled')) {
        return
      }

      // toggle the face-up attribute
      this.hasAttribute('face-up')
        ? this.removeAttribute('face-up')
        : this.setAttribute('face-up', '')

      // create a custom element
      const myCustomEventListner = new CustomEvent('tileflip', {
        bubbles: true,
        detail: { faceUp: this.hasAttribute('face-up') }
      })
      // trigger the event
      this.dispatchEvent(myCustomEventListner)
    }
  }
)
