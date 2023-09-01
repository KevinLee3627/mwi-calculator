import 'index.css';
import 'react-data-grid/lib/styles.css';

import { createRoot } from 'react-dom/client';
import App from 'src/components/App';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(<App />);
