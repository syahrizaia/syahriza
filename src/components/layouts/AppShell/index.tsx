import { useRouter } from 'next/router';
import Navbar from '../Navbar'
import Footer from '../Footer';

type AppShellProps = {
    children: React.ReactNode;
}

const disableNavbar = ["/Load", "/404"]
const disableFooter = ["/Load", "/404"]

const AppShell = (props: AppShellProps) => {
    const { children } = props;
    const { pathname } = useRouter()

    return (
        <main>
            {!disableNavbar.includes(pathname) && <Navbar />}
            {children}
            {!disableFooter.includes(pathname) && <Footer />}
        </main>
    )
}

export default AppShell;