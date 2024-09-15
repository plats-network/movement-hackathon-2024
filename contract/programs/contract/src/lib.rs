use anchor_lang::prelude::*;

declare_id!("8XSncEJuqcFRgJDCwW1hE6CjD35nxRxAeZXNatF5J2Wx");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
