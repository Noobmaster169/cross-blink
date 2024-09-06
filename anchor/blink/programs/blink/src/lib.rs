use anchor_lang::{prelude::*, pubkey};

declare_id!("CGDCmdCGdL4zCcSgvYkBE6x8PAfih5fzzXt6iFqev5ue");

const MASTER_PUBKEY: Pubkey = pubkey!("EHAPwi6PoKusaPE5yqQBLQFV69zTTyJTqHwAsN6WEzz");

#[program]
pub mod blink {
    use super::*;

    pub fn add_blink(
        ctx: Context<AddBlink>,
        uuid: String,
        name: String,
        description: String,
        image: String,
        accepted_chains: Vec<Chain>,
    ) -> Result<()> {
        let blink_list = &mut ctx.accounts.blink_list;

        if blink_list.is_initialized == false {
            blink_list.initialize();
        }

        let blink = Blink {
            uuid,
            name,
            description,
            image,
            accepted_chains,
        };

        blink_list.add(blink)
    }

    pub fn update_blink(
        ctx: Context<UpdateBlink>,
        uuid: String,
        name: Option<String>,
        description: Option<String>,
        image: Option<String>,
        accepted_chains: Option<Vec<Chain>>,
    ) -> Result<()> {
        let blink_list = &mut ctx.accounts.blink_list;

        blink_list.update(uuid, name, description, image, accepted_chains)
    }

    pub fn delete_blink(ctx: Context<DeleteBlink>, uuid: String) -> Result<()> {
        let blink_list = &mut ctx.accounts.blink_list;

        blink_list.delete(uuid)
    }
}

#[derive(Accounts)]
pub struct InitializeBlinkList<'info> {
    #[account(
        init_if_needed,
        payer = master,
        space = 8 + BlinkList::INIT_SPACE,
        seeds = [b"moveon", user.key().as_ref()],
        bump,
    )]
    pub blink_list: Account<'info, BlinkList>,
    #[account(
        owner = system_program.key()
    )]
    pub user: Signer<'info>,
    #[account(
        mut,
        address = MASTER_PUBKEY,
        owner = system_program.key()
    )]
    pub master: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddBlink<'info> {
    #[account(
        init_if_needed,
        payer = master,
        space = 8 + BlinkList::INIT_SPACE,
        seeds = [b"moveon", user.key().as_ref()],
        bump,
    )]
    blink_list: Account<'info, BlinkList>,
    #[account(
        owner = system_program.key()
    )]
    user: Signer<'info>,
    #[account(
        mut,
        address = MASTER_PUBKEY,
        owner = system_program.key()
    )]
    master: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateBlink<'info> {
    #[account(
        init_if_needed,
        payer = master,
        space = 8 + BlinkList::INIT_SPACE,
        seeds = [b"moveon", user.key().as_ref()],
        bump,
    )]
    blink_list: Account<'info, BlinkList>,
    #[account(
        owner = system_program.key()
    )]
    user: Signer<'info>,
    #[account(
        mut,
        address = MASTER_PUBKEY,
        owner = system_program.key()
    )]
    master: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DeleteBlink<'info> {
    #[account(
        init_if_needed,
        payer = master,
        space = 8 + BlinkList::INIT_SPACE,
        seeds = [b"moveon", user.key().as_ref()],
        bump,
    )]
    blink_list: Account<'info, BlinkList>,
    #[account(
        owner = system_program.key()
    )]
    user: Signer<'info>,
    #[account(
        mut,
        address = MASTER_PUBKEY,
        owner = system_program.key()
    )]
    master: Signer<'info>,
    system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct BlinkList {
    is_initialized: bool,
    #[max_len(4)]
    blinks: Vec<Blink>,
}

impl BlinkList {
    pub fn initialize(&mut self) -> Result<()> {
        self.is_initialized = true;
        self.blinks = Vec::new();

        Ok(())
    }

    pub fn add(&mut self, blink: Blink) -> Result<()> {
        require_eq!(self.is_initialized, true, BlinkError::ListNotInitialized);

        if self.blinks.len() < 4 {
            self.blinks.push(blink);
            Ok(())
        } else {
            Err(BlinkError::ListAtMaxLength.into())
        }
    }

    pub fn update(
        &mut self,
        uuid: String,
        name: Option<String>,
        description: Option<String>,
        image: Option<String>,
        accepted_chains: Option<Vec<Chain>>,
    ) -> Result<()> {
        require_eq!(self.is_initialized, true, BlinkError::ListNotInitialized);

        if let Some(pos) = self.blinks.iter().position(|blink| blink.uuid == uuid) {
            let blink = &mut self.blinks[pos];

            if let Some(name) = name {
                blink.name = name;
            }
            if let Some(description) = description {
                blink.description = description;
            }
            if let Some(image) = image {
                blink.image = image;
            }
            if let Some(accepted_chains) = accepted_chains {
                blink.accepted_chains = accepted_chains;
            }

            Ok(())
        } else {
            Err(BlinkError::BlinkNotFound.into())
        }
    }

    pub fn delete(&mut self, uuid: String) -> Result<()> {
        require_eq!(self.is_initialized, true, BlinkError::ListNotInitialized);

        if let Some(pos) = self.blinks.iter().position(|blink| blink.uuid == uuid) {
            self.blinks.remove(pos);
            Ok(())
        } else {
            Err(BlinkError::BlinkNotFound.into())
        }
    }
}

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Blink {
    #[max_len(36)]
    uuid: String,
    #[max_len(32)]
    name: String,
    #[max_len(256)]
    description: String,
    #[max_len(256)]
    image: String,
    #[max_len(4)]
    accepted_chains: Vec<Chain>,
}

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Chain {
    #[max_len(32)]
    name: String,
    #[max_len(64)]
    recipient_address: String,
    #[max_len(4, 64)]
    accepted_tokens: Vec<String>,
}

#[error_code]
pub enum BlinkError {
    #[msg("Blink list is not initialized")]
    ListNotInitialized,
    #[msg("Blink list is at maximum length")]
    ListAtMaxLength,
    #[msg("Blink with the specified UUID not found")]
    BlinkNotFound,
}
