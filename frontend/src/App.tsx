import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ApiTester from './pages/ApiTester';
import Documentation from './pages/Documentation';
import Keys from './pages/Keys';
import Status from './pages/Status';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tester" element={<ApiTester />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/keys" element={<Keys />} />
        <Route path="/status" element={<Status />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
