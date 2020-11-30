# &lt;my-flipping-tile&gt;
A webcomponent that represent a tile with two faces. the tile has a 3D-effect when flipping.

## Attributes

### `face-up`
A Boolean attribute; that, if specified means that the tile will show its front face.

Default value: false

### `disabled`
A Boolean attribute which, if present, indicates that the user should not be able to interact with the element.The tile will appear with dashed border around and you won't be able to flip it.

Default value: false

### `hidden`
A Boolean attribute; that, if specified means that the tile will appear empty on both faces

Default value: false


## Methods

### `isEqual (other)`
A method that when called will compare the current node with the node sent as a parameter.

Parameters: `other` a node to compare

Returns: Boolean(true/false).


## slots
the component accepts an unnamed slot and place it in the front face of the tile 


## Events
| Event Name | Fired When |
|------------|------------|
| 'tileflip'| The tile is flipped.

## Styling with CSS
The tile (button) is styleable using the part `tile-main`
The front face of the tile (div) is styleable using the part `tile-front`
The back face of the tile (div) is styleable using the part `tile-back`


## Examples

To use:

## In HTML
Add the module using the script tag in the head-element:
```HTML
<script type="module" src="js/components/my-flipping-tile/index.js"></script>
```

Add the element to the html:
```HTML
<my-flipping-tile></my-flipping-tile>
```

## In Javascript
Load the module
```Javascript
import './components/my-flipping-tile'
```
Create a component using the standard DOM-api:
```Javascript
const tile = document.createElement('my-flipping-tile')

![Example of the functions of my-flipping-tile](./example.gif)