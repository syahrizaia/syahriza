import Image from 'next/image'

const HomePage = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-center items-center gap-20 px-6 py-10 h-full sm:h-screen'>
      <div className='flex flex-col items-center sm:items-start text-center sm:text-left gap-4'>
        <p>its ME not YOU</p>
        <h1 className='text-cyan-500 text-5xl font-bold'>Syahriza Ikhsan Alsistani</h1>
        <p>Cyber Security | Robotics | AI-ML-DL</p>
      </div>
      <Image
        className='w-80 rounded-2xl shadow-xl shadow-cyan-500'
        src={"/IMG20231126181723.jpg"}
        alt='gambar'
        width={180}
        height={37}
      />
    </div>
  )
}

export default HomePage;