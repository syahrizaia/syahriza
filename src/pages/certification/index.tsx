import { useEffect, useState } from "react";
import Load from "@/components/layouts/Load";
import Link from "next/link";

type Data = {
    id: number
    image: string
    link: string
}

const CertificationPage = () => {
    const [certificates, setCertificates] = useState([])

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_URL
        if (apiUrl) {
            fetch(`${apiUrl}/api/certificates`)
            .then((res) => res.json())
            .then((response) => setCertificates(response.data))
            .catch((error) => {
                console.log(error)
            })
        }
    }, [])

    return (
        <div className="flex flex-wrap justify-center items-center p-8 gap-8 h-full">
            {certificates.length > 0 ? (
                <>
                    {certificates.map((certification: Data) => (
                        <Link
                            className="flex flex-col w-80 hover:shadow-lg hover:shadow-cyan-500 transition duration-300"
                            key={certification.id}
                            href={certification.link}
                            target="_blank"
                        >
                            <img
                                className="w-full"
                                src={certification.image}
                                alt="gambar"
                            />
                        </Link>
                    ))}
                </>
            ) : ( <Load /> )}
        </div>
    )
}

export default CertificationPage;