/* eslint-disable max-lines-per-function, max-statements, max-nested-callbacks, strict */
import {
	expect, fixture, html, aTimeout
} from '@open-wc/testing';

import '../cosmoz-data-nav.js';
import './helpers/cosmoz-data-nav-test-view.js';
import { Base } from '@polymer/polymer/polymer-legacy';
import {
	flushRenderQueue, selectedSlide, isVisible
} from './helpers/utils';

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
});
