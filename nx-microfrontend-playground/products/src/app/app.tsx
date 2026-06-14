import { Provider } from 'react-redux';
import { store } from './store/store';
import { ProductsManagementPage } from './features/products/pages/products-management-page/products-management-page';

/**
 * The Redux Provider lives here — inside App — rather than in an entry file.
 * Both entry points (standalone `bootstrap.tsx` and the federated
 * `remote-entry.ts` `mount()`) render <App />, so wrapping here gives the
 * store to every mount without touching the Module Federation contract.
 */
export function App() {
  return (
    <Provider store={store}>
      <ProductsManagementPage />
    </Provider>
  );
}

export default App;
