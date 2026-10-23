import { useId, type ReactNode } from "react";
import { LOJA } from "@/lib/config";

// Contorno do "S" da logo, vetorizado da arte original (coordenadas da marca: 362 x 337)
const CAMINHO_S =
  "M262.9 336.7C247.4 336.2 229 333.1 217.5 329.1C208.2 325.9 198.3 320.8 195.5 317.8C194.6 317 194.2 316.3 192.9 313.1C192.3 311.7 191.1 310.7 189.4 310C186.2 308.8 184.9 307.8 182.9 304.5C180.8 301.3 179.6 298.4 178.9 295C178.4 292.7 177.9 291.2 177 289.4C176.4 288 175.7 286.5 175.5 286C174.9 284.1 174 277.7 173.8 273.8C173.4 268.2 173.8 266.8 175.9 265.7L176.9 265.1L203.9 265.1L230.9 265.1L232.1 265.8C233.8 266.6 234.4 267.8 234.8 271.2C235.1 275.1 236 277.4 238.4 281C240.5 284.3 243.1 286.1 248.3 288.1C251.5 289.4 252.3 290.1 253.8 292.5C255.8 295.9 256 296 267.1 296C277.9 296 278.3 295.9 280.2 292.6C281.8 289.9 282.5 289.3 286.4 288C291.8 286.1 294.3 283.4 295 278.8C295.4 276.1 295.2 273.5 294.4 271.9C292.2 267.4 280.8 263 260.2 258.7C251.8 257 251.1 256.7 249.2 253.5C247.2 250.1 247 250 235.8 250C231.1 250 226.4 249.9 225.4 249.7C220.2 249 211.5 245.5 204.4 241.3C200 238.7 198.6 237.3 197.4 234.3C196.2 231.3 195.6 230.8 192.3 229.8C190 229.1 189.6 228.9 188.1 227.5C184.7 224.3 182.1 219.6 181.1 214.9C180.6 212.6 180.2 211.2 179.2 209.3C177.1 204.9 176.6 200.9 176.8 190.1C177 182.6 177.3 180.4 178.7 176.8C179.3 175.5 180 172.9 180.4 171.2C181.2 167.6 182 165.5 184 162.1C186 158.7 187.1 157.6 190 156.2C192.9 154.8 193.3 154.4 194.4 151.7C195.5 149 196.2 148.1 198.2 146.5C201.8 143.8 209.9 139.4 214.6 137.6C218.3 136.1 219.5 136 230.3 136C236.4 136 240.5 135.9 241.3 135.7C242.8 135.4 244.1 134.4 244.8 132.9C246 130.6 247.2 129.5 249.2 129.2C255.2 128.1 272.6 127.8 279.6 128.6C286 129.3 287 129.7 288.5 132.5C290.3 135.9 290.7 136 302.9 136C315.2 136 315.6 136.1 322.2 139.3C328.5 142.3 334.7 146.2 336.4 148.4C336.9 148.9 337.6 150.4 338.1 151.6C339.2 154.4 339.7 154.9 342.8 156.3C345.5 157.6 346.7 158.7 348.7 162.1C350.6 165.3 351.6 167.7 352.3 171.1C352.7 172.8 353.4 175.3 354 176.8C356.2 182.8 356.3 187.4 354.1 189C352.6 190 351.9 190 324.8 189.9C298.8 189.9 298.6 189.9 297.5 189.4C296 188.7 295.3 187.8 293.6 184.5C292.8 183 291.5 180.9 290.4 179.5C289.3 178.2 288.1 176.4 287.7 175.5C287.3 174.6 286.8 173.4 286.5 172.8C285.9 171.6 284.7 170.6 283.2 170.3C281.7 169.9 254.2 169.9 252.6 170.3C250.7 170.7 249.7 171.6 248.6 174.2C248.1 175.4 247 177.3 246.2 178.5C244 181.5 243.7 182.4 243.6 186.9C243.3 193.9 244 195.1 249 196.2C250.2 196.5 252.4 197.2 253.7 197.6C259.2 199.7 267.5 201.8 277.2 203.9C288.9 206.3 297.7 208.3 298.7 208.8C300.5 209.5 301.3 210.3 302.2 212C304.3 215.9 304.1 215.8 314.6 216C323.8 216.2 324 216.2 328 217.8C332.6 219.6 340 224.3 343 227.2C344.8 229 345 229.3 345.8 231.5C346.9 234.4 347.4 234.9 350.3 236.2C351.6 236.8 352.8 237.6 353.5 238.3C355.7 240.5 358.2 245.8 358.9 249.6C359.4 252.5 360.1 255.9 360.8 258.2C361.7 261.6 361.9 264.9 361.4 269.6C361.2 271.8 361 274.5 361 275.6C361 280.6 360 285.3 358 289.3C357.1 291.2 356.6 292.7 356.1 294.8C355.4 298 354.1 301 351.9 304.4C349.9 307.4 348.9 308.4 345.9 309.7C342.9 311.2 342.5 311.5 341.4 314.3C339.8 317.9 338.6 319.2 332.6 322.8C315.4 333.2 293 337.7 262.9 336.7Z";

// Faixas horizontais (y, altura) que recortam o "LS" em camadas de impressão
const CAMADAS = [
  [120, 10],
  [136, 14],
  [156, 14],
  [176, 14],
  [196, 14],
  [216, 14],
  [236, 14],
  [256, 14],
  [276, 14],
  [296, 14],
  [316, 21],
];

type P = { className?: string };

/**
 * Marca "LS" com o bico da impressora. As partes pretas usam a cor do texto
 * (currentColor), então a mesma marca serve no fundo creme e no preto.
 */
export function MarcaLS({ className = "h-10 w-auto", animada = false }: P & { animada?: boolean }) {
  const recorte = useId();

  return (
    <svg viewBox="0 0 362 337" className={className} aria-hidden>
      <defs>
        <clipPath id={recorte}>
          {CAMADAS.map(([y, altura]) => (
            <rect key={y} y={y} width="362" height={altura} />
          ))}
        </clipPath>
      </defs>
      <g fill="currentColor" clipPath={`url(#${recorte})`}>
        <path d="M0 136h65v145.5h103V333H0Z" />
        <path d={CAMINHO_S} />
      </g>
      <rect
        x="9"
        y="100"
        width="249"
        height="11"
        rx="5.5"
        className={`fill-filamento ${animada ? "barra-impressa" : ""}`}
      />
      <g className={animada ? "bico-impressor" : undefined}>
        <rect x="245" width="20" height="17" rx="1.5" fill="currentColor" />
        <rect x="222" y="16" width="67" height="37" rx="4" fill="currentColor" />
        <path d="M241 53h28l-14 40Z" className="fill-filamento" />
      </g>
    </svg>
  );
}

/** Logo horizontal: marca + nome da loja + "Impressões 3D" */
export function Logo({ className = "" }: P) {
  return (
    <span className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
      <MarcaLS className="h-8 w-auto shrink-0 sm:h-9" />
      <span className="flex flex-col">
        <span className="whitespace-nowrap font-display text-[13px] font-black uppercase leading-none tracking-tight sm:text-[17px]">
          {LOJA.nome}
        </span>
        <span className="mt-1.5 whitespace-nowrap text-[7.5px] font-semibold uppercase leading-none tracking-[0.42em] opacity-70 sm:text-[8.5px]">
          Impressões 3D
        </span>
      </span>
    </span>
  );
}

/** Rótulo pequeno entre traços, como o "— IMPRESSÕES 3D —" da logo */
export function Sobretitulo({ children, className = "" }: P & { children: ReactNode }) {
  return (
    <p className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] ${className}`}>
      <span className="h-0.5 w-6 shrink-0 bg-current" aria-hidden />
      {children}
      <span className="h-0.5 w-6 shrink-0 bg-filamento" aria-hidden />
    </p>
  );
}
