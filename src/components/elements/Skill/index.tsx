import { useEffect, useState } from "react"
import Link from "next/link"

type Data = {
    id: string
    skill: string
    licence: string
}

const SkillElement = () => {
    const [skills, setSkills] = useState([])

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_URL
        if (apiUrl) {
            fetch(`${apiUrl}/api/skills`)
            .then((res) => res.json())
            .then((response) => setSkills(response.data))
            .catch((error) => {
                console.log(error)
            })
        }
    }, [])

    return (
        <>
            <h2>My skill</h2>
            <ul>
                {skills.map((skill: Data) => (
                    <li key={skill.id}>&gt; {skill.skill} (<Link
                        className="text-cyan-500 hover:text-cyan-300"
                        href={skill.licence}
                        target="_blank"
                    >
                        licence
                    </Link>)</li>
                ))}
            </ul>
        </>
    )
}

export default SkillElement;