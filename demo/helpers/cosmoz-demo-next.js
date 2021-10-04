import { component, html, useState } from 'haunted';
import '../../cosmoz-data-nav-next';
import { useDataNavList } from '../../lib/next/use-data-nav-list';

const
	renderSlide = item => () => html`
		<h1>my slide ${ item.id }</h1>
		<img src="${ item.pic }" width="1200" height="300"
			style="background:gray;width:100%; height: auto;" />
	`,
	initItems = [
		{ id: 1, pic: 'https://picsum.photos/1200/300?random=1' },
		{ id: 2, pic: 'https://picsum.photos/1200/300?random=2' },
		{ id: 3, pic: 'https://picsum.photos/1200/300?random=3' },
		{ id: 4, pic: 'https://picsum.photos/1200/300?random=4' }
	],
	DemoNext = () => {
		const
			[items, setItems] = useState(initItems),
			{ index, render, animation, prev, next, first, last } = useDataNavList(items, renderSlide),
			addItem = () => setItems(items => [...items, { id: items.length + 1, pic: 'https://picsum.photos/1200/300?random=' + (items.length + 1) }]),
			resetItems = () => setItems(initItems),
			shuffleItems = () => setItems(items => items.concat().sort(() => Math.random() > 0.5 ? 1 : -1)),
			updateItem = () => setItems(items => items.map((i, index) => index === 0 ? {...i, pic: 'https://picsum.photos/1200/300?random='+Math.random()} : i ));

		return html`
		<style>
			cosmoz-data-nav-next {
				width: 100vw;
				height: 500px;
				background: lightgray;
			}
		</style>

		<cosmoz-data-nav-next .render=${ render } .animation=${ animation }></cosmoz-data-nav-next>
		${ index + 1 } / ${ items.length }
		<button @click=${ prev } ?disabled=${ first }>Prev</button>
		<button @click=${ next } ?disabled=${ last }>Next</button>
		<button @click=${ addItem }>Add item</button>
		<button @click=${ resetItems }>Reset items</button>
		<button @click=${ shuffleItems }>Shuffle items</button>
		<button @click=${ updateItem }>Update item</button>
	`;
	};

customElements.define('cosmoz-demo-next', component(DemoNext));

