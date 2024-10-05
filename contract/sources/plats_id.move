module plats_id::plats_id {
    use std::error;
    use std::signer;
    use std::string::String;
    use aptos_framework::event;
    use aptos_framework::object;
    use aptos_std::string_utils;
    use std::bcs;
    use std::vector;
    use aptos_std::smart_vector;
    use aptos_std::smart_vector::SmartVector;
    use std::string;


    #[test_only]
    use std::debug;

    //:!:>resource
    struct Identity has key {
        master_owner: address,
        name_id: String,
        slave_accounts: smart_vector::SmartVector<address>,
        balance_privacy: smart_vector::SmartVector<PrivacyBalanceInfo>,
        volume_privacy:  smart_vector::SmartVector<PrivacyVolumeInfo>,
        twitter_privacy: smart_vector::SmartVector<PrivacyTwitterInfo>,
        permissions: smart_vector::SmartVector<String>,
    }
    //<:!:resource

    struct PrivacyBalanceInfo has store, drop, copy {
        store_id: String,
        secret_name: String,
        type_info: String,
    }

    struct PrivacyVolumeInfo has store, drop, copy {
        store_id: String,
        secret_name: String,
        type_info: String,
    }

    struct PrivacyTwitterInfo has store, drop, copy {
        store_id: String,
        secret_name: String,
        type_info: String,
    }


    #[event]
    struct RegisterIdentity has drop, store {
        account: address,
        id: String,
    }

    const E_UNIQUE_ID: u64 = 1;
    const E_LENGTH_STORE_ID_IS_NOT_SAME_SECRET_NAME: u64 = 2;
    const E_NOT_MASTER_OWNER: u64 = 3;
    const E_ID_MISMATCH: u64 = 4;
    const E_APP_ID_NOT_FOUND: u64 = 5;
    const E_ACCOUNT_ALREADY_EXISTS:u64 = 6;
    const E_INVALID_TYPE: u64 = 7;
    const E_ACCOUNT_NOT_REGISTERED: u64 = 8;

    public entry fun register_identity(sender: &signer, account: address,  name_id: String, store_ids: vector<String>, secret_names: vector<String>) {
        //let sender_address = signer::address_of(sender);

        let identity_object = object::create_named_object(
            sender,
            construct_identity_object_seed(name_id),
        );
        let balance_privacy = smart_vector::new<PrivacyBalanceInfo>();
        let volume_privacy = smart_vector::new<PrivacyVolumeInfo>();
        let twitter_privacy = smart_vector::new<PrivacyTwitterInfo>();

        let len = vector::length(&store_ids);
        let names_len = vector::length(&secret_names);

        assert!(
            len == names_len,
            E_LENGTH_STORE_ID_IS_NOT_SAME_SECRET_NAME 
        );

        let i = 0;
        while (i < len) {
            let store_id = vector::borrow(&store_ids, i);
            let secret_name = vector::borrow(&secret_names, i);

            if (*secret_name == string::utf8(b"secret_balance")) {
                let balance_info = PrivacyBalanceInfo {
                    store_id: *store_id,
                    secret_name: *secret_name,
                    type_info: string::utf8(b"balance"),
                };
                smart_vector::push_back(&mut balance_privacy, balance_info);            
            }
            else if (*secret_name == string::utf8(b"secret_volume")) {
                let volume_info = PrivacyVolumeInfo {
                    store_id: *store_id,
                    secret_name: *secret_name,
                    type_info: string::utf8(b"volume"),
                };
                smart_vector::push_back(&mut volume_privacy, volume_info);

            }
            else if (*secret_name == string::utf8(b"secret_twitter")) {
                let twitter_info = PrivacyTwitterInfo {
                    store_id: *store_id,
                    secret_name: *secret_name,
                    type_info: string::utf8(b"twitter"),
                };
                smart_vector::push_back(&mut twitter_privacy, twitter_info);

            }

            else {
                abort(E_INVALID_TYPE);
            };

            i = i + 1;
        };

        let obj_signer = object::generate_signer(&identity_object);
        let identity = Identity {
            master_owner: account,
            name_id: name_id,
            slave_accounts: smart_vector::empty<address>(),
            balance_privacy: balance_privacy,
            volume_privacy: volume_privacy,
            twitter_privacy: twitter_privacy,
            permissions: smart_vector::empty<String>(),
        };

        move_to(&obj_signer, identity);

    }


    public entry fun update_identity(
        sender: &signer,
        account: address,
        name_id: string::String,
        store_ids: vector<string::String>,
        secret_names: vector<string::String>
    ) acquires Identity {
        let sender_address = signer::address_of(sender);

        let identity_object_address = object::create_object_address(
            &sender_address,
            construct_identity_object_seed(name_id)
        );

        let identity = borrow_global_mut<Identity>(identity_object_address);

        // Verify name_id matches
        assert!(identity.name_id == name_id, E_ID_MISMATCH);

        let idx =0; 
        if (identity.master_owner == account) {
            idx =0; 
        }
        else {
            let (exist, pos) = smart_vector::index_of(&identity.slave_accounts, &sender_address);
            assert!(exist, error::not_found(E_ACCOUNT_NOT_REGISTERED));
            idx = pos +1;
        };
        let len = vector::length(&store_ids);

        let i = 0;
        while (i < len) {
            let store_id = vector::borrow(&store_ids, i);
            let secret_name = vector::borrow(&secret_names, i);

            if (*secret_name == string::utf8(b"secret_balance")) {
                
                smart_vector::borrow_mut(&mut identity.balance_privacy, idx).store_id = *vector::borrow(&store_ids, i);

            }
            else if (*secret_name == string::utf8(b"secret_volume")) {
                smart_vector::borrow_mut(&mut identity.volume_privacy, idx).store_id = *vector::borrow(&store_ids, i);

            }

            else if (*secret_name == string::utf8(b"secret_twitter")) {
                smart_vector::borrow_mut(&mut identity.twitter_privacy, idx).store_id = *vector::borrow(&store_ids, i);

            }
            else {
                abort(E_INVALID_TYPE);
            };

            i = i + 1;
        }
    }



    public entry fun add_identity(
        sender: &signer,
        account: address,
        name_id: string::String,
        store_ids: vector<string::String>,
        secret_names: vector<string::String>
    ) acquires Identity {

        let sender_address = signer::address_of(sender);
        let identity_object_address = object::create_object_address(
            &sender_address,
            construct_identity_object_seed(name_id)
        );

        let identity = borrow_global_mut<Identity>(identity_object_address);

        // Verify name_id matches
        assert!(identity.name_id == name_id, E_ID_MISMATCH);

        let contains_sender = smart_vector::contains(&identity.slave_accounts, &account);
        assert!(!contains_sender, E_ACCOUNT_ALREADY_EXISTS);

        // Add the sender as a slave account
        smart_vector::push_back(&mut identity.slave_accounts, account);

        let len = vector::length(&store_ids);

        let i = 0;
        while (i < len) {
            let store_id = vector::borrow(&store_ids, i);
            let secret_name = vector::borrow(&secret_names, i);

            if (*secret_name == string::utf8(b"secret_balance")) {
                let balance_info = PrivacyBalanceInfo {
                    store_id: *store_id,
                    secret_name: *secret_name,
                    type_info:  string::utf8(b"balance"),
                };

                smart_vector::push_back(&mut identity.balance_privacy, balance_info);

            }
            else if (*secret_name == string::utf8(b"secret_volume")) {
                let volume_info = PrivacyVolumeInfo {
                    store_id: *store_id,
                    secret_name: *secret_name,
                    type_info:  string::utf8(b"volume"),
            };

                smart_vector::push_back(&mut identity.volume_privacy, volume_info);

            }

            else if (*secret_name == string::utf8(b"secret_twitter")) {
                let twitter_info = PrivacyTwitterInfo {
                    store_id: *store_id,
                    secret_name: *secret_name,
                    type_info: string::utf8(b"twitter"),
                };

                smart_vector::push_back(&mut identity.twitter_privacy, twitter_info);

            }
            else {
                abort(E_INVALID_TYPE);
            };

            i = i + 1;
        }
    }



    // Function to add permissions to an existing identity.
    public entry fun add_permissions(
        sender: &signer,
        master_account: address,
        name_id: String,
        app_ids: vector<String>
    ) acquires Identity {
        //let sender_address = signer::address_of(sender);
        let identity_object_address = object::create_object_address(
            &master_account,
            construct_identity_object_seed(name_id)
        );

        let identity = borrow_global_mut<Identity>(identity_object_address);
        // Verify the sender is the master owner of the identity
        assert!(identity.master_owner == master_account, E_NOT_MASTER_OWNER);
        assert!(identity.name_id == name_id, E_ID_MISMATCH);

        // Add the provided app_ids to the permissions vector
        let len = vector::length(&app_ids);
        let i = 0;
        while (i < len) {
            let app_id = vector::borrow(&app_ids, i);
            smart_vector::push_back(&mut identity.permissions, *app_id);
            i = i + 1;
        }
    }

    // Function to revoke permissions from an existing identity.
    public entry fun revoke_permissions(
        sender: &signer,
        master_account: address,
        name_id: String,
        app_ids: vector<String>
    ) acquires Identity {
        //let sender_address = signer::address_of(sender);
        let identity_object_address = object::create_object_address(
            &master_account,
            construct_identity_object_seed(name_id)
        );

        let identity = borrow_global_mut<Identity>(identity_object_address);
        // Verify the sender is the master owner of the identity
        assert!(identity.master_owner == master_account, E_NOT_MASTER_OWNER);
        assert!(identity.name_id == name_id, E_ID_MISMATCH);

        // Revoke the specified app_ids from the permissions vector
        let len = vector::length(&app_ids);
        let i = 0;
        while (i < len) {
            let app_id = vector::borrow(&app_ids, i);
            let (exist, idx) = smart_vector::index_of(&identity.permissions, app_id);
            assert!(exist, error::not_found(E_APP_ID_NOT_FOUND));
            smart_vector::remove(&mut identity.permissions, idx);

            i = i + 1;
        }
    }



    // VIEW
    #[view]
    public fun get_identity_obj_addr(sender: address, name_id: String): address {
        object::create_object_address(&sender, construct_identity_object_seed(name_id))
    }

    #[view]
    public fun get_master_owner_identity(sender: address, name_id: String): address acquires Identity {
        let identity_obj = get_identity_obj_addr(sender, name_id);
        let identity = borrow_global<Identity>(identity_obj);
        identity.master_owner
    }

    #[view]
    public fun get_secret_identity(sender: address, name_id: String): (vector<PrivacyBalanceInfo>, vector<PrivacyVolumeInfo>, vector<PrivacyTwitterInfo>) acquires Identity {
        let identity_obj = get_identity_obj_addr(sender, name_id);
        let identity = borrow_global<Identity>(identity_obj);
        let balance = smart_vector::to_vector(&identity.balance_privacy);
        let volume = smart_vector::to_vector(&identity.volume_privacy);
        let twitter = smart_vector::to_vector(&identity.twitter_privacy);
        (balance, volume, twitter)

    }

    #[view]
    public fun get_slaves_account_identity(sender: address, name_id: String): vector<address> acquires Identity {
        let identity_obj = get_identity_obj_addr(sender, name_id);
        let identity = borrow_global<Identity>(identity_obj);
        smart_vector::to_vector(&identity.slave_accounts)
    }

        #[view]
    public fun get_permissions_identity(sender: address, name_id: String): vector<String> acquires Identity {
        let identity_obj = get_identity_obj_addr(sender, name_id);
        let identity = borrow_global<Identity>(identity_obj);
        smart_vector::to_vector(&identity.permissions)
    }






    // HELPER FUNCTION

    fun assert_user_has_one_unique_id(addr: address) {
        assert!(
            exists<Identity>(addr),
            E_UNIQUE_ID
        );
    }

    fun construct_identity_object_seed(name_id: String): vector<u8> {
        // The seed must be unique per todo list creator
        //Wwe add contract address as part of the seed so seed from 2 todo list contract for same user would be different
        bcs::to_bytes(&string_utils::format2(&b"{}_{}", @plats_id, name_id))
    }


}

