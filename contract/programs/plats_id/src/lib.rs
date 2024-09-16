use anchor_lang::prelude::*;

declare_id!("G8bW54fy7ex4YxM2qh4JT87hzRFXiGbzYzDTqPqYz4VB");

#[program]
pub mod plats_id {


    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let management = &mut ctx.accounts.identity_management;
        management.bump = ctx.bumps.identity_management;
        management.owner = ctx.accounts.signer.key();
        management.profiles = Vec::default();

        Ok(())
    }

    pub fn register_identity(
        ctx: Context<RegisterIdentity>,
        owner: Pubkey,
        name_id: String,
        secret_info: Vec<(String, String)>,
    ) -> Result<()> {
        let identity = &mut ctx.accounts.identity;
        let identity_management = &mut ctx.accounts.identity_management;
        let mut infos = Vec::new();
        for (store_id, secret_name) in secret_info.into_iter() {
            let type_info = get_type(secret_name.clone())?;

            let info = PrivacyInfo {
                store_id,
                secret_name,
                type_info,
            };
            infos.push(info);
        }

        identity.owner = owner.clone();
        identity.name_id = name_id.clone();
        identity.infos = infos.clone();
        identity.bump = identity_management.profiles.len() as u8;
        //identity.bump = 0u8;
        let new_identity = Identity {
            owner,
            name_id,
            infos,
            bump: identity_management.profiles.len() as u8,
            //bump: 0u8
        };

        identity_management.profiles.push(new_identity);
        Ok(())
    }

    pub fn update_identity(
        ctx: Context<UpdateIdentity>,
        name_id: String,
        secret_info: Vec<(String, String)>,
    ) -> Result<()> {
        if ctx.accounts.identity.name_id == name_id {
            return err!(ErrCode::IdWrong);
        }
        let identity = &mut ctx.accounts.identity;
        for (store_id, secret_name) in secret_info.into_iter() {
            let type_info = get_type(secret_name.clone())?;
            
            let existing_info = identity.infos.iter_mut().find(|info| info.store_id == store_id);
    
            match existing_info {
                Some(info) => {
                    info.secret_name = secret_name.clone();
                    info.type_info = type_info.clone();
                }
                None => {
                    return err!(ErrCode::IdentityIsExisted);
                }
            }
        }

        Ok(())
    }
}

#[account]
pub struct IdentityManagement {
    pub owner: Pubkey,
    pub profiles: Vec<Identity>,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        seeds = [b"identity_management"], // optional seeds for pda
        bump,                 // bump seed for pda
        payer = signer,
        space = 8 + 3000
    )]
    pub identity_management: Account<'info, IdentityManagement>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateIdentity<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"identity"],
        bump = identity.bump
    )]
    pub identity: Box<Account<'info, Identity>>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterIdentity<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = 8 + 3000, seeds = [b"identity"], bump)]
    pub identity: Box<Account<'info, Identity>>,

    #[account(mut)]
    pub identity_management: Account<'info, IdentityManagement>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Identity {
    pub owner: Pubkey,
    pub name_id: String,
    pub infos: Vec<PrivacyInfo>,
    pub bump: u8,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct PrivacyInfo {
    pub store_id: String,
    pub secret_name: String,
    pub type_info: String,
}

#[error_code]
pub enum ErrCode {
    #[msg("Id is mismatch")]
    IdWrong,
    #[msg("Get invalid type")]
    InvalidType,
    #[msg("Id is existed")]
    IdentityIsExisted,
}

// Helper Function

pub fn get_type(secret_name: String) -> Result<String> {
    if let Some(index) = secret_name.find('_') {
        let type_info = &secret_name[index + 1..];
        return Ok(type_info.to_string());
    } else {
        return err!(ErrCode::InvalidType);
    }
}
