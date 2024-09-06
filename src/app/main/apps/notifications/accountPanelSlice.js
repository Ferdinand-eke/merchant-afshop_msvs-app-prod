import { createSlice } from '@reduxjs/toolkit';
import { rootReducer } from 'app/store/lazyLoadedSlices';

const initialState = false;
/**
 * The notificationPanel state slice.
 */
export const accountPanelSlice = createSlice({
	name: 'accountPanel',
	initialState,
	reducers: {
		// toggleNotificationPanel: (state) => !state,
		// openNotificationPanel: () => true,
		// closeNotificationPanel: () => false,


		toggleAccountsPanel: (state) => !state,
		openAccountsPanel: () => true,
		closeAccountsPanel: () => false
	},
	selectors: {
		selectAccountPanelState: (state) => state
	}
});
/**
 * Lazy load
 * */

rootReducer.inject(accountPanelSlice);
const injectedSlice = accountPanelSlice.injectInto(rootReducer);
export const { 
	toggleAccountsPanel, openAccountsPanel, closeAccountsPanel
} =
	accountPanelSlice.actions;
export const { selectAccountPanelState } = injectedSlice.selectors;
export default accountPanelSlice.reducer;
