import { useEffect, useState } from "react";
import Load from "@/components/layouts/Load";
import Link from "next/link";

type Data = {
    id: number
    image: string
    title: string
    link: string
}

const ProjectPage = () => {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_URL
        if (apiUrl) {
            fetch(`${apiUrl}/api/projects`)
            .then((res) => res.json())
            .then((response) => setProjects(response.data))
            .catch((error) => {
                console.log(error)
            })
        }
    }, [])
    
    return (
        <div className="flex flex-wrap justify-center items-center p-8 gap-8 h-full">
            {projects.length > 0 ? (
                <>
                    {projects.map((project: Data) => (
                        <Link
                            className="flex flex-col w-80 p-2 rounded-2xl hover:shadow-lg hover:shadow-cyan-500 transition duration-300"
                            key={project.id}
                            href={project.link}
                            target="_blank"
                        >
                            <img
                                className="w-full"
                                src={project.image}
                                alt={project.title}
                            />
                            <h1 className="text-center text-xl font-semibold py-2">{project.title}</h1>
                        </Link>
                    ))}
                </>
            ) : ( <Load /> )}
        </div>
    )
}

export default ProjectPage;