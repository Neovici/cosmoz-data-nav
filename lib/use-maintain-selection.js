import {
	useState, useEffect
} from 'haunted';

export const useMaintainSelection = (items, selected, maintainSelection, setSelected) => {
	const [selectedItem, setSelectedItem] = useState(items?.[selected]);

	useEffect(() => {
		setSelectedItem(items?.[selected]);
	}, [items, selected]);

	useEffect(() => {
		if (maintainSelection === false) {
			setSelected(0);
			return;
		}

		const index = items.findIndex(item => (item?.id || item) === (selectedItem?.id || selectedItem));

		if (index === -1) {
			setSelected(0);
			return;
		}

		if (index === selected) {
			return;
		}

		setSelected(index);
	}, [items]); // We intentionally only run this code when `items` changes.
};
