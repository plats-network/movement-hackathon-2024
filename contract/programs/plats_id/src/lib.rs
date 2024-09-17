use anchor_lang::prelude::*;

declare_id!("8QHxbx26WeD96Z6idcKH8X6aiEXoB5Ek42GWAsLFXcRG");

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
        store_ids: Vec<String>,
        secret_names: Vec<String>,
        bump: u8
    ) -> Result<()> {
        let identity = &mut ctx.accounts.identity;
        let identity_management = &mut ctx.accounts.identity_management;
        let mut infos = Vec::new();
        for (store_id, secret_name) in store_ids.iter().zip(secret_names.iter()) {
            let type_info = get_type(secret_name.clone())?;
            let privacy_info = PrivacyInfo {
                store_id: store_id.clone(),
                secret_name: secret_name.clone(),
                type_info
            };
            infos.push(privacy_info);
        }


        let new_identity = Identity {
            owner,
            name_id: name_id.clone(),
            infos: infos.clone(),
            bump,
        };

        identity_management.profiles.push(new_identity);

        identity.owner = owner;
        identity.name_id = name_id;
        identity.infos = infos;
        identity.bump = bump;
        Ok(())
    }

    pub fn update_identity(
        ctx: Context<UpdateIdentity>,
        name_id: String,
        store_ids: Vec<String>,
        secret_names: Vec<String>,
    ) -> Result<()> {
        if ctx.accounts.identity.name_id == name_id {
            return err!(ErrCode::IdWrong);
        }
        let identity = &mut ctx.accounts.identity;
        for (store_id, secret_name) in store_ids.iter().zip(secret_names.iter()) {
            let type_info = get_type(secret_name.clone())?;
            
            let existing_info = identity.infos.iter_mut().find(|info| &info.store_id == store_id);
    
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
        seeds = [b"identity_management".as_ref()], // optional seeds for pda
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
        seeds = [b"identity".as_ref()],
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
