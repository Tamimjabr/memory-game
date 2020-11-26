# &lt;my-memory-game&gt;

A web component that represents a memory game.

## Attributes

### `boardsize`

The `boardsize` attribute, if present, specifies the size of the grid. Its value must be `large` (4x4), `medium` (4x2) or `small` (2x2).

Default value: large

## Methods

### `_init () `
A method that initializes the game board size and tiles.

Parameters:-

Returns: -

### `_onTileFlip (event)`
A method that handles flip events.

Parameters: event - The custom event.

Returns: -

### `_onDragStart (event)`
A method that handles drag start events. This is needed to prevent the dragging of tiles.

Parameters: event - The drag event.

Returns: -

### `_handleMismatch (event)`
A method that handles tilesmismatch events.

Parameters: event - The custom event.

Returns: -

### `_handleMatch (event)`
A method that handles tilesmatch events.

Parameters: event - The custom event.

Returns: -

### `_clickLargeBtn (event)`
A method that handles click on "Large" button.

Parameters: event - The custom event.

Returns: -
### `_clickMediumBtn (event)`
A method that handles click on "Medium" button.

Parameters: event - The custom event.

Returns: -
### `_clickSmallBtn (event)`
A method that handles click on "Small" button.

Parameters: event - The custom event.

Returns: -


### `_upgradeProperty (prop)`
A method that run the specified instance property through the class setter.

Parameters: prop - a The property's name.

Returns: -

## Events

| Event Name      | Fired When                        |
| --------------- | --------------------------------- |
| `tilesmatch`    | The tiles facing up match.        |
| `tilesmismatch` | The tiles facing up do not match. |
| `gameover`      | The game is over.                 |
| `click`         | Click on "Play again" button.     |
| `click`         | Click on "Large" button.          |
| `click`         | Click on "Medium" button.         |
| `click`         | Click on "Small" button.          |

## Examples

To use:

## In HTML
Add the module using the script tag in the head-element:
```HTML
  <script type="module" src="js/components/my-memory-game/my-memory-game.js"></script>
```

Add the element to the html:
```HTML
<my-memory-game></my-memory-game>
```

## In Javascript
Load the module
```Javascript
import './components/my-memory-game'
```
Create a component using the standard DOM-api:
```Javascript
const memoryGame = document.createElement('my-memory-game')

![Example](./.readme/example.gif)

## Example

```html
<my-memory-game></my-memory-game>
</my-memory-gam>
```


