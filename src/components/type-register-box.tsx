import Link from 'next/link'

export default function TypeRegisterBox () {
  return (
    <div className="flex-col px-5 py-2 border w-96 h-fit">
      <h2 className="title py-2">
        Registro
      </h2>
      <p className="font-black">Te estás registrando como:</p>
      <div className="flex flex-col gap-6 my-10">
        <Link href={'/register/customer'}>
          <div>
            <span className="text-2xl hover:text-blue-700">Cliente</span>
            <p className="text-gray-500">Buscas algún servicio o centro de estética</p>
          </div>
        </Link>

        <Link href={'/register/owner'} >
          <div>
            <span className="text-2xl hover:text-blue-700">Dueño de estética</span>
            <p className="text-gray-500">Buscas gestionar tu centro de estética</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
