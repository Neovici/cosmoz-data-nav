/* eslint-disable max-lines-per-function, max-statements, max-nested-callbacks */
import {
	expect, fixture, html, waitUntil
} from '@open-wc/testing';
import '../cosmoz-data-nav.js';
import './helpers/cosmoz-data-nav-test-view.js';
import {
	flushRenderQueue, selectedSlide, customStyle
} from './helpers/utils';
import { flush as syncFlush } from '@polymer/polymer/lib/utils/flush';



const basicFixture = html`
	<cosmoz-data-nav>
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
`;

suite('constructor', () => {
	suiteSetup(async () => {
		await fixture(basicFixture);
	});
	test('renders', () => {
		expect(document.body.querySelector('cosmoz-data-nav')).to.exist;
	});
});

suite('template', () => {
	test('renders items using a template', async () => {
		const [, nav] = await Promise.all([
			fixture(customStyle),
			fixture(basicFixture)
		]);
		nav._templatesObserver.flush();
		nav.items = [{ id: 1 }, { id: 2 }, { id: 3 }];

		flushRenderQueue(nav);

		expect(nav.querySelector('div.selected').textContent).to.equal('id: 1,index: 0');
	});

	test('renders the wrong item if the templates observer runs after `items` is set [KNOWN BUG]', async () => {
		//expect(async () => {
		const [, nav] = await Promise.all([
			fixture(customStyle),
			fixture(basicFixture)
		]);
		nav.items = [{ id: 1 }, { id: 2 }, { id: 3 }];
		await waitUntil(() => nav._templatesObserver);
		nav._templatesObserver.flush();
		flushRenderQueue(nav);

		expect(nav.querySelector('div.selected').textContent).to.equal('id: 1,index: 0');
		//}).throws('expected \'id: 3,index: 2\' to equal \'id: 1,index: 0\'');
	});

	test('re-renders when the template changes');
});

suite('properties', () => {
	let nav;
	setup(async () => {
		[, nav] = await Promise.all([
			fixture(customStyle),
			fixture(basicFixture)
		]);
		nav._templatesObserver.flush();
		nav.items = [{ id: 1 }, { id: 2 }, { id: 3 }];
		flushRenderQueue(nav);
		syncFlush();
	});

	test('is true if the element is currently animating');
	test('controls whether the element should animate');

	suite('as', () => {
		test('defines the name used in the template for the item');
	});

	suite('elementsBuffer', () => {
		test('defines the number of elements that are actually rendered');
	});

	suite('hashParam', () => {
		test('defines the hash parameter to use for selecting an item');
	});

	suite('hasItems', () => {
		test('is true if the data-nav has items', async () => {
			const nav = await fixture(basicFixture);

			expect(nav.hasItems).to.be.false;

			nav.items = [{ id: 1 }, { id: 2 }, { id: 3 }];

			expect(nav.hasItems).to.be.true;
		});
	});

	suite('hiddenRendering', () => {
		test('controls whether the element should render items even if it is not visible');
	});

	suite('idPath', () => {
		test('defines the path on the item to be used as id');
	});

	suite('indexAs', () => {
		test('defines the name used in the template for the index of the item');
	});

	suite('isIncompleteFn', () => {
		test('defines the function used to determine if an element is incomplete and nees to be preloaded');
	});

	suite('items', () => {
		test('defines the items to render', () => {
			nav.items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
			flushRenderQueue(nav);

			expect(selectedSlide(nav).textContent).to.equal('id: a,index: 0');
		});

		test('does not update the view when an item changes', () => {
			const item = {
				id: 'a',
				data: 'somedata'
			};
			nav.items = [item];
			flushRenderQueue(nav);
			expect(selectedSlide(nav).textContent).to.equal('id: a,index: 0somedata');

			// attempt #1: updating a reference directly does not update the view
			// this is expected as the data-nav has no way of knowing that data was updated
			item.data = 'newdata';
			expect(nav.items[0]).to.have.property('data', 'newdata');

			expect(() => {
				expect(selectedSlide(nav).textContent).to.equal('id: a,index: 0newdata');
			}).throws('expected \'id: a,index: 0somedata\' to equal \'id: a,index: 0newdata\'');


			// attempt #2: modify item data using polymer manipulation features
			// this could work, but is not implemented
			// an observer for items.* should forward the path update down to the rendered template instances
			nav.set('items.0.data', 'otherdata');
			expect(nav.items[0]).to.have.property('data', 'otherdata');

			expect(() => {
				expect(selectedSlide(nav).textContent).to.equal('id: a,index: 0otherdata');
			}).throws('expected \'id: a,index: 0somedata\' to equal \'id: a,index: 0otherdata\'');

			// attempt #3: try to force render
			// this does not work, because data-nav checks if it should re-render
			// the template using a reference check. Because the already rendered
			// item is the same by reference, the view is not updated.
			item.data = 'freshdata';
			expect(nav.items[0]).to.have.property('data', 'freshdata');

			nav._updateSelected();
			flushRenderQueue(nav);

			expect(() => {
				expect(selectedSlide(nav).textContent).to.equal('id: a,index: 0freshdata');
			}).throws('expected \'id: a,index: 0somedata\' to equal \'id: a,index: 0freshdata\'');
		});
	});

	suite('maintainSelection', () => {
		suite('when it is false', () => {
			test('changes to `items` reset `selected` to 0', () => {
				nav.items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
				nav.selected = 1;
				flushRenderQueue(nav);
				expect(selectedSlide(nav).textContent).to.equal('id: b,index: 1');

				nav.items = [{ id: 'c' }, { id: 'd' }, { id: 'e' }];
				expect(nav.selected).to.equal(0);
				flushRenderQueue(nav);
				expect(selectedSlide(nav).textContent).to.equal('id: c,index: 0');
			});
		});

		suite('when it is true', () => {
			setup(() => {
				nav.maintainSelection = true;
			});

			test('on `items` change, updates `selected` to match the last selected item, by reference', () => {
				const item = {
					id: 'b',
					data: 'somedata'
				};
				nav.items = [{ id: 'a' }, item, { id: 'c' }];
				nav.selected = 1;
				flushRenderQueue(nav);
				expect(selectedSlide(nav).textContent).to.equal('id: b,index: 1somedata');

				nav.items = [{ id: 'a' }, { id: 'd' }, { id: 'e' }, item];
				expect(nav.selected).to.equal(3);
				flushRenderQueue(nav);
				expect(selectedSlide(nav).textContent).to.equal('id: b,index: 3somedata');
			});

			test('on `items` change, updates `selected` to match the last selected item, by id', () => {
				nav.items = [{ id: 'a' }, {
					id: 'b',
					data: 'somedata'
				}, { id: 'c' }];
				nav.selected = 1;
				flushRenderQueue(nav);
				expect(selectedSlide(nav).textContent).to.equal('id: b,index: 1somedata');

				nav.items = [{ id: 'a' }, { id: 'd' }, { id: 'e' }, {
					id: 'b',
					data: 'otherdata'
				}];
				expect(nav.selected).to.equal(3);
				flushRenderQueue(nav);
				expect(selectedSlide(nav).textContent).to.equal('id: b,index: 3otherdata');
			});

			suite('when the last selected item is no longer present, by reference or by id', () => {
				test('maintains `selected` to it\'s current value', () => {
					nav.items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
					nav.selected = 1;
					flushRenderQueue(nav);
					expect(selectedSlide(nav).textContent).to.equal('id: b,index: 1');

					nav.items = [{ id: 'a' }, { id: 'd' }, { id: 'e' }];
					expect(nav.selected).to.equal(1);
					flushRenderQueue(nav);
					expect(selectedSlide(nav).textContent).to.equal('id: d,index: 1');
				});

				test('realigns element if already rendered', () => {
					nav.items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
					nav.selected = 1;
					flushRenderQueue(nav);
					expect(selectedSlide(nav).textContent).to.equal('id: b,index: 1');

					nav.items = [{ id: 'a' }, { id: 'c' }, { id: 'd' }];
					expect(nav.selected).to.equal(1);
					flushRenderQueue(nav);
					expect(selectedSlide(nav).textContent).to.equal('id: c,index: 1');
				});

				test('updates `selected` if there are not enough items', () => {
					nav.items = [{ id: 'a' }, { id: 'e' }];
					nav.selected = 1;
					flushRenderQueue(nav);
					expect(selectedSlide(nav).textContent).to.equal('id: e,index: 1');

					nav.items = [{ id: 'a' }];
					expect(nav.selected).to.equal(0);
					flushRenderQueue(nav);
					expect(selectedSlide(nav).textContent).to.equal('id: a,index: 0');
				});

			});

			test('resets selected to 0 when `items` is empty', () => {
				nav.items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
				nav.selected = 2;
				flushRenderQueue(nav);
				expect(selectedSlide(nav).textContent).to.equal('id: c,index: 2');

				nav.items = [];
				expect(nav.selected).to.equal(0);
				flushRenderQueue(nav);
				expect(selectedSlide(nav).textContent).to.equal('id: c,index: 2');

				nav.items = [{ id: 'd' }, { id: 'e' }, { id: 'f' }];
				expect(nav.selected).to.equal(0);
				flushRenderQueue(nav);
				expect(selectedSlide(nav).textContent).to.equal('id: d,index: 0');
			});

			suite('when idPath is set', () => {
				test('works as expected', () => {
					nav.idPath = 'deep.id';
					nav.items = [{ deep: { id: 'a' }}, {
						deep: { id: 'b' },
						data: 'somedata'
					}, { deep: { id: 'c' }}];
					nav.selected = 1;
					flushRenderQueue(nav);
					expect(selectedSlide(nav).textContent).to.equal('id: ,index: 1somedata');

					nav.items = [{ deep: { id: 'a' }}, { deep: { id: 'd' }}, { deep: { id: 'e' }}, {
						deep: { id: 'b' },
						data: 'otherdata'
					}];
					expect(nav.selected).to.equal(3);
					flushRenderQueue(nav);
					expect(selectedSlide(nav).textContent).to.equal('id: ,index: 3otherdata');
				});
			});
		});
	});

	suite('preload', () => {
		test('defines the number of items after the currently selected one to preload');
	});

	suite('queueLength', () => {
		test('exposes the length of the items array');
	});

	suite('reverse', () => {
		test('is true if the index of the currently selected item is smaller than the previous one');
	});

	suite('selectAttribute', () => {
		test('defines the name of the attribute that is used to control the direction of the navigation');
	});

	suite('selected', () => {
		test('exposes the currently selected index', () => {
			expect(nav.selected).to.equal(0);
		});

		test('controls the currently selected index', () => {
			nav.selected = 1;

			expect(nav.selected).to.equal(1);
			expect(selectedSlide(nav).textContent).to.equal('id: 2,index: 1');
		});
	});

	suite('selectedElement', () => {
		test('exposes the DOM element of the selected item', () => {
			expect(nav.selectedElement).to.exist;
			expect(nav.selectedElement).to.be.instanceOf(HTMLElement);
			expect(nav.selectedElement).to.have.property('item', nav.items[0]);
		});
	});

	suite('selectedInstance', () => {
		test('exposes the instance of the selected item');
		test('does not work properly [KNOWN BUG]', () => {
			expect(() => {
				expect(nav.selectedInstance).to.exist;
			}).throws('expected undefined to exist');
		});
	});

	suite('selectedItem', () => {
		test('exposes the selected item');
	});

	suite('selectedNext', () => {
		test('exposes the index of the selected item');
	});
});

suite('methods', () => {
	suite('select', () => {
		test('selects an items by index');
	});

	suite('selectById', () => {
		test('selects item by id');
	});

	suite('setItemById', () => {
		test('replaces an id in `items` with the full item');
	});
});
