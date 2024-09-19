/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/plats_id.json`.
 */
export type PlatsId = {
    address: "D2CPWAujr7jvku9AtNwb1jaDudhDU7TNYUTcJY8trTFd";
    metadata: {
        name: "platsId";
        version: "0.1.0";
        spec: "0.1.0";
        description: "Created with Anchor";
    };
    instructions: [
        {
            name: "registerIdentity";
            discriminator: [164, 118, 227, 177, 47, 176, 187, 248];
            accounts: [
                {
                    name: "signer";
                    writable: true;
                    signer: true;
                },
                {
                    name: "identity";
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: "const";
                                value: [105, 100, 101, 110, 116, 105, 116, 121];
                            },
                            {
                                kind: "account";
                                path: "owner";
                            },
                        ];
                    };
                },
                {
                    name: "owner";
                },
                {
                    name: "systemProgram";
                    address: "11111111111111111111111111111111";
                },
            ];
            args: [
                {
                    name: "nameId";
                    type: "string";
                },
                {
                    name: "storeIds";
                    type: {
                        vec: "string";
                    };
                },
                {
                    name: "secretNames";
                    type: {
                        vec: "string";
                    };
                },
                {
                    name: "bump";
                    type: "u8";
                },
            ];
        },
        {
            name: "updateIdentity";
            discriminator: [130, 54, 88, 104, 222, 124, 238, 252];
            accounts: [
                {
                    name: "signer";
                    writable: true;
                    signer: true;
                },
                {
                    name: "identity";
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: "const";
                                value: [105, 100, 101, 110, 116, 105, 116, 121];
                            },
                            {
                                kind: "account";
                                path: "owner";
                            },
                        ];
                    };
                },
                {
                    name: "owner";
                },
                {
                    name: "systemProgram";
                    address: "11111111111111111111111111111111";
                },
            ];
            args: [
                {
                    name: "nameId";
                    type: "string";
                },
                {
                    name: "storeIds";
                    type: {
                        vec: "string";
                    };
                },
                {
                    name: "secretNames";
                    type: {
                        vec: "string";
                    };
                },
            ];
        },
    ];
    accounts: [
        {
            name: "identity";
            discriminator: [58, 132, 5, 12, 176, 164, 85, 112];
        },
    ];
    errors: [
        {
            code: 6000;
            name: "idWrong";
            msg: "Id is mismatch";
        },
        {
            code: 6001;
            name: "invalidType";
            msg: "Get invalid type";
        },
        {
            code: 6002;
            name: "identityIsExisted";
            msg: "Id is existed";
        },
    ];
    types: [
        {
            name: "identity";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "owner";
                        type: "pubkey";
                    },
                    {
                        name: "nameId";
                        type: "string";
                    },
                    {
                        name: "infos";
                        type: {
                            vec: {
                                defined: {
                                    name: "privacyInfo";
                                };
                            };
                        };
                    },
                    {
                        name: "bump";
                        type: "u8";
                    },
                ];
            };
        },
        {
            name: "privacyInfo";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "storeId";
                        type: "string";
                    },
                    {
                        name: "secretName";
                        type: "string";
                    },
                    {
                        name: "typeInfo";
                        type: "string";
                    },
                ];
            };
        },
    ];
};

export const IDL: PlatsId = {
    address: "D2CPWAujr7jvku9AtNwb1jaDudhDU7TNYUTcJY8trTFd",
    metadata: {
        name: "platsId",
        version: "0.1.0",
        spec: "0.1.0",
        description: "Created with Anchor",
    },
    instructions: [
        {
            name: "registerIdentity",
            discriminator: [164, 118, 227, 177, 47, 176, 187, 248],
            accounts: [
                {
                    name: "signer",
                    writable: true,
                    signer: true,
                },
                {
                    name: "identity",
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [105, 100, 101, 110, 116, 105, 116, 121],
                            },
                            {
                                kind: "account",
                                path: "owner",
                            },
                        ],
                    },
                },
                {
                    name: "owner",
                },
                {
                    name: "systemProgram",
                    address: "11111111111111111111111111111111",
                },
            ],
            args: [
                {
                    name: "nameId",
                    type: "string",
                },
                {
                    name: "storeIds",
                    type: {
                        vec: "string",
                    },
                },
                {
                    name: "secretNames",
                    type: {
                        vec: "string",
                    },
                },
                {
                    name: "bump",
                    type: "u8",
                },
            ],
        },
        {
            name: "updateIdentity",
            discriminator: [130, 54, 88, 104, 222, 124, 238, 252],
            accounts: [
                {
                    name: "signer",
                    writable: true,
                    signer: true,
                },
                {
                    name: "identity",
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [105, 100, 101, 110, 116, 105, 116, 121],
                            },
                            {
                                kind: "account",
                                path: "owner",
                            },
                        ],
                    },
                },
                {
                    name: "owner",
                },
                {
                    name: "systemProgram",
                    address: "11111111111111111111111111111111",
                },
            ],
            args: [
                {
                    name: "nameId",
                    type: "string",
                },
                {
                    name: "storeIds",
                    type: {
                        vec: "string",
                    },
                },
                {
                    name: "secretNames",
                    type: {
                        vec: "string",
                    },
                },
            ],
        },
    ],
    accounts: [
        {
            name: "identity",
            discriminator: [58, 132, 5, 12, 176, 164, 85, 112],
        },
    ],
    errors: [
        {
            code: 6000,
            name: "idWrong",
            msg: "Id is mismatch",
        },
        {
            code: 6001,
            name: "invalidType",
            msg: "Get invalid type",
        },
        {
            code: 6002,
            name: "identityIsExisted",
            msg: "Id is existed",
        },
    ],
    types: [
        {
            name: "identity",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "owner",
                        type: "pubkey",
                    },
                    {
                        name: "nameId",
                        type: "string",
                    },
                    {
                        name: "infos",
                        type: {
                            vec: {
                                defined: {
                                    name: "privacyInfo",
                                },
                            },
                        },
                    },
                    {
                        name: "bump",
                        type: "u8",
                    },
                ],
            },
        },
        {
            name: "privacyInfo",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "storeId",
                        type: "string",
                    },
                    {
                        name: "secretName",
                        type: "string",
                    },
                    {
                        name: "typeInfo",
                        type: "string",
                    },
                ],
            },
        },
    ],
};
