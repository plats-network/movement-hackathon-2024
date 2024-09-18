use anchor_lang::prelude::*;

declare_id!("D2CPWAujr7jvku9AtNwb1jaDudhDU7TNYUTcJY8trTFd");

#[program]
pub mod plats_id {


    use super::*;


    pub fn register_identity(
        ctx: Context<RegisterIdentity>,
        name_id: String,
        store_ids: Vec<String>,
        secret_names: Vec<String>,
        bump: u8
    ) -> Result<()> {
        let owner_account = &ctx.accounts.owner;
        let identity = &mut ctx.accounts.identity;

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
        identity.name_id = name_id;
        identity.infos = infos;
        identity.bump = bump;
        identity.owner = owner_account.key();
        Ok(())
    }

    pub fn update_identity(
        ctx: Context<UpdateIdentity>,
        name_id: String,
        store_ids: Vec<String>,
        secret_names: Vec<String>,
    ) -> Result<()> {
        if ctx.accounts.identity.name_id != name_id {
            return err!(ErrCode::IdWrong);
        }
        let identity = &mut ctx.accounts.identity;

        let mut new_infos = Vec::new();


        for (store_id, secret_name) in store_ids.iter().zip(secret_names.iter()) {
            let type_info = get_type(secret_name.clone())?;
            let privacy_info = PrivacyInfo {
                store_id: store_id.clone(),
                secret_name: secret_name.clone(),
                type_info
            };
            new_infos.push(privacy_info);

        }

        identity.infos = new_infos;

        Ok(())
    }
}



#[derive(Accounts)]
pub struct UpdateIdentity<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"identity".as_ref(), owner.key().as_ref()],
        bump
    )]
    pub identity: Box<Account<'info, Identity>>,

    /// CHECK:
    pub owner: AccountInfo<'info>,


    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterIdentity<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = 8 + 3000, seeds = [b"identity", owner.key().as_ref()], bump)]
    pub identity: Box<Account<'info, Identity>>,

    /// CHECK:
    pub owner: AccountInfo<'info>,


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
