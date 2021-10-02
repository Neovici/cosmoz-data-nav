import { component, html, useCallback, useEffect, useMemo, useRef, useState } from 'haunted';
import { slideInRight, slideInLeft } from '../../lib/next/animations';
import '../../cosmoz-data-nav-next';

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
	useDataNavList2 = items => {
		const
			[state, setState] = useState({ index: 0, prevIndex: 0 }),
			index = Math.max(0, Math.min(items.length - 1, state.index));

		return {
			index,
			item: items[index],
			animation: useMemo(() => state.index > state.prevIndex ? slideInRight : slideInLeft, [state]),
			prev: useCallback(() => setState(state => ({ index: Math.max(0, state.index - 1), prevIndex: state.index })), []),
			next: useCallback(() => setState(state => ({ index: Math.min(items.length - 1, state.index + 1), prevIndex: state.index })), [items.length]),
			first: index === 0,
			last: index === items.length - 1
		};
	},
	useDataNavList = items => {
		const
			state = useRef({ prevIndex: 0 }),
			[item, setItem] = useState(items[0]),
			index = useMemo(() => items.indexOf(item), [items, item]);

		useEffect(() => setItem(item => {
			state.current.prevIndex = index;
			return items.indexOf(item) >= 0 ? item : items[0];
		}), [items]);

		return {
			index,
			item,
			animation: index > state.current.prevIndex ? slideInRight : slideInLeft,
			prev: useCallback(() => {
				state.current.prevIndex = index;
				setItem(items[Math.max(0, Math.min(items.length - 1, index - 1))]);
			}, [items, index]),
			next: useCallback(() => {
				state.current.prevIndex = index;
				setItem(items[Math.max(0, Math.min(items.length - 1, index + 1))]);
			}, [items, index]),
			first: index === 0,
			last: index === items.length - 1
		};
	},
	DemoNext = () => {
		const
			[items, setItems] = useState(initItems),
			{ item, animation, prev, next, first, last } = useDataNavList(items),
			addItem = () => setItems(items => [...items, { id: items.length + 1, pic: 'https://picsum.photos/1200/300?random=' + (items.length + 1) }]),
			resetItems = () => setItems(initItems),
			render = useMemo(() => renderSlide(item), [item]);

		return html`
		<style>
			cosmoz-data-nav-next {
				width: 100vw;
				height: 500px;
				background: lightgray;
			}
		</style>

		<cosmoz-data-nav-next .render=${ render } .animation=${ animation }></cosmoz-data-nav-next>
		<button @click=${ prev } ?disabled=${ first }>Prev</button>
		<button @click=${ next } ?disabled=${ last }>Next</button>
		<button @click=${ addItem }>Add item</button>
		<button @click=${ resetItems }>Reset items</button>
	`;
	};

customElements.define('cosmoz-demo-next', component(DemoNext));

