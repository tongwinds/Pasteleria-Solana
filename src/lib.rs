use anchor_lang::prelude::*;

declare_id!("3saJFmuArB4WQcna8deXe5ijLbeFc4Vhwn4nKFjLn7AU");

#[program]
pub mod poemarios {
    use super::*;

    /// Crea un nuevo poemario para el usuario
    pub fn crear_poemario(ctx: Context<NuevoPoemario>, nombre: String) -> Result<()> {
        let owner = ctx.accounts.owner.key();
        let poemas: Vec<Poema> = Vec::new();
        
        ctx.accounts.poemario.set_inner(Poemario {
            owner,
            nombre,
            poemas,
        });

        msg!("Poemario creado exitosamente!");
        Ok(())
    }

    /// Agrega un poema al poemario del usuario
    pub fn agregar_poema(
        ctx: Context<ModificarPoemario>, 
        titulo: String, 
        estilo: String, 
        versos: u16,
        contenido: String
    ) -> Result<()> {
        require!(ctx.accounts.poemario.owner == ctx.accounts.owner.key(), Errores::NoEresElOwner);

        let poema = Poema {
            titulo,
            estilo,
            versos,
            contenido,
            publicado: true,
        };

        ctx.accounts.poemario.poemas.push(poema);
        msg!("Poema agregado exitosamente!");
        Ok(())
    }

    /// Visualiza todos los poemas del poemario
    pub fn ver_poemas(context: Context<ModificarPoemario>) -> Result<()> {
        require!(context.accounts.poemario.owner == context.accounts.owner.key(), Errores::NoEresElOwner);

        msg!("Lista de poemas en el poemario: {:#?}", 
        context.accounts.poemario.poemas);

        Ok(())
    }

    /// Elimina un poema del poemario por su título
    pub fn eliminar_poema(context: Context<ModificarPoemario>, titulo: String) -> Result<()> {
        require!(context.accounts.poemario.owner == context.accounts.owner.key(), Errores::NoEresElOwner);
       
        let poemas: &mut Vec<Poema> = &mut context.accounts.poemario.poemas;

        for i in 0..poemas.len() {
            if poemas[i].titulo == titulo {
                poemas.remove(i);
                msg!("Poema '{}' eliminado!", titulo);
                return Ok(());
            }
        }
        Err(Errores::PoemaNoExiste.into())
    }

    /// Alterna el estado de publicación de un poema
    pub fn alternar_estado(context: Context<ModificarPoemario>, titulo: String) -> Result<()> {
        require!(context.accounts.poemario.owner == context.accounts.owner.key(), Errores::NoEresElOwner);        

        let poemas: &mut Vec<Poema> = &mut context.accounts.poemario.poemas;

        for i in 0..poemas.len() {
            let estado = poemas[i].publicado;
            
            if poemas[i].titulo == titulo {
                let nuevo_estado: bool = !estado;
                poemas[i].publicado = nuevo_estado;  
                msg!("El poema '{}' ahora está {}", titulo, if nuevo_estado { "publicado" } else { "privado" });              
                return Ok(());
            }
        }
        Err(Errores::PoemaNoExiste.into())
    }
}

#[error_code]
pub enum Errores {
    #[msg("Error: No eres el propietario de este poemario.")]
    NoEresElOwner,

    #[msg("Error: El poema proporcionado no existe.")]
    PoemaNoExiste
}

#[account]
#[derive(InitSpace)]
pub struct Poemario {
    pub owner: Pubkey,
    #[max_len(60)]
    pub nombre: String,
    #[max_len(10)]
    pub poemas: Vec<Poema>,
}

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub struct Poema {
    #[max_len(60)]
    pub titulo: String,
    #[max_len(30)]
    pub estilo: String,
    pub versos: u16,
    #[max_len(500)]
    pub contenido: String,
    pub publicado: bool,
}

#[derive(Accounts)]
pub struct NuevoPoemario<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + Poemario::INIT_SPACE, 
        seeds = [b"poemario", owner.key().as_ref()],
        bump
    )]
    pub poemario: Account<'info, Poemario>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ModificarPoemario<'info> {
    pub owner: Signer<'info>,
    #[account(mut)]
    pub poemario: Account<'info, Poemario>,
}
