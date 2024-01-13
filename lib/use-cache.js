import { useEffect } from '@pionjs/pion';

let storage = {};

const clear = () => {
		storage = {};
	},
	cachePurgeHandler = event => {
		if (Array.isArray(event?.detail?.ids) && event.detail.ids.length > 0) {
			event.detail.ids.forEach(id => delete storage[id]);
			return;
		}
		clear();
	};

export const useCache = () => {

	useEffect(() => {
		window.addEventListener('cosmoz-cache-purge', cachePurgeHandler);
		return () => {
			clear();
			window.removeEventListener('cosmoz-cache-purge', cachePurgeHandler);
		};
	}, []);

	return {
		clear,
		drop(key) {
			delete storage[key];
		},
		dropItem(item) {
			Object.entries(storage)
				.filter(([, value]) => value === item)
				.forEach(([key]) => delete storage[key]);
		},
		get(key) {
			return storage[key];
		},
		set(key, item) {
			storage[key] = item;
		}
	};
};
