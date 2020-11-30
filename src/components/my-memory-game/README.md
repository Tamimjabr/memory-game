# &lt;my-memory-game&gt;
A web component that represents a memory game.

## Attributes

### `boardsize`

The `boardsize` attribute, if present, specifies the size of the grid. Its value must be `large` (4x4), `medium` (4x2) or `small` (2x2).

Default value: large

## Events

| Event Name      | Fired When                        |
| --------------- | --------------------------------- |
| `tilesmatch`    | The tiles facing up match.        |
| `tilesmismatch` | The tiles facing up do not match. |
| `gameover`      | The game is over.                 |

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



