/* eslint-disable max-lines */
import { assert, fixture, html, oneEvent, waitUntil } from '@open-wc/testing';

import sinon from 'sinon';

import {
	defaultsFixture,
	flushRenderQueue,
	getItems,
	setupFixture,
	visibilityFixture,
} from './helpers/utils.js';

import '../cosmoz-data-nav.js';
import './helpers/cosmoz-data-nav-test-view.js';

sinon.assert.expose(assert, { prefix: '' });

suite('defaults', () => {
	let nav;

	suiteSetup(async () => {
		nav = await setupFixture();
	});

	test('creates buffer elements', () => {
		assert.lengthOf(nav._elements, nav.elementsBuffer);
	});

	test('has template for elements', () => {
		const template = nav.$.templatesSlot.querySelector('template');
		assert.equal(template, nav._elementsTemplate);
	});

	test('buffer elements have incomplete content', () => {
		nav._elements.forEach((element) => assert.isNotNull(element.__incomplete));
	});

	test('buffer elements are not templatized without complete data', () => {
		nav._elements.forEach((element) => assert.isUndefined(element.__instance));
	});

	test('selects first element', () => {
		assert.equal(nav.selected, 0);
		const selectedEl = nav._getElement(nav.selected);
		assert.include(nav._elements, selectedEl);
	});
});

suite('properties check', () => {
	let nav;

	suiteSetup(async () => {
		nav = await setupFixture();
	});

	test('selected property is updated', () => {
		nav.select(1);
		assert.equal(
			nav.selected,
			1,
			'Expected the index of selected item to be 1',
		);
		nav.select(3);
		assert.equal(
			nav.selected,
			3,
			'Expected the index of selected item to be 3',
		);
		nav.select(7);
		assert.equal(
			nav.selected,
			7,
			'Expected the index of selected item to be 7',
		);
		nav.select(2);
		assert.equal(
			nav.selected,
			2,
			'Expected the index of selected item to be 2',
		);
	});

	test('selectedNext is updated', () => {
		nav.select(13);
		assert.equal(nav.selectedNext, 14);
		nav.select(2);
		assert.equal(nav.selectedNext, 3);
		nav.select(7);
		assert.equal(nav.selectedNext, 8);
		nav.select(0);
		assert.equal(nav.selectedNext, 1);
	});

	test('queueLength returns the length of items array', () => {
		assert.equal(nav.queueLength, 20);
	});

	test('reverse property is working', () => {
		nav.select(5);
		assert.isFalse(nav.reverse);
		nav.select(15);
		assert.isFalse(nav.reverse);
		nav.select(5);
		assert.isTrue(nav.reverse);
		nav.select(2);
		assert.isTrue(nav.reverse);
		nav.select(3);
		assert.isFalse(nav.reverse);
	});
});

suite('duplicate ids', () => {
	let nav, warnSpy;

	suiteSetup(async () => {
		nav = await fixture(defaultsFixture);
		nav._templatesObserver.flush();
		const items = getItems();
		items[0] = '0';
		items[1] = '0';
		nav.items = items;
		warnSpy = sinon.spy(console, 'warn');
	});

	suiteTeardown(() => {
		warnSpy.restore();
	});

	test('setItemById handlers duplicate ids', (done) => {
		const data = { id: 0 },
			cache = nav.haunted.cache;
		nav.setItemById('0', data);
		sinon.assert.calledWith(
			warnSpy,
			'Multiple replaceable items matches idPath',
			'id',
			'with id',
			'0',
			'in the item list',
			nav.items,
			'to replace with item',
			{ id: 0 },
		);
		assert.equal(cache.get('0').id, data.id);
		assert.equal(nav.items[0].id, data.id);
		assert.equal(nav.items[1].id, data.id);
		done();
	});
});

suite('lacks template', () => {
	let warnSpy;

	suiteSetup(async () => {
		warnSpy = sinon.spy(console, 'warn');
		await fixture(html`<cosmoz-data-nav><b></b></cosmoz-data-nav>`);
	});

	test('data-nav warns about missing template', () => {
		sinon.assert.calledWith(warnSpy, 'cosmoz-data-nav requires a template');
	});

	suiteTeardown(() => {
		warnSpy.restore();
	});
});

suite('cache', () => {
	let nav;

	suiteSetup(async () => {
		nav = await fixture(defaultsFixture);
		nav._templatesObserver.flush();
	});

	setup(() => {
		nav.items = getItems();
	});

	teardown(() => {
		nav.haunted.cache.clear();
	});

	test('cache stores one item', () => {
		const cache = nav.haunted.cache;
		nav.setItemById('1', { id: 88 });
		assert.equal(cache.get('1').id, 88);
	});

	test('cache stores two items', () => {
		const cache = nav.haunted.cache;
		nav.setItemById('1', { id: 88 });
		nav.setItemById('2', { id: 99 });
		assert.equal(cache.get('1').id, 88);
		assert.equal(cache.get('2').id, 99);
	});

	test('haunted.cache.clear method works', () => {
		const cache = nav.haunted.cache;
		nav.setItemById('1', { id: 1 });
		nav.setItemById('2', { id: 2 });
		assert.equal(cache.get('1').id, 1);
		assert.equal(cache.get('2').id, 2);
		nav.haunted.cache.clear();
		assert.isUndefined(cache.get('1'));
		assert.isUndefined(cache.get('2'));
	});

	test('haunted.cache.dropItem method works', () => {
		const cache = nav.haunted.cache;
		nav.setItemById('1', { id: 88 });
		nav.setItemById('2', { id: 99 });
		nav.setItemById('3', { id: 11 });
		assert.equal(cache.get('1').id, 88);
		assert.equal(cache.get('2').id, 99);
		assert.equal(cache.get('3').id, 11);

		nav.haunted.cache.dropItem(cache.get('2'));
		assert.isUndefined(nav.haunted.cache.get('2'));
		nav.haunted.cache.dropItem(cache.get('1'));
		assert.isUndefined(nav.haunted.cache.get('1'));
	});

	test('haunted.cache.dropItem called with null or unknown item', () => {
		const cache = nav.haunted.cache;
		let cacheKeys;
		nav.setItemById('1', { id: 900 });
		assert.equal(cache.get('1').id, 900);

		cacheKeys = Object.keys(cache);
		nav.haunted.cache.dropItem(null);
		assert.equal(cacheKeys.length, Object.keys(cache).length);

		cacheKeys = Object.keys(cache);
		nav.haunted.cache.dropItem({});
		assert.equal(cacheKeys.length, Object.keys(cache).length);
	});
});

suite('other methods', () => {
	let nav;

	setup(async () => {
		nav = await setupFixture();
	});

	test('setItemById warns about a unknown item', () => {
		const warnSpy = sinon.spy(console, 'warn'),
			data = { id: 23 };
		nav.setItemById('23', data);
		sinon.assert.calledWith(
			warnSpy,
			'List item replacement failed, no matching idPath',
			'id',
			'with id',
			'23',
			'in the item list',
			nav.items,
			'to replace with item',
			data,
		);
		warnSpy.restore();
	});

	test('isIncompleteFn checks if an item is incomplete', () => {
		assert.isTrue(nav.isIncompleteFn());
		assert.isTrue(nav.isIncompleteFn(null));
		assert.isFalse(nav.isIncompleteFn({ id: '1' }));

		nav.setItemById('1', { id: 1 });
		assert.isTrue(nav.isIncompleteFn(nav.items[0]));
		assert.isFalse(nav.isIncompleteFn(nav.items[1]));
	});

	test('selectById updates selected property', () => {
		nav.setItemById('0', { id: 0 });
		nav.setItemById('14', { id: 14 });
		nav.setItemById('2', { id: 2 });
		nav.setItemById('9', { id: 9 });
		nav.setItemById('17', { id: 17 });
		nav.selectById(2);
		assert.equal(nav.selected, 2);
		nav.selectById(14);
		assert.equal(nav.selected, 14);
		nav.selectById(0);
		assert.equal(nav.selected, 0);
		nav.selectById(17);
		assert.equal(nav.selected, 17);
	});

	test('preloads data', async () => {
		nav.haunted.cache.clear();
		setTimeout(() => {
			nav.items = getItems();
		});
		let event = await oneEvent(nav, 'need-data');
		assert.equal(event.detail.id, '0');
		const data = { id: '0' };
		assert.isTrue(nav.isIncompleteFn(nav.items[0]));
		assert.isTrue(nav.isIncompleteFn(nav.items[1]));

		setTimeout(() => {
			nav.setItemById('0', data);
		});
		event = await oneEvent(nav, 'need-data');
		assert.equal(event.detail.id, '1');
		assert.isFalse(nav.isIncompleteFn(nav.items[0]));
		assert.isTrue(nav.isIncompleteFn(nav.items[1]));
		assert.deepEqual(nav.items[0], data);
	});
});

suite('navigation', () => {
	let nav;

	suiteSetup(async () => {
		nav = await setupFixture();
	});

	test('selects next item', async () => {
		nav.items = [0, 1];
		nav.setItemById('0', { id: 0 });
		nav.setItemById('1', { id: 1 });
		nav._renderQueue();
		nav._renderQueue();
		const firstElement = nav._getElement(0),
			instance = nav._getInstance(firstElement);
		let nextBtn;
		await waitUntil(() => {
			nextBtn = instance.querySelector('[cosmoz-data-nav-select="+1"]');
			return !!nextBtn;
		});
		nextBtn.click();
		await waitUntil(() => nav._selectDebouncer);
		assert.isOk(nav._selectDebouncer);
		nav._selectDebouncer.flush();

		assert.isTrue(nav.animating);
		assert.equal(nav.selected, 1);
		// wait for animation to end and check animating is false
		await oneEvent(nav, 'transitionend');
		assert.isFalse(nav.animating);
	});
});

suite('elements buffer', () => {
	let nav;

	setup(async () => {
		nav = await setupFixture(html`
			<cosmoz-data-nav elements-buffer="4">
				<template>
					<cosmoz-data-nav-test-view
						class="fit layout vertical"
						item="{{ item }}"
						index="[[ index ]]"
					></cosmoz-data-nav-test-view>
				</template>
			</cosmoz-data-nav>
		`);
	});

	test('elementsBuffer property updates _elements', () => {
		assert.equal(nav.elementsBuffer, 4);
		assert.equal(nav._elements.length, 4);
	});

	test('_createElement does not create element if length is equal to elementsBuffer', () => {
		assert.equal(nav.elementsBuffer, 4);
		assert.equal(nav._elements.length, 4);

		nav._createElement();
		assert.equal(nav._elements.length, 4);
	});

	test('_createElement returns new element', () => {
		const el = nav._createElement();
		assert.equal(el.classList[0], 'animatable');
	});
});

suite('renderQueue', () => {
	let nav;

	setup(async () => {
		[, nav] = await Promise.all([
			fixture(visibilityFixture),
			setupFixture(html`
				<cosmoz-data-nav elements-buffer="5">
					<template>
						<cosmoz-data-nav-test-view
							class="fit layout vertical"
							item="{{ item }}"
							index="[[ index ]]"
						></cosmoz-data-nav-test-view>
					</template>
				</cosmoz-data-nav>
			`),
		]);
	});

	test('selected instance notify prop', async () => {
		nav.items = [{ id: '0' }, { id: '0' }, { id: '0' }];
		nav._templatesObserver.flush();
		flushRenderQueue(nav);
		nav.selected = 1;
		const inst = nav.selectedInstance;
		inst.item = { ...inst.item };
	});

	test('renderQueue three items', async () => {
		nav._elements.forEach((element) => assert.isUndefined(element.__instance));
		nav.setItemById('0', { id: 0 });
		nav.setItemById('1', { id: 1 });
		nav.setItemById('2', { id: 2 });
		await waitUntil(() => nav._elements[2].__instance);
		assert.deepEqual(nav._elements[0].__instance.item, { id: 0 });
		assert.deepEqual(nav._elements[1].__instance.item, { id: 1 });
		assert.deepEqual(nav._elements[2].__instance.item, { id: 2 });
	});

	test('renderQueue five items', async () => {
		nav._elements.forEach((element) => assert.isUndefined(element.__instance));
		const ids = [0, 1, 2, 3, 4];
		ids.forEach((id) => {
			nav.setItemById(id.toString(), { id });
		});
		await waitUntil(() => nav._elements[4].__instance);
		assert.equal(nav._elements.length, 5);
		nav._elements.forEach((el, id) => {
			assert.deepEqual(el.__instance.item, { id });
		});
	});
});

suite('renderItem', () => {
	let nav,
		itemsRendered = 0;
	const renderItem = (item, index) => {
		itemsRendered += 1;
		return html`
			<cosmoz-data-nav-test-view
				class="fit layout vertical"
				item="${item}"
				index="${index}"
			>
			</cosmoz-data-nav-test-view>
		`;
	};

	suiteSetup(async () => {
		[, nav] = await Promise.all([
			fixture(visibilityFixture),
			setupFixture(html`
				<cosmoz-data-nav .renderItem="${renderItem}"> </cosmoz-data-nav>
			`),
		]);
	});

	test('renders items', async () => {
		nav.items = [{ id: '0' }, { id: '1' }, { id: '2' }];
		flushRenderQueue(nav);
		assert.equal(
			itemsRendered,
			nav.items.map(nav.isIncompleteFn).filter((i) => !i).length,
		);
	});
});
