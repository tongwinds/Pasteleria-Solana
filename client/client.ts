//////////////////// Imports ////////////////////
import { PublicKey } from "@solana/web3.js";

////////////////// Constantes ////////////////////
const NOMBRE_POEMARIO = "Mis Poemas";
const owner = pg.wallet.publicKey;

//////////////////// Logs base ////////////////////
console.log("My address:", owner.toBase58());
const balance = await pg.connection.getBalance(owner);
console.log(`My balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

//////////////////// PDA Poemario ////////////////////
// En Rust: seeds = [b"poemario", owner.key().as_ref()]
function pdaPoemario(ownerPk: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("poemario"), ownerPk.toBuffer()],
    pg.PROGRAM_ID
  );
}

//////////////////// Helpers ////////////////////
async function fetchPoemario(pda_poemario: PublicKey) {
  // Anchor/Playground: pg.program.account.<nombreCuenta>.fetch(pubkey)
  return await pg.program.account.poemario.fetch(pda_poemario);
}

function printPoemas(poemarioAccount: any) {
  const poemas = poemarioAccount.poemas as any[];
  if (!poemas || poemas.length === 0) {
    console.log("Poemario vacío");
    return;
  }

  console.log(`Poemas (${poemas.length}):`);
  for (let i = 0; i < poemas.length; i++) {
    const p = poemas[i];
    console.log(
      `#${i + 1} -> titulo="${p.titulo}", estilo="${p.estilo}", versos=${p.versos}, publicado=${
        p.publicado
      }`
    );
  }
}

//////////////////// Instrucciones ////////////////////
async function crearPoemario(nombrePoemario: string) {
  const [pda_poemario] = pdaPoemario(owner);

  try {
    const existing = await fetchPoemario(pda_poemario);
    console.log("Poemario ya existe en:", pda_poemario.toBase58());
    console.log("Owner guardado:", existing.owner.toBase58());
    console.log("Nombre guardado:", existing.nombre);
    return;
  } catch (_) {}

  const txHash = await pg.program.methods
    .crearPoemario(nombrePoemario)
    .accounts({
      owner: owner,
      poemario: pda_poemario,
      // systemProgram: web3.SystemProgram.programId, // normalmente Anchor lo infiere; si falla, descomentar
    })
    .rpc();

  console.log("crearPoemario tx:", txHash);
  console.log("Poemario PDA:", pda_poemario.toBase58());

  const poemarioAccount = await fetchPoemario(pda_poemario);
  console.log("Estado inicial:");
  console.log("Owner:", poemarioAccount.owner.toBase58());
  console.log("Nombre:", poemarioAccount.nombre);
  printPoemas(poemarioAccount);
}

async function agregarPoema(titulo: string, estilo: string, versos: number, contenido: string) {
  const [pda_poemario] = pdaPoemario(owner);

  const txHash = await pg.program.methods
    .agregarPoema(titulo, estilo, versos, contenido)
    .accounts({
      owner: owner,
      poemario: pda_poemario,
    })
    .rpc();

  console.log("agregarPoema tx:", txHash);

  const poemarioAccount = await fetchPoemario(pda_poemario);
  printPoemas(poemarioAccount);
}

async function eliminarPoema(titulo: string) {
  const [pda_poemario] = pdaPoemario(owner);

  const txHash = await pg.program.methods
    .eliminarPoema(titulo)
    .accounts({
      owner: owner,
      poemario: pda_poemario,
    })
    .rpc();

  console.log("eliminarPoema tx:", txHash);

  const poemarioAccount = await fetchPoemario(pda_poemario);
  printPoemas(poemarioAccount);
}

async function alternarEstado(titulo: string) {
  const [pda_poemario] = pdaPoemario(owner);

  const txHash = await pg.program.methods
    .alternarEstado(titulo)
    .accounts({
      owner: owner,
      poemario: pda_poemario,
    })
    .rpc();

  console.log("alternarEstado tx:", txHash);

  const poemarioAccount = await fetchPoemario(pda_poemario);
  printPoemas(poemarioAccount);
}

async function verPoemasFetch() {
  const [pda_poemario] = pdaPoemario(owner);

  const poemarioAccount = await fetchPoemario(pda_poemario);
  console.log("Poemario PDA:", pda_poemario.toBase58());
  console.log("Owner:", poemarioAccount.owner.toBase58());
  console.log("Nombre:", poemarioAccount.nombre);
  printPoemas(poemarioAccount);
}

//////////////////// Demo runner ////////////////////
// await crearPoemario(NOMBRE_POEMARIO);

// Pruebas rápidas - Agregando poemas de diferentes estilos
await agregarPoema("Suspiro Nocturno", "Soneto", 14, "En la quietud de la noche estrellada...");
await agregarPoema("Mar Eterno", "Haiku", 3, "Olas rompen suave / Arena blanca y salada / Mar siempre eterno");
await alternarEstado("Mar Eterno");
await eliminarPoema("Suspiro Nocturno");
await verPoemasFetch();
