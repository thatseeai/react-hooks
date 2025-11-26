import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
