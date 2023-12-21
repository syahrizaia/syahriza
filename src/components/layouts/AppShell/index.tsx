import { useRouter } from 'next/router';
import Navbar from '../Navbar'

type AppShellProps = {
    children: React.ReactNode;
}

const disableNavbar = ["/Load", "/404"]

const AppShell = (props: AppShellProps) => {
    const { children } = props;
    const { pathname } = useRouter()

    return (
        <main>
            {!disableNavbar.includes(pathname) && <Navbar />}
            {children}
        </main>
    )
}

export default AppShell;