use anchor_lang::prelude::*;

declare_id!("CGDCmdCGdL4zCcSgvYkBE6x8PAfih5fzzXt6iFqev5ue");

#[program]
pub mod blink {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
