import ColorSchemeToggle from "../components/ColorSchemeToggle/ColorSchemeToggle"
import CryptoTable from "../components/CryptoTable/CryptoTable"

export default function HomePage() {
  return (
    <>
      <section>
        <CryptoTable/>
      </section>
      <section>
        <ColorSchemeToggle/>
      </section>
    </>
  );
}
