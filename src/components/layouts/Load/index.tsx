import Image from "next/image"

const Load = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Image
                className="w-40 rounded-full"
                src={"/IMG_20231005_120702.jpg"}
                alt="gambar"
                width={180}
                height={37}
            />
            <div className="w-60 h-60 border-x-8 border-cyan-500 rounded-full animate-spin absolute" />
        </div>
    )
}

export default Load;