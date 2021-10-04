import { useCallback, useEffect, useMemo, useRef, useState } from 'haunted';
import { slideInRight, slideInLeft } from './animations';

export const useDataNavList = (items, renderFn) => {
	const
		state = useRef({ prevIndex: 0 }),
		[item, setItem] = useState(items[0]),
		index = useMemo(() => items.indexOf(item), [items, item]);

	useEffect(() => setItem(item => {
		state.current.prevIndex = index;
		return items.indexOf(item) >= 0 ? item : items[0];
	}), [items]);

	return {
		index,
		item,
		slide: {
			id: item?.id,
			content: item && renderFn(item),
			animation: index > state.current.prevIndex ? slideInRight : slideInLeft
		},
		prev: useCallback(() => {
			state.current.prevIndex = index;
			setItem(items[Math.max(0, Math.min(items.length - 1, index - 1))]);
		}, [items, index]),
		next: useCallback(() => {
			state.current.prevIndex = index;
			setItem(items[Math.max(0, Math.min(items.length - 1, index + 1))]);
		}, [items, index]),
		first: index === 0,
		last: index === items.length - 1
	};
};
