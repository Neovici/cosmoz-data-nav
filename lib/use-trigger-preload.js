import { useEffect } from 'haunted';

const needData = (host, item) => item != null && typeof item !== 'object' && host.dispatchEvent(new CustomEvent('need-data', { detail: { id: item }}));

export const useTriggerPreload = (host, items, selected) =>
	useEffect(() => {
		if (items.length === 0) {
			return;
		}

		needData(host, items[selected - 1]);
		needData(host, items[selected]);
		needData(host, items[selected + 1]);
	}, [items, selected]);
