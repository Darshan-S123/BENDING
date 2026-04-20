import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import FeatherBackground from '../components/FeatherBackground';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-background text-text-main overflow-hidden font-sans">
            <FeatherBackground />
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <main className="flex-1 flex flex-col relative">
                <Navbar />

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-8">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
