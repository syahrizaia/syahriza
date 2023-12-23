import Link from "next/link";
import { useEffect, useState } from "react";

type Data = {
    id: string
    title: string
    image: string
    link: string
}

const SosmedElement = () => {
    const [sosmeds, setSosmeds] = useState([])

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_URL
        if (apiUrl) {
            fetch(`${apiUrl}/api/sosmeds`)
            .then((res) => res.json())
            .then((response) => setSosmeds(response.data))
            .catch((error) => {
                console.log(error)
            })
        }
    }, [])

    return (
        <div className="w-full flex flex-wrap justify-center items=center gap-4">
            {sosmeds.map((sosmed: Data) => (
                <Link
                    className="w-12 h-12 flex justify-center items-center rounded-full shadow-lg shadow-cyan-500"
                    href={sosmed.link}
                    key={sosmed.id}
                    target="_blank"
                >
                    <img
                        className="w-6 hover:w-8 transition duration-1000"
                        src={sosmed.image}
                        alt={sosmed.title}
                        width={180}
                        height={37}
                    />
                </Link>
            ))}
        </div>
    )
}

export default SosmedElement;