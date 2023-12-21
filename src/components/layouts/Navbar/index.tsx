import Link from "next/link";

const Navbar = () => {
    return (
        <div className="bg-cyan-500 flex justify-center items-center gap-4 sm:gap-10 font-semibold">
            <Link
                className="p-4 hover:bg-black transition duration-300"
                href={"/home"}
            >
                Home
            </Link>
            <Link
                className="p-4 hover:bg-black transition duration-300"
                href={"/project"}
            >
                Project
            </Link>
            <Link
                className="p-4 hover:bg-black transition duration-300"
                href={"/certification"}
            >
                Certification
            </Link>
            <Link
                className="p-4 hover:bg-black transition duration-300"
                href={"/about"}
            >
                About
            </Link>
        </div>
    )
}

export default Navbar;