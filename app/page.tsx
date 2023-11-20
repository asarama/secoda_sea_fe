import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

if (!new class { x }().hasOwnProperty('x')) throw new Error('Transpiler is not configured correctly');

export default function HomePage() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
