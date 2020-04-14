/* eslint-disable max-lines-per-function, max-statements, max-nested-callbacks, strict */
import {
	expect, fixture, html, aTimeout, assert
} from '@open-wc/testing';

import '../cosmoz-data-nav.js';
import './helpers/cosmoz-data-nav-test-view.js';
import { Base } from '@polymer/polymer/polymer-legacy';
import {
	visibilityFixture, defaultsFixture, flushRenderQueue, selectedSlide, isVisible, setupFixture
} from './helpers/utils';

const oneRequestPerItem = async nav => {
	const needDataRequests = {};
	nav.addEventListener('need-data', async event => {
		const id = event.detail.id;
		if (!needDataRequests[id]) {
			needDataRequests[id] = 0;
		}
		needDataRequests[id] += 1;
		await aTimeout();
		nav.setItemById(id, { id });
	});
	nav._templatesObserver.flush();
	nav.items = ['0', '1', '2', '3'];
	await aTimeout();
	Object.entries(needDataRequests).forEach(([id, reqs]) => {
		assert.equal(reqs, 1, `requests for id ${ id }`);
	});
};

suite('bugs', () => {
	test('https://github.com/Neovici/cosmoz-data-nav/issues/84', async () => {
		const items = [
				{ id: 0 },
				{ id: 1 },
				{ id: 2 },
				{ id: 3 },
				{ id: 4 }
			],
			// initialize cosmoz-data-nav as hidden,
			// simulating the list-queue-core behavior
			nav = await fixture(html`
				<cosmoz-data-nav style="display: none">
					<template strip-whitespace>
						<div class="slide">
							<span>id: [[ item.id ]],</span>
							<span>index: [[ index ]]</span>
							<span>[[ item.data ]]</span>
							<input type="button" value="Next" cosmoz-data-nav-select="+1">
							<input type="button" value="Prev" cosmoz-data-nav-select="-1">
						</div>
					</template>
				</cosmoz-data-nav>
			`);
		nav._templatesObserver.flush();

		// the bug manifests when data is set as incomplete,
		// so we must set up the need-data handler
		const asyncs = {};
		nav.addEventListener('need-data', event => {
			const id = event.detail.id;
			if (!id) {
				return;
			}
			if (asyncs[id]) {
				Base.cancelAsync(asyncs[id]);
				asyncs[id] = null;
			}
			asyncs[id] = Base.async(() => {
				event.target.setItemById(id, items[id]);
			}, 0);
		});

		// the list page loads and sets all items as queued
		nav.items = [0, 1, 2, 3, 4];
		await aTimeout(30);

		// select an incomplete item
		nav.items = [2];
		// the need-data exchange will take place and make it "complete"
		await aTimeout(30);

		// select the now-complete item and another incomplete item,
		nav.items = [items[2], 3];
		await aTimeout(30);

		// switch to the queue tab, making it visible and turning 'maintain selection' on
		nav.maintainSelection = true;
		nav.style.display = 'block';
		flushRenderQueue(nav);

		// the view should be rendered correctly
		expect(isVisible(selectedSlide(nav))).to.be.true;
		expect(selectedSlide(nav).textContent).to.equal('id: 2,index: 0');

		// process the first item
		// thus removing it from the queue
		nav.items = [items[2], items[3]];
		nav.items = [items[3]];
		flushRenderQueue(nav);

		// the view should be rendered correctly
		expect(isVisible(selectedSlide(nav))).to.be.true;
		expect(selectedSlide(nav).textContent).to.equal('id: 3,index: 0');
	});

	test('https://github.com/Neovici/cosmoz-data-nav/issues/117', async () => {
		const nav = await fixture(defaultsFixture);
		nav.parallelDataRequests = true;
		try {
			await oneRequestPerItem(nav);
		} catch (e) {
			assert.equal(e.message, 'requests for id 1: expected 3 to equal 1');
			return;
		}
		assert.isTrue(false, 'bug fixed?');
	});

	test('https://github.com/Neovici/cosmoz-data-nav/issues/117', async () => {
		const nav = await fixture(defaultsFixture);
		try {
			await oneRequestPerItem(nav);
		} catch (e) {
			assert.equal(e.message, 'requests for id 1: expected 2 to equal 1');
			return;
		}
		assert.isTrue(false, 'bug fixed?');
	});

	test('selected instance not set', async () => {
		const [, nav] = await Promise.all([
			fixture(visibilityFixture),
			await setupFixture()
		]);
		nav.setItemById('0', { id: '0' });
		nav.setItemById('1', { id: '1' });
		flushRenderQueue(nav);
		let bug = false;
		try {
			assert.isOk(nav.selectedInstance);
		} catch (e) {
			assert.equal(e.message, 'expected undefined to be truthy');
			bug = true;
		}
		nav.selected = 1;
		assert.isOk(nav.selectedInstance);
		assert.isTrue(bug, 'bug fixed?');
	});
});
