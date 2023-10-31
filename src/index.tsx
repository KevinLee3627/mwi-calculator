import 'index.css';
import 'react-data-grid/lib/styles.css';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from 'src/new/App';
// import { store } from 'src/old/store/store';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  // <Provider store={store}>
  <App />
  // </Provider>
);
