import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../common/store/store';

interface HeroRealmsState {
  showDiscardPilePlayerId: string|null,
}

const initialState: HeroRealmsState = {
  showDiscardPilePlayerId: null,
};

export const heroRealmsSlice = createSlice({
  name: 'heroRealms',
  initialState,
  reducers: {
    showDiscardPile: (state, action: PayloadAction<string>) => {
      state.showDiscardPilePlayerId = action.payload;
    },
    hideDiscardPileDialog: (state) => {
      state.showDiscardPilePlayerId = null;
    },
  },
});

export const { showDiscardPile, hideDiscardPileDialog } = heroRealmsSlice.actions;

export const getShowDiscardPilePlayerId = (state: RootState) => state.heroRealms.showDiscardPilePlayerId;

export default heroRealmsSlice.reducer;
