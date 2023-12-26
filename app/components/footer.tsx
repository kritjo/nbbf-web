import '@fontsource/pt-mono';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="py-12 px-8 flex flex-col items-center space-y-2">
      <Image width={100} height={100} src="/nbbf-nt-nbg.png" alt="Norges Bondebridgeforbund Logo"/>
      <p className="text-sm nbbf-font">Norges Bondebridgeforbund</p>
      <p className="text-sm">c/o Kristian Tjelta Johansen</p>
      <p className="text-sm">Sinsenveien 5A</p>
      <p className="text-sm">0572 Oslo, Norge</p>
      <p className="text-sm">NO 932 236 753 (Foretaksregisteret)</p>
    </footer>
  )
}

export default Footer