import {
	component, html, useState, useEffect
} from 'haunted';
import '@polymer/paper-input/paper-textarea.js';
import './helpers/cosmoz-demo-view.js';
import '../cosmoz-data-nav.js';

const asyncs = {},
	// eslint-disable-next-line max-lines-per-function
	DataNavDemo = function () {

		const
			makeItems = () => Array(20).fill('').map((e, i) => i.toString()),
			[items, setItems] = useState(makeItems()),
			[selected, setSelected] = useState(),
			[selItem, setSelItem] = useState(),
			[instance, setInstance] = useState(),
			onNeedData = event => {
				const id = event.detail.id,
					dataNav = event.target;
				if (asyncs[id]) {
					clearTimeout(asyncs[id]);
					asyncs[id] = null;
				}
				// eslint-disable-next-line no-console
				console.log('on need data', id);
				asyncs[id] = setTimeout(() => dataNav.setItemById(id, { id }), 500);
			},
			computeJSON = index => JSON.stringify(items[index]);

		useEffect(() => {
			if (instance?.dataset == null) {
				return;
			}
			instance.dataset.idx = selected % 3;
		}, [instance]);

		return html`
            <style>
                #container {
                    max-width: 800px;
                }
                cosmoz-data-nav {
                    display: block;
                    height: 400px;
                    position: relative;
                }
                cosmoz-demo-view {
                    display: flex;
                    flex-direction: column;
                }
                [data-idx="0"] {
                    background-color: blue;
                }
                [data-idx="1"] {
                    background-color: red;
                }
                [data-idx="2"] {
                    background-color: orange;
                }
            </style>
            <cosmoz-data-nav hash-param="tt"
                    .items="${ items }"
                    @need-data="${ onNeedData }"
                    @selected-changed="${ e => setSelected(e?.detail?.value) }"
                    @selected-item-changed="${ e => setSelItem(e?.detail?.value) }"
                    @selected-instance-changed="${ e => setInstance(e?.detail?.value) }"
            >
                <template>
                    <cosmoz-demo-view
                        item="{{ item }}" index="[[ index ]]"
                        prev-disabled="[[ prevDisabled ]]" next-disabled="[[ nextDisabled ]]">
                    </cosmoz-demo-view>
                </template>
            </cosmoz-data-nav>
            <paper-textarea value="${ computeJSON(selected) }"></paper-textarea>
            <div>Selected: ${ JSON.stringify(selItem) }</div>
            <button @click="${ () => setItems(makeItems()) }">Make new items</button>
        `;
	};

customElements.define('data-nav-demo', component(DataNavDemo));
