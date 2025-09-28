import { createSlice } from '@reduxjs/toolkit';
import { rootReducer } from 'app/store/lazyLoadedSlices';

const initialState = false;
/**
 * The notificationPanel state slice.
 */

export const roomMenuPanelSlice = createSlice({
	name: 'roomMenuPanel',
	initialState,
	reducers: {
		toggleRoomMenuPanel: (state) => !state,
		openRoomMenuPanel: () => true,
		closeRoomMenuPanel: () => false

		// toggleAccountsPanel: (state) => !state,
		// openAccountsPanel: () => true,
		// closeAccountsPanel: () => false
	},
	selectors: {
		selectRoomMenuPanelState: (state) => state
	}
});
/**
 * Lazy load
 * */

rootReducer.inject(roomMenuPanelSlice);
const injectedSlice = roomMenuPanelSlice.injectInto(rootReducer);
export const {
	toggleRoomMenuPanel,
	openRoomMenuPanel,
	closeRoomMenuPanel
	// toggleAccountsPanel, openAccountsPanel, closeAccountsPanel
} = roomMenuPanelSlice.actions;
export const { selectRoomMenuPanelState } = injectedSlice.selectors;
export default roomMenuPanelSlice.reducer;
