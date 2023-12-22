import SkillElement from "@/components/elements/Skill";

const AboutPage = () => {
    return (
        <div className="flex flex-col gap-4 p-4 sm:p-6 h-full">
            <h1 className="text-cyan-500 text-4xl font-semibold mx-4">Who am I</h1>
            <p>My name is <strong>Syahriza Ikhsan Alsistani</strong>. Im a College Student at University of Bina Sarana Informatika, Cikarang. My major is Information Technology.</p>
            <SkillElement />
            <hr className="border-b-2 border-cyan-500" />
            <>
                <h2>Educational Backgroud :</h2>
                <ul>
                    <li>&gt; University of Bina Sarana Informatika Cikarang, now</li>
                    <li>&gt; MA Al-Hikmah Purwoasri, 2022</li>
                    <li>&gt; MTs Al-Hikmah Purwoasri, 2019</li>
                    <li>&gt; SDIT Aqidah North Cikarang, 2016</li>
                    <li>&gt; TK Al-Hidayah South Cikarang, 2010</li>
                </ul>
                <hr className="border-b-2 border-cyan-500" />
            </>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis iste officiis sint inventore esse quae. Ipsam sequi natus eius possimus aspernatur alias veniam necessitatibus repudiandae consequuntur atque! Adipisci, eaque mollitia.
            Vel labore ipsum incidunt blanditiis accusamus amet aliquid, id culpa, vitae quod suscipit sint illo quae, ex laboriosam hic impedit in eius alias? Unde asperiores voluptates labore ad? Itaque, molestiae!
            Aspernatur et minus exercitationem fugit magni totam voluptatem quas deserunt laudantium, provident, iusto hic iste molestias atque soluta quidem dicta aliquam recusandae perspiciatis? Ad ex labore nostrum excepturi, in vero.</p>
        </div>
    )
}

export default AboutPage;