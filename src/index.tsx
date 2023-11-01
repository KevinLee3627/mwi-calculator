import 'index.css';
import 'react-data-grid/lib/styles.css';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from 'src/App';
import { store } from 'src/store/store';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
