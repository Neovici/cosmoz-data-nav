/* eslint-disable max-lines */
import { render } from 'lit-html';

import { PolymerElement } from '@polymer/polymer/polymer-element';
import { html } from '@polymer/polymer/lib/utils/html-tag';
import { templatize } from '@polymer/polymer/lib/utils/templatize';

import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer';

import { Debouncer } from '@polymer/polymer/lib/utils/debounce';
import { animationFrame } from '@polymer/polymer/lib/utils/async';
import { flush } from '@polymer/polymer/lib/utils/flush';

import { hauntedPolymer } from '@neovici/cosmoz-utils';

import { useDataNav } from './lib/use-data-nav.js';

const _async = window.requestIdleCallback || window.requestAnimationFrame || window.setTimeout,
	_hasDeadline = 'IdleDeadline' in window,
	_asyncPeriod = (cb, timeout = 1500) => {
		_async(() => cb(), _hasDeadline && { timeout });
	},

	hashUrl = () => new URL(location.hash.replace(/^#!?/iu, '').replace('%23', '#'), location.origin),
	getHashParam = param => new URLSearchParams(hashUrl().hash.replace('#', '')).get(param),
	setHashParam = (param, value) => {
		const
			url = hashUrl(),
			searchParams = new URLSearchParams(url.hash.replace('#', ''));

		searchParams.set(param, value);

		const newUrl = '#!' + Object.assign(url, { hash: searchParams }).href.replace(location.origin, '');

		history.replaceState(null, '', newUrl);
	};

class CosmozDataNav extends hauntedPolymer('haunted', useDataNav)(PolymerElement) {
	static get template() { // eslint-disable-line max-lines-per-function
		return html`
			<style>
				:host {
					position: relative;
				}

				#items {
					overflow-x: hidden;
				}

				#items,
				#items > ::slotted(.animatable) {
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
				}
				:host([animating]) #items > ::slotted(.animatable){
					transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0s;
					backface-visibility: hidden;
				}

				:host([animating][reverse]) #items > ::slotted(.in),
				:host([animating]) #items > ::slotted(.out){
					transform: translateX(-100%);
				}

				:host([animating][reverse]) #items > ::slotted(.out),
				:host([animating]) #items > ::slotted(.in){
					transform: translateX(100%);
				}

				:host([has-items][animating]) #items > ::slotted(:not(.selected):not(.out)),
				:host([has-items]:not([animating])) #items > ::slotted(:not(.selected)),
				:host(:not([has-items])) #items > ::slotted(:not(:first-of-type)){
					display: none;
				}
			</style>
			<div id="items">
				<slot name="items"></slot>
			</div>
			<div id="templates">
				<slot id="templatesSlot"></slot>
			</div>
		`;
	}

	static get properties() { // eslint-disable-line max-lines-per-function
		return {
			/**
			 * The array of buffer elements.
			 */
			_elements: {
				type: Array,
				value() {
					return [];
				}
			},

			/**
			 * The name of the variable to add to the binding scope for the array
			 * element associated with a template instance.
			 */
			as: {
				type: String,
				value: 'item'
			},

			/**
			 * The name of the variable to add to the binding scope with the index
			 * for the item.
			 */
			indexAs: {
				type: String,
				value: 'index'
			},

			/**
			 * An array containing items from which a selection can be made.
			 */
			items: {
				type: Array,
				value() {
					return [];
				},
				notify: true,
				observer: '_itemsChanged'
			},

			/**
			 * The length of items array.
			 */
			queueLength: {
				type: Number,
				notify: true,
				readOnly: true
			},

			hasItems: {
				type: Boolean,
				readOnly: true,
				reflectToAttribute: true
			},

			elementsBuffer: {
				type: Number,
				value: 3
			},

			/**
			 * Number of items after the currently selected one to preload.
			 */
			preload: {
				type: Number,
				value: 1
			},

			renderItem: {
				type: Function
			},

			/**
			 * The currently selected index.
			 */
			selected: {
				type: Number,
				value: 0,
				notify: true,
				observer: '_updateSelected'
			},

			/**
			 * The index of the next element.
			 */
			selectedNext: {
				type: Number,
				notify: true,
				value: 1,
				readOnly: true
			},

			/**
			 * The currently selected element (holder)
			 */
			selectedElement: {
				type: Object,
				notify: true,
				readOnly: true
			},

			/**
			 * The currently selected element (instance)
			 */
			selectedInstance: {
				type: Object,
				notify: true,
				readOnly: true
			},

			/**
			 * The currently selected item, or `null` if no item is selected.
			 */
			selectedItem: {
				type: Object,
				notify: true,
				readOnly: true,
				computed: '_getItem(selected, items.*)'
			},

			/**
			 * True if cosmoz-data-nav should try to maintain selection when
			 * `items` change.
			 */
			maintainSelection: {
				type: Boolean,
				value: false
			},

			/**
			 * The attribute that elements which control the `selected` of this element
			 * should have. The value of the attribute can be `-1` or `+1`.
			 */
			selectAttribute: {
				type: String,
				value: 'cosmoz-data-nav-select'
			},

			/**
			 *	True if the element is currently animating.
			 */
			animating: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			/**
			 * True if selecting a element with a index smaller than the current one.
			 */
			reverse: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			/**
			 * Function used to determine if a item is incomplete and needs to be preloaded.
			 * The default values is a function that requires item to be a `Object`.
			 */
			isIncompleteFn: {
				type: Function,
				value() {
					return item => item == null || typeof item !== 'object';
				}
			},

			/**
			 * The hash parameter to use for selecting an item.
			 */
			hashParam: {
				type: String
			},

			/**
			 *
			 */
			idPath: {
				type: String,
				value: 'id'
			},

			/**
			 * True if element should render items even if it is not visible.
			 */
			hiddenRendering: {
				type: Boolean,
				value: false
			},

			/**
			 * Whether we should request data for all preloaded items at once or one at a time
			 */
			parallelDataRequests: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			'renderIncomplete(selected, haunted)'
		];
	}

	renderIncomplete(index, haunted) {
		if (haunted == null) {
			return;
		}

		const position = index < this.items.length ? index : index - 1,
			element = this._getElement(position),
			item = this.items[position];

		if (element == null || !this.isIncompleteFn(item)) {
			return;
		}
		render(haunted.incompleteTemplates[position], element.__incomplete);
	}

	constructor() {
		super();
		this._previouslySelectedItem = null;
		this._preloadIdx = 0;
		this._boundOnTemplatesChange = this._onTemplatesChange.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		this._templatesObserver = new FlattenedNodesObserver(
			this.$.templatesSlot,
			this._boundOnTemplatesChange
		);
		this.addEventListener('tap', this._onTap);
		this.addEventListener('transitionend', this._onTransitionEnd);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._templatesObserver) {
			this._templatesObserver.disconnect();
			this._templatesObserver = null;
		}

		if (this._selectDebouncer != null) {
			this._selectDebouncer.cancel();
		}

		this._previouslySelectedItem = null;
		this._indexRenderQueue = [];
		this.removeEventListener('tap', this._onTap);
		this.removeEventListener('transitionend', this._onTransitionEnd);

		this.splice('_elements', 0, this._elements.length, this._createElement())
			.forEach(element => {
				if (this.renderItem) {
					element.removeChild(element.__instance);
				} else {
					this._removeInstance(element.__instance);
				}
				element.removeChild(element.__incomplete);
				element.__instance = element.__incomplete = null;
			});
	}

	_onTemplatesChange(change) {
		if (!this._elementTemplate && !this.renderItem) {
			const templates = change.addedNodes.filter(n => n.nodeType === Node.ELEMENT_NODE && n.tagName === 'TEMPLATE'),
				elementTemplate = templates[0];

			if (!elementTemplate) {
				// eslint-disable-next-line no-console
				console.warn('cosmoz-data-nav requires a template');
				return;
			}
			this._templatize(elementTemplate);
		}

		const elements = this._elements,
			length = elements.length;

		this.splice('_elements', -1, 0, ...Array(this.elementsBuffer - length)
			.fill().map(this._createElement, this));

		elements.forEach(el => this.appendChild(el));
	}

	_templatize(elementTemplate) {
		this._elementTemplate = elementTemplate;

		const baseProps = {
			prevDisabled: true,
			nextDisabled: true,
			[this.indexAs]: true
		};
		this._elementCtor = templatize(this._elementTemplate, this, {
			instanceProps: Object.assign({ [this.as]: true }, baseProps),
			parentModel: true,
			forwardHostProp: this._forwardHostProp,
			notifyInstanceProp: this._notifyInstanceProp
		});
	}

	get _allElementInstances() {
		return this._elements
			.map(e => e.__instance)
			.filter(i => i != null);
	}

	_forwardHostProp(prop, value) {
		const instances = this._allElementInstances;
		if (!instances || !instances.length) {
			return;
		}
		instances.forEach(inst => inst.forwardHostProp(prop, value));
	}

	_notifyInstanceProp(inst, prop, value) {
		const index = inst.index,
			item = this.items[index];
		if (prop !== this.as || value === item || this._allElementInstances.indexOf(inst) < 0) {
			return;
		}
		this.haunted.cache.dropItem(item);
		this.set(['items', index], value);
	}

	_createElement() {
		const element = document.createElement('div'),
			incDiv = document.createElement('div');
		element.appendChild(incDiv);
		element.__incomplete = incDiv;
		if (this.renderItem) {
			const instDiv = document.createElement('div');
			element.appendChild(instDiv);
			element.__instance = instDiv;
		}
		element.setAttribute('slot', 'items');
		element.classList.add('animatable');
		return element;
	}

	/**
	 * Selects an item by index.
	 *
	 * @param	 {Number} index The index
	 * @return {void}
	 */
	select(index) {
		const length = this.items && this.items.length;
		if (!length || index < 0 || index >= length) {
			return;
		}
		this.reverse = index < this.selected;
		this.selected = index;
	}

	/**
	 * Replace an id in the `items` element list with the full data of the item.
	 *
	 * @param	 {type} id		 The id currently stored in the `items` array
	 * @param	 {Object} item The full data of object
	 * @return {void}
	 */
	setItemById(id, item) {
		const items = this.items,
			matches = items.filter(item => this._getItemId(item) === id);

		if (matches.length === 0) {
			// eslint-disable-next-line no-console
			console.warn('List item replacement failed, no matching idPath', this.idPath, 'with id', id, 'in the item list', items, 'to replace with item', item);
			return;
		} else if (matches.length > 1) {
			// eslint-disable-next-line no-console
			console.warn('Multiple replaceable items matches idPath', this.idPath, 'with id', id, 'in the item list', items, 'to replace with item', item);
		}

		this.haunted.cache.set(id, item);
		matches.forEach(match => this.set(['items', items.indexOf(match)], { ...item }));

		this._preload();

		if (this.animating || this.selected == null) {
			return;
		}

		this._updateSelected();
	}

	/**
	 * Observes full changes to `items` properties
	 * and replaces cached items with full data if available.
	 *
	 * @param	 {type} items description
	 * @return {type}				description
	 */
	_itemsChanged(items) { // eslint-disable-line max-statements
		const length = items && items.length;

		// update read-only properties
		this._setQueueLength(length >> 0); // eslint-disable-line no-bitwise
		this._setHasItems(!!length);

		// replace incomplete items with cached item data
		if (length) {
			items.forEach((item, index) => {
				if (this.isIncompleteFn(item)) {
					const cachedItem = this.haunted?.cache?.get(item);
					if (cachedItem) {
						this.set(['items', index], cachedItem);
					}
				}
			});
		}

		// synchronize `selected` with hash params
		if (this._updateSelectedFromHash()) {
			return;
		}

		// reset queue to 0 or maintain selection
		let index = 0;
		if (items.length > 0 && this.maintainSelection && this._previouslySelectedItem != null) {
			// search for previously selected item by reference
			index = items.indexOf(this._previouslySelectedItem);

			// if not found, search by id
			if (index < 0) {
				const prevId = this._getItemId(this._previouslySelectedItem);
				index = items.findIndex(item => this._getItemId(item) === prevId);
			}

			// if still not found, remain on the selected index
			if (index < 0) {
				index = this.selected < items.length
					? this.selected
					: items.length - 1;
			}
			this._realignElements(index);
		}
		// update selected or force re-render if selected did not change
		if (this.selected === index) {
			return this._updateSelected();
		}
		this.selected = index;
		return index;
	}

	_realignElements(index) { // eslint-disable-line max-statements
		const elements = this._elements,
			element = this._getElement(index),
			item = this.items[index];
		if (this.isIncompleteFn(item) || element.item === item) {
			return;
		}
		const renderedElement = this._elements.find(el => !this.isIncompleteFn(el.item) && this._getItemId(el.item) === this._getItemId(item));
		if (!renderedElement) {
			return;
		}
		const elementIndex = elements.indexOf(element),
			renderedIndex = elements.indexOf(renderedElement);
		if (elementIndex === renderedIndex) {
			return;
		}

		if (!this.renderItem) {
			// update instance's data-nav related props
			const instance = renderedElement.__instance;
			Object.entries(this._getBaseProps(index))
				.forEach(([key, value]) => instance._setPendingProperty(key, value));
			instance._flushProperties();
		}
		this._elements.splice(renderedIndex, 1);
		this.splice('_elements', elementIndex, 0, renderedElement);
	}

	/**
	 * Observes changed to `selected` property and
	 * updates related properties and the `selected` page.
	 *
	 * @param	 {Number} selected The selected property
	 * @param	 {Number} previous The previous value of selected property
	 * @return {void}
	 */
	_updateSelected(selected = this.selected, previous) { // eslint-disable-line max-statements
		if (this.items.length === 0) {
			return;
		}
		const position = selected < this.items.length ? selected : selected - 1;
		this._setSelectedNext((position || 0) + 1);
		this._preload(position);
		this._previouslySelectedItem = this.items[position];

		const element = this._getElement(position);

		if (!element) {
			return;
		}

		this._setSelectedElement(element);
		this._setSelectedInstance(this._getInstance(element));

		this._updateHashForSelected(position);

		const classes = element.classList,
			animating = this.animating && previous != null && previous !== position;

		if (!animating) {
			this._elements.forEach(el => el.classList.remove('selected'));
		}

		classes.toggle('in', animating);
		classes.add('selected');

		if (!animating) {
			if (this.isConnected) {
				this._synchronize();
			}
			return;
		}

		const prev = animating && this._getElement(previous);

		requestAnimationFrame(() => {
			if (prev && element.offsetWidth) {
				prev.classList.add('out');
				prev.classList.remove('selected');
			}
			classes.remove('in');
		}, 8);
	}

	/**
	 * Handles `transitionend` event and cleans up animation classe and properties
	 *
	 * @param	 {TransitionEvent} e The event
	 * @return {void}
	 */
	_onTransitionEnd(e) {
		const elements = this._elements;

		if (!this.animating || elements.indexOf(e.target) < 0) {
			return;
		}

		this.animating = false;
		elements.forEach(el => el.classList.remove('in', 'out'));
		this._synchronize();
	}

	/**
	 * Preloads items that are not loaded depending on the currently
	 * selected item and the `preload` property.
	 *
	 * @fires need-data
	 * @param	 {Number} index The index to preload from
	 * @return {void}
	 */
	_preload(index = this._preloadIdx) {
		const items = this.items;

		if (!Array.isArray(items) || items.length === 0) {
			return;
		}

		const item = items[index];

		if (this.isIncompleteFn(item)) {
			this.dispatchEvent(new CustomEvent('need-data', {
				bubbles: true,
				composed: true,
				detail: {
					id: item,
					render: true
				}
			}));
			if (!this.parallelDataRequests) {
				return;
			}
		}

		if (index >= Math.min(this.selected + this.preload, items.length - 1)) {
			return;
		}

		this._preloadIdx = index + 1;
		this._preload();
	}

	_getBaseProps(index) {
		return {
			prevDisabled: index < 1,
			nextDisabled: index + 1 >= this.items.length,
			[this.indexAs]: Math.max(Math.min(index, this.items.length - 1), 0)
		};
	}

	_getElement(index, _elements = this._elements) {
		const elements = _elements && _elements.base || _elements,
			bufferLength = this.elementsBuffer || elements.length,
			elementIndex = index % bufferLength;

		return elements[elementIndex];
	}

	_getInstance(selectedElement) {
		if (selectedElement == null) {
			return;
		}
		// return reference to the rendered template instance or the incomplete template if missing
		return selectedElement.children[1] || selectedElement.__incomplete;
	}

	_getItem(index, items = this.items) {
		const arr = items.base ? items.base : items;
		return arr[index];
	}

	_resetElement(index) { // eslint-disable-line max-statements
		const element = this._getElement(index);
		if (!element) {
			return;
		}

		const item = this.items[index],
			baseProps = this._getBaseProps(index),
			instance = element.__instance;

		if (!this.renderItem && instance) {
			Object.assign(instance, baseProps);
		}

		if (!this.isIncompleteFn(item) && element.item === item) {
			return;
		}

		if (element._reset) {
			return;
		}
		element._reset = true;
		element.__incomplete.style.display = 'block';

		if (!instance) {
			return;
		}

		this._toggleInstance(instance, false);
	}

	_removeInstance(instance) {
		if (!instance) {
			return;
		}
		instance.children.forEach(child => child.parentNode.removeChild(child));
	}

	/**
	* Syncronizes the `items` data with the created template instances
	* depending on the currently selected item.
	* @return {type}	description
	*/
	_synchronize() {
		const selected = this.selected,
			buffer = this.elementsBuffer,
			offset = buffer / 2 >> 0, // eslint-disable-line no-bitwise
			max = Math.max,
			min = Math.min,
			length = this.items.length,

			start = min(max(selected - offset, 0), length ? length - buffer : 0),
			end = max(min(selected + offset, length ? length - 1 : 0), buffer - 1),
			indexes = Array(end + 1)
				.fill()
				.map((u, i) => i)
				.slice(start >= 0 ? start : 0);

		// Reset items
		indexes.forEach(i => this._resetElement(i));
		this._indexRenderQueue = indexes;
		_asyncPeriod(this._renderQueue.bind(this));

	}

	/**
	 * Handle `tap` event and finds the closest item to the rootTarget that has a `selectAttribute` attribute.
	 * If the attribute is `next` or `previous` the `selectNext` or `selectPrevious` action is called.
	 *
	 * @param	 {Event} event The tap event
	 * @return {void}
	 */
	_onTap(event) {
		if (this.animating) {
			return;
		}
		const path = event.composedPath(),
			attr = this.selectAttribute,
			selectEl = path.find(e => e && e.hasAttribute && e.hasAttribute(attr));

		if (!selectEl) {
			return;
		}
		const inBetween = path.slice(path.indexOf(selectEl)),
			ancestorNav = inBetween.find(e => e && e.tagName === this.tagName);

		if (ancestorNav !== this) {
			return;
		}

		const select = parseInt(selectEl.getAttribute(attr), 10);

		if (isNaN(select)) {
			return;
		}
		this._selectDebouncer = Debouncer.debounce(this._selectDebouncer,
			animationFrame,
			() => {
				this.animating = true;
				this.select(this.selected + select);
			}
		);
	}

	/**
	* True if the current element is visible.
	*/
	get _isVisible() {
		return Boolean(this.offsetWidth || this.offsetHeight);
	}

	/**
	 * Select item by id.
	 *
	 * @deprecated
	 * @param	 {String|Number} id The item's id
	 * @return {void}
	 */
	selectById(id) {
		for (let index = 0; index < this.items.length; index++) {
			const item = this.items[index];
			if (typeof item === 'object' && item.id === id || item === id) {
				this.selected = index;
				return;
			}
		}
	}

	_forwardItem(element, item, idx) {
		this._removeInstance(element.__instance);
		flush();

		const props = Object.assign({ [this.as]: item }, this._getBaseProps(idx)),
			instance = new this._elementCtor(props);

		element.__instance = instance;
		element.appendChild(instance.root);
	}

	_renderQueue() {
		if (!this.isConnected) {
			return;
		}
		const queue = this._indexRenderQueue;

		if (!Array.isArray(queue) || queue.length < 1) {
			// no tasks in queue
			return;
		}

		if (this.animating) {
			// will be re-run on transition end
			return;
		}

		if (this.hiddenRendering || this._isVisible) {

			this._renderRan = this._renderAbort = false;

			this._indexRenderQueue = queue
				.sort((a, b) => {
					if (a === this.selected) {
						return -1;
					}
					if (b === this.selected) {
						return 1;
					}
					return 0;
				})
				.map(this._renderQueueProcess, this)
				.filter(idx => idx != null);

			if (this._renderAbort || this._indexRenderQueue.length === 0) {
				return;
			}
		}

		_asyncPeriod(this._renderQueue.bind(this));
	}

	_renderQueueProcess(idx) { // eslint-disable-line max-statements
		const element = this._getElement(idx),
			item = this.items[idx];

		if (this.isIncompleteFn(item)) {
			element.item = false;
			// no data for item drop task from queue
			return;
		}

		if (this._renderRan) {
			// one render per run
			// maintain task in queue
			return idx;
		}
		element.__incomplete.style.display = 'none';

		const isSelected = idx === this.selected,
			needsRender = element.item !== item || (this.renderItem && element.ilen !== this.items?.length);

		this._renderRan = needsRender;

		if (needsRender) {
			element.item = item;
			element._reset = false;
			if (this.renderItem) {
				render(this.renderItem(item, idx, this.items), element.__instance);
				this._toggleInstance(element.__instance, true);
				element.ilen = this.items?.length
				return;
			}
			this._forwardItem(element, item, idx);
			if (isSelected) {
				return idx;
			}
		} else if (isSelected) {
			// make sure that the instance is visible (may be a re-aligned invisible instance)
			this._toggleInstance(element.__instance, true);
			this._renderRan = true;
			this._setSelectedInstance(this._getInstance(element));
		}
	}

	_toggleInstance(inst, show) {
		if (this.renderItem) {
			inst.style.display = show ? 'contents' : 'none';
			return;
		}
		inst?._showHideChildren(!show);
	}

	_getItemId(item) {
		return this.isIncompleteFn(item) ? item : this.get(this.idPath, item);
	}

	_updateHashForSelected(selected) {
		const hashParam = this.hashParam,
			idPath = this.idPath;

		if (!hashParam || !idPath || !this.items.length) {
			return;
		}

		const item = this.items[selected];
		if (item == null) {
			return;
		}
		const itemId = this._getItemId(item),
			hashValue = getHashParam(hashParam);

		if (itemId === hashValue) {
			return;
		}

		setHashParam(hashParam, itemId);
	}

	_updateSelectedFromHash() {
		const hashParam = this.hashParam,
			idPath = this.idPath;

		if (!(hashParam && idPath)) {
			return;
		}

		if (this._readFromHashOnce && !this.maintainSelection) {
			return;
		}

		const hashValue = getHashParam(hashParam);

		if (!hashValue) {
			this._readFromHashOnce = true;
			return;
		}

		const selection = this.items.findIndex(i => this._getItemId(i) === hashValue);

		if (selection < 0 || selection === this.selected) {
			return;
		}
		this._readFromHashOnce = true;
		this.selected = selection;
		return true;
	}

}
customElements.define('cosmoz-data-nav', CosmozDataNav);
