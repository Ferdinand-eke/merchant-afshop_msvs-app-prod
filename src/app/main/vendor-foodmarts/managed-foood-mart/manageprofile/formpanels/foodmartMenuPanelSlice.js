import { createSlice } from '@reduxjs/toolkit';
import { rootReducer } from 'app/store/lazyLoadedSlices';

const initialState = false;
/**
 * The notificationPanel state slice.
 */

export const foodmartMenuPanelSlice = createSlice({
	name: 'foodMartMenuPanel',
	initialState,
	reducers: {
		toggleFoodMartMenuPanel: (state) => !state,
		openFoodMartMenuPanel: () => true,
		closeFoodMartMenuPanel: () => false

		// toggleAccountsPanel: (state) => !state,
		// openAccountsPanel: () => true,
		// closeAccountsPanel: () => false
	},
	selectors: {
		selectFoodMartMenuPanelState: (state) => state
	}
});
/**
 * Lazy load
 * */

rootReducer.inject(foodmartMenuPanelSlice);
const injectedSlice = foodmartMenuPanelSlice.injectInto(rootReducer);
export const {
	toggleFoodMartMenuPanel,
	openFoodMartMenuPanel,
	closeFoodMartMenuPanel
	// toggleAccountsPanel, openAccountsPanel, closeAccountsPanel
} = foodmartMenuPanelSlice.actions;
export const { selectFoodMartMenuPanelState } = injectedSlice.selectors;
export default foodmartMenuPanelSlice.reducer;
