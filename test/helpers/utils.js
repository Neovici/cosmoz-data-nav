import {
	fixture, html
} from '@open-wc/testing';

export const
	flushRenderQueue = nav => {
		while (nav._indexRenderQueue.length) {
			nav._renderQueue();
		}
	},
	selectedSlide = nav => nav.querySelector('div.selected .slide'),
	isVisible = el => Boolean(el.offsetHeight || el.offsetWidth),
	dataNavUserMixin = baseClass => class extends baseClass {
		static get properties() {
			return {
				item: {
					type: Object,
					notify: true
				},
				index: {
					type: Number
				},
				prevDisabled: {
					type: Boolean
				},
				nextDisabled: {
					type: Boolean
				}
			};
		}
	},
	visibilityFixture = html`
		<style>
			cosmoz-data-nav {
				display: block;
				width: 455px;
				height: 400px;
				position: relative;
			}
		</style>
	`,
	defaultsFixture = html`
		<cosmoz-data-nav>
			<template>
				<cosmoz-data-nav-test-view item="{{ item }}" index="[[ index ]]">
				</cosmoz-data-nav-test-view>
			</template>
		</cosmoz-data-nav>
	`,
	getItems = (num = 20) => Array(num).fill('').map((e, i) => i.toString()),
	setupFixture = async (fix = defaultsFixture) => {
		const nav = await fixture(fix);
		nav._templatesObserver.flush();
		nav.items = getItems();
		return nav;
	};
