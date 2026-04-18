use anchor_lang::prelude::*;

declare_id!("");

#[program]

pub mod biblioteca {
    pub fn crear_biblioteca() -> Result<()> {

    }

    pub fn agregar_libro() -> Result<()> {

    }
}

#[derive(InitSpace)]

pub struct Biblioteca{
    owner: Pubkey,



    #[max_len(60)]
    nombre: String,

     #[max_len(10)]
    libros: Vec<Libro>,

}

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub struct  Libro{

    #[max_len(60)]
    nombre: String,

    paginas: u16,

    disponible: bool,

}

#[derive(Accounts)]
pub struct NuevaBiblioteca{

    pub owner: Singer<'info>,

    #[account](
        init,
        payer = owner,
        space = Biblioteca::INIT_SPACE + 8, 
        seeds = [b"biblioteca", owner.key().as_ref()]
    )

    pub biblioteca: Account<'info, Biblioteca>,

    pub system_program: Program<'info, System>,



}

#[derive(Accounts)]
pub struct NuevoLibro{
        pub owner: Signer <'info>,

        #[account(mut)]
        pub biblioteca: Account<'info, Biblioteca>,

}
