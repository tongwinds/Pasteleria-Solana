// No imports needed: web3, anchor, pg and more are globally available

describe("Poemarios", () => {
  it("Crea un poemario y agrega poemas", async () => {
    // Generar PDA para el poemario del usuario
    const [pda_poemario] = PublicKey.findProgramAddressSync(
      [Buffer.from("poemario"), pg.wallet.publicKey.toBuffer()],
      pg.PROGRAM_ID
    );

    // Crear poemario
    const nombrePoemario = "Mis Poemas";
    const txCreateHash = await pg.program.methods
      .crearPoemario(nombrePoemario)
      .accounts({
        owner: pg.wallet.publicKey,
        poemario: pda_poemario,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log(`Poemario creado: ${txCreateHash}`);

    // Confirmar transacción
    await pg.connection.confirmTransaction(txCreateHash);

    // Fetch del poemario creado
    const poemario = await pg.program.account.poemario.fetch(pda_poemario);
    console.log("Poemario:", poemario.nombre);
    console.log("Owner:", poemario.owner.toBase58());
    console.log("Poemas iniciales:", poemario.poemas.length);

    // Agregar primer poema - Soneto
    const txAdd1Hash = await pg.program.methods
      .agregarPoema("Suspiro Nocturno", "Soneto", 14, "En la quietud de la noche estrellada...")
      .accounts({
        owner: pg.wallet.publicKey,
        poemario: pda_poemario,
      })
      .rpc();
    
    console.log(`Primer poema agregado: ${txAdd1Hash}`);
    await pg.connection.confirmTransaction(txAdd1Hash);

    // Agregar segundo poema - Haiku
    const txAdd2Hash = await pg.program.methods
      .agregarPoema("Mar Eterno", "Haiku", 3, "Olas rompen suave / Arena blanca y salada / Mar siempre eterno")
      .accounts({
        owner: pg.wallet.publicKey,
        poemario: pda_poemario,
      })
      .rpc();
    
    console.log(`Segundo poema agregado: ${txAdd2Hash}`);
    await pg.connection.confirmTransaction(txAdd2Hash);

    // Verificar estado después de agregar
    let poemarioActualizado = await pg.program.account.poemario.fetch(pda_poemario);
    console.log("Poemas después de agregar:", poemarioActualizado.poemas.length);

    // Alternar estado de un poema (publicado <-> privado)
    const txToggleHash = await pg.program.methods
      .alternarEstado("Mar Eterno")
      .accounts({
        owner: pg.wallet.publicKey,
        poemario: pda_poemario,
      })
      .rpc();
    
    console.log(`Estado alternado: ${txToggleHash}`);
    await pg.connection.confirmTransaction(txToggleHash);

    // Eliminar un poema
    const txDeleteHash = await pg.program.methods
      .eliminarPoema("Suspiro Nocturno")
      .accounts({
        owner: pg.wallet.publicKey,
        poemario: pda_poemario,
      })
      .rpc();
    
    console.log(`Poema eliminado: ${txDeleteHash}`);
    await pg.connection.confirmTransaction(txDeleteHash);

    // Fetch final para verificar
    poemarioActualizado = await pg.program.account.poemario.fetch(pda_poemario);
    console.log("Poemas finales:", poemarioActualizado.poemas.length);
    
    // Verificar que solo queda un poema
    assert(poemarioActualizado.poemas.length === 1);
    assert(poemarioActualizado.poemas[0].titulo === "Mar Eterno");
    assert(poemarioActualizado.poemas[0].estilo === "Haiku");
    assert(poemarioActualizado.poemas[0].versos === 3);
  });
});
