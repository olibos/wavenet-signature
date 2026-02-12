import logo from "../wavenet.svg"

export default function Header() {
  return (
    <>
      <header className="text-white bg-primary-dark">
        <section className="py-8 max-w-360 mx-auto max-sm:px-5">
          <img src={logo} className="max-w-full h-auto" width="331" height="34" alt="Wavenet" />
          Email Signature Generator
        </section>
      </header>
    </>
  )
}
