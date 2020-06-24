import { useIncompleteTemplate } from './use-incomplete-template';
import { useCache } from './use-cache';

export const useDataNav = el => ({
	cache: useCache(el),
	incompleteTemplates: {
		[el.selected - 1]: useIncompleteTemplate(el.selected - 1, el.items.length),
		[el.selected]: useIncompleteTemplate(el.selected, el.items.length),
		[el.selected + 1]: useIncompleteTemplate(el.selected + 1, el.items.length)
	}
});
