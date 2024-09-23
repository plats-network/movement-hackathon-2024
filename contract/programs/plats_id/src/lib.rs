use anchor_lang::prelude::*;

declare_id!("B2z1t7U1D488QZGVMZxbxGiHPEMozLtdZFjqo91sEfdR");

#[program]
pub mod plats_id {

    use super::*;

    pub fn register_identity(
        ctx: Context<RegisterIdentity>,
        name_id: String,
        store_ids: Vec<String>,
        secret_names: Vec<String>,
        bump: u8,
    ) -> Result<()> {
        let owner_account = &ctx.accounts.master_owner;
        let identity = &mut ctx.accounts.identity;

        let mut balance_privacy = Vec::new();
        let mut volumn_privacy = Vec::new();
        let mut twitter_privacy = Vec::new();

        for (i, secret_name) in secret_names.iter().enumerate() {
            let type_info = get_type(secret_name.clone())?;
            match type_info.as_str() {
                "balance" => {
                    let privacy_info = PrivacyBalanceInfo {
                        store_id: store_ids[i].clone(),
                        secret_name: secret_name.clone(),
                        type_info: type_info.clone(),
                    };
                    balance_privacy.push(privacy_info);
                }
                "volumn" => {
                    let privacy_info = PrivacyVolumnInfo {
                        store_id: store_ids[i].clone(),
                        secret_name: secret_name.clone(),
                        type_info: type_info.clone(),
                    };
                    volumn_privacy.push(privacy_info);
                }

                "twitter" => {
                    let privacy_info = PrivacyTwitterInfo {
                        store_id: store_ids[i].clone(),
                        secret_name: secret_name.clone(),
                        type_info: type_info.clone(),
                    };
                    twitter_privacy.push(privacy_info);
                }
                _ => return err!(ErrCode::PrivacyInfoNotSupport),
            }
        }

        identity.name_id = name_id;
        identity.balance_privacy = balance_privacy;
        identity.volumn_privacy = volumn_privacy;
        identity.twitter_privacy = twitter_privacy;
        identity.bump = bump;
        identity.master_owner = owner_account.key();
        identity.slave_accounts = Vec::new();
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
        let owner_account = &ctx.accounts.account;

        let mut idx: usize = 0;

        if owner_account.key() == identity.master_owner {
            // Master account is default index 0
            idx = 0;
        } else if identity.slave_accounts.contains(&owner_account.key()) {
            // Find index of slave account + 1
            idx = identity
                .slave_accounts
                .iter()
                .position(|&x| x == owner_account.key())
                .unwrap()
                + 1;
        } else {
            return err!(ErrCode::AccountIsNotRegister);
        }

        for (i, secret_name) in secret_names.iter().enumerate() {
            let type_info = get_type(secret_name.clone())?;

            match type_info.as_str() {
                "balance" => identity.balance_privacy[idx].store_id = store_ids[i].clone(),
                "volumn" => identity.volumn_privacy[idx].store_id = store_ids[i].clone(),

                "twitter" => identity.twitter_privacy[idx].store_id = store_ids[i].clone(),
                _ => return err!(ErrCode::PrivacyInfoNotSupport),
            }
        }

        Ok(())
    }

    // Add new additional identity to unique identity
    pub fn add_identity(
        ctx: Context<AddIdentity>,
        name_id: String,
        store_ids: Vec<String>,
        secret_names: Vec<String>,
    ) -> Result<()> {
        if ctx.accounts.identity.name_id != name_id {
            return err!(ErrCode::IdWrong);
        }
        let identity = &mut ctx.accounts.identity;
        let owner_account = &ctx.accounts.account;

        if identity.slave_accounts.contains(&owner_account.key()) {
            return err!(ErrCode::AccountExisted);
        }

        identity.slave_accounts.push(owner_account.key());

        for (i, secret_name) in secret_names.iter().enumerate() {
            let type_info = get_type(secret_name.clone())?;
            match type_info.as_str() {
                "balance" => {
                    let privacy_info = PrivacyBalanceInfo {
                        store_id: store_ids[i].clone(),
                        secret_name: secret_name.clone(),
                        type_info: type_info.clone(),
                    };
                    identity.balance_privacy.push(privacy_info);
                }
                "volumn" => {
                    let privacy_info = PrivacyVolumnInfo {
                        store_id: store_ids[i].clone(),
                        secret_name: secret_name.clone(),
                        type_info: type_info.clone(),
                    };
                    identity.volumn_privacy.push(privacy_info);
                }

                "twitter" => {
                    let privacy_info = PrivacyTwitterInfo {
                        store_id: store_ids[i].clone(),
                        secret_name: secret_name.clone(),
                        type_info: type_info.clone(),
                    };
                    identity.twitter_privacy.push(privacy_info);
                }
                _ => return err!(ErrCode::PrivacyInfoNotSupport),
            }
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name_id: String)]
pub struct UpdateIdentity<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"identity".as_ref(), name_id.as_bytes().as_ref()],
        bump
    )]
    pub identity: Box<Account<'info, Identity>>,

    /// CHECK:
    pub account: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name_id: String)]
pub struct AddIdentity<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"identity".as_ref(), name_id.as_bytes().as_ref()],
        bump
    )]
    pub identity: Box<Account<'info, Identity>>,

    /// CHECK:
    pub account: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name_id: String)]
pub struct RegisterIdentity<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = 8 + 3000, seeds = [b"identity", name_id.as_bytes().as_ref()], bump)]
    pub identity: Box<Account<'info, Identity>>,

    /// CHECK:
    pub master_owner: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Identity {
    // Master account to create unique identity
    pub master_owner: Pubkey,
    pub name_id: String,
    //  associate multiple accounts with a master account
    pub slave_accounts: Vec<Pubkey>,
    pub balance_privacy: Vec<PrivacyBalanceInfo>,
    pub volumn_privacy: Vec<PrivacyVolumnInfo>,
    pub twitter_privacy: Vec<PrivacyTwitterInfo>,
    pub bump: u8,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct PrivacyBalanceInfo {
    pub store_id: String,
    pub secret_name: String,
    pub type_info: String,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct PrivacyVolumnInfo {
    pub store_id: String,
    pub secret_name: String,
    pub type_info: String,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct PrivacyTwitterInfo {
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
    #[msg("Privacy Info Not Support")]
    PrivacyInfoNotSupport,
    #[msg("Account is not registered ID")]
    AccountIsNotRegister,
    #[msg("Account is existing")]
    AccountExisted,
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
