import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AssessmentProvider } from './context/AssessmentContext';
import AppRouter from './router';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AssessmentProvider>
          <AppRouter />
        </AssessmentProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
