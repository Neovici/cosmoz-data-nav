import {
	assert, fixture, html
} from '@open-wc/testing';

import sinon from 'sinon';

import { visibilityFixture } from './helpers/utils.js';

import '../cosmoz-data-nav.js';
import './helpers/cosmoz-data-nav-resizable-view.js';


import { flush } from '@polymer/polymer/lib/utils/flush';

sinon.assert.expose(chai.assert, { prefix: '' });

const whenFirstElementsRenderer = (nav, done) => {
	let listener;
	nav.addEventListener('iron-request-resize-notifications', listener = () => {
		const rendered = nav._elements.filter(e => e.__instance != null && e.__incomplete != null);
		if (rendered.length === nav.elementsBuffer) {
			nav.removeEventListener('iron-request-resize-notifications', listener);
			done();
		}
	});
};

suite('resizable', () => {
	let nav;

	suiteSetup(async () => {
		[, nav] = await Promise.all([
			fixture(visibilityFixture),
			fixture(html`
				<cosmoz-data-nav>
					<template>
						<cosmoz-data-nav-resizable-view class="fit layout vertical" item="{{ item }}" index="[[ index ]]"></cosmoz-data-nav-resizable-view>
					</template>
				</cosmoz-data-nav>
			`)
		]);
		nav._templatesObserver.flush();
		nav.items = Array(10).fill('').map((e, i) => i.toString());
		flush();
	});

	test('resize', done => {
		whenFirstElementsRenderer(nav, () => {
			const spy = sinon.spy(),
				view = nav._elements[0].querySelector('cosmoz-data-nav-resizable-view');
			nav.addEventListener('iron-resize', spy);
			nav.notifyResize();
			assert.calledOnce(spy);
			assert.equal(nav._interestedResizables.length, 6);
			assert.isTrue(nav.resizerShouldNotify(view));
			done();
		});

		nav.setItemById('0', { id: 0 });
		nav.setItemById('1', { id: 1 });
		nav.setItemById('2', { id: 2 });
	});
});
