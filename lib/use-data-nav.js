import { useMemo } from 'haunted';
import { useIncompleteTemplate } from './use-incomplete-template';
import { useCache } from './use-cache';

export const useDataNav = el => {
	const incompleteTemplates = useMemo(() => ({
		[el.selected - 1]: useIncompleteTemplate(el.selected - 1, el.items.length),
		[el.selected]: useIncompleteTemplate(el.selected, el.items.length),
		[el.selected + 1]: useIncompleteTemplate(el.selected + 1, el.items.length)
	}), [el.selected, el.items.length]);
	return {
		cache: useCache(el),
		incompleteTemplates
	};
};
