import { createListenerMiddleware } from '@reduxjs/toolkit';
import { publishAppEvent } from '@org/shared-models';
import {
  addProduct,
  deleteProduct,
} from '../features/products/store/products.slice';
import type { RootState } from './store';

/**
 * Side-effect layer for the products store. Reducers stay pure — publishing a
 * cross-framework event is a side effect, so it belongs in listener middleware,
 * not in the reducer or a UI component.
 *
 * This runs AFTER `addProduct` has updated the state, which is how we obtain
 * the id generated inside the reducer.
 */
export const productEventsMiddleware = createListenerMiddleware();

productEventsMiddleware.startListening({
  actionCreator: addProduct,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    // `addProduct` appends, so the just-created product (with its generated id)
    // is the last item.
    const created = state.products.items.at(-1);
    if (created) {
      publishAppEvent('product-created', {
        id: created.id,
        name: created.name,
      });
    }
  },
});

productEventsMiddleware.startListening({
  actionCreator: deleteProduct,
  effect: (action, listenerApi) => {
    // Mirror image of `addProduct`: by the time this runs, the product is
    // already removed from state, so we read the PRE-reducer snapshot to
    // recover its name. The action payload is the deleted product's id.
    const previousState = listenerApi.getOriginalState() as RootState;
    const deleted = previousState.products.items.find(
      (item) => item.id === action.payload
    );
    if (deleted) {
      publishAppEvent('product-deleted', {
        id: deleted.id,
        name: deleted.name,
      });
    }
  },
});
