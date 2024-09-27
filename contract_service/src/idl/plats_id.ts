/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/plats_id.json`.
 */
export type PlatsId = {
  "address": "4ASkhwUReTWmvp8aLASbD8ppbcEMBxhcQmGHDbXMh7iN",
  "metadata": {
    "name": "platsId",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addIdentity",
      "discriminator": [
        212,
        100,
        104,
        34,
        15,
        136,
        248,
        225
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "identity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "nameId"
              }
            ]
          }
        },
        {
          "name": "account"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "nameId",
          "type": "string"
        },
        {
          "name": "storeIds",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "secretNames",
          "type": {
            "vec": "string"
          }
        }
      ]
    },
    {
      "name": "addPermissions",
      "discriminator": [
        104,
        43,
        218,
        66,
        174,
        89,
        7,
        143
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "identity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "nameId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "nameId",
          "type": "string"
        },
        {
          "name": "appIds",
          "type": {
            "vec": "string"
          }
        }
      ]
    },
    {
      "name": "registerIdentity",
      "discriminator": [
        164,
        118,
        227,
        177,
        47,
        176,
        187,
        248
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "identity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "nameId"
              }
            ]
          }
        },
        {
          "name": "masterOwner"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "nameId",
          "type": "string"
        },
        {
          "name": "storeIds",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "secretNames",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "revokePermissions",
      "discriminator": [
        115,
        59,
        136,
        227,
        198,
        42,
        189,
        236
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "identity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "nameId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "nameId",
          "type": "string"
        },
        {
          "name": "appIds",
          "type": {
            "vec": "string"
          }
        }
      ]
    },
    {
      "name": "updateIdentity",
      "discriminator": [
        130,
        54,
        88,
        104,
        222,
        124,
        238,
        252
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "identity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "nameId"
              }
            ]
          }
        },
        {
          "name": "account"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "nameId",
          "type": "string"
        },
        {
          "name": "storeIds",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "secretNames",
          "type": {
            "vec": "string"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "identity",
      "discriminator": [
        58,
        132,
        5,
        12,
        176,
        164,
        85,
        112
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "idWrong",
      "msg": "Id is mismatch"
    },
    {
      "code": 6001,
      "name": "invalidType",
      "msg": "Get invalid type"
    },
    {
      "code": 6002,
      "name": "identityIsExisted",
      "msg": "Id is existed"
    },
    {
      "code": 6003,
      "name": "privacyInfoNotSupport",
      "msg": "Privacy Info Not Support"
    },
    {
      "code": 6004,
      "name": "accountIsNotRegister",
      "msg": "Account is not registered ID"
    },
    {
      "code": 6005,
      "name": "accountExisted",
      "msg": "Account is existing"
    },
    {
      "code": 6006,
      "name": "appIdNotFound",
      "msg": "App Id not found"
    },
    {
      "code": 6007,
      "name": "notMasterOwner",
      "msg": "Not master owner"
    }
  ],
  "types": [
    {
      "name": "identity",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "masterOwner",
            "type": "pubkey"
          },
          {
            "name": "nameId",
            "type": "string"
          },
          {
            "name": "slaveAccounts",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "balancePrivacy",
            "type": {
              "vec": {
                "defined": {
                  "name": "privacyBalanceInfo"
                }
              }
            }
          },
          {
            "name": "volumePrivacy",
            "type": {
              "vec": {
                "defined": {
                  "name": "privacyVolumeInfo"
                }
              }
            }
          },
          {
            "name": "twitterPrivacy",
            "type": {
              "vec": {
                "defined": {
                  "name": "privacyTwitterInfo"
                }
              }
            }
          },
          {
            "name": "permissions",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "privacyBalanceInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "storeId",
            "type": "string"
          },
          {
            "name": "secretName",
            "type": "string"
          },
          {
            "name": "typeInfo",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "privacyTwitterInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "storeId",
            "type": "string"
          },
          {
            "name": "secretName",
            "type": "string"
          },
          {
            "name": "typeInfo",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "privacyVolumeInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "storeId",
            "type": "string"
          },
          {
            "name": "secretName",
            "type": "string"
          },
          {
            "name": "typeInfo",
            "type": "string"
          }
        ]
      }
    }
  ]
};





export const IDL: PlatsId = {
  "address": "4ASkhwUReTWmvp8aLASbD8ppbcEMBxhcQmGHDbXMh7iN",
  "metadata": {
    "name": "platsId",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addIdentity",
      "discriminator": [
        212,
        100,
        104,
        34,
        15,
        136,
        248,
        225
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "identity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "nameId"
              }
            ]
          }
        },
        {
          "name": "account"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "nameId",
          "type": "string"
        },
        {
          "name": "storeIds",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "secretNames",
          "type": {
            "vec": "string"
          }
        }
      ]
    },
    {
      "name": "addPermissions",
      "discriminator": [
        104,
        43,
        218,
        66,
        174,
        89,
        7,
        143
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "identity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "nameId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "nameId",
          "type": "string"
        },
        {
          "name": "appIds",
          "type": {
            "vec": "string"
          }
        }
      ]
    },
    {
      "name": "registerIdentity",
      "discriminator": [
        164,
        118,
        227,
        177,
        47,
        176,
        187,
        248
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "identity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "nameId"
              }
            ]
          }
        },
        {
          "name": "masterOwner"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "nameId",
          "type": "string"
        },
        {
          "name": "storeIds",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "secretNames",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "revokePermissions",
      "discriminator": [
        115,
        59,
        136,
        227,
        198,
        42,
        189,
        236
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "identity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "nameId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "nameId",
          "type": "string"
        },
        {
          "name": "appIds",
          "type": {
            "vec": "string"
          }
        }
      ]
    },
    {
      "name": "updateIdentity",
      "discriminator": [
        130,
        54,
        88,
        104,
        222,
        124,
        238,
        252
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "identity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "nameId"
              }
            ]
          }
        },
        {
          "name": "account"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "nameId",
          "type": "string"
        },
        {
          "name": "storeIds",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "secretNames",
          "type": {
            "vec": "string"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "identity",
      "discriminator": [
        58,
        132,
        5,
        12,
        176,
        164,
        85,
        112
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "idWrong",
      "msg": "Id is mismatch"
    },
    {
      "code": 6001,
      "name": "invalidType",
      "msg": "Get invalid type"
    },
    {
      "code": 6002,
      "name": "identityIsExisted",
      "msg": "Id is existed"
    },
    {
      "code": 6003,
      "name": "privacyInfoNotSupport",
      "msg": "Privacy Info Not Support"
    },
    {
      "code": 6004,
      "name": "accountIsNotRegister",
      "msg": "Account is not registered ID"
    },
    {
      "code": 6005,
      "name": "accountExisted",
      "msg": "Account is existing"
    },
    {
      "code": 6006,
      "name": "appIdNotFound",
      "msg": "App Id not found"
    },
    {
      "code": 6007,
      "name": "notMasterOwner",
      "msg": "Not master owner"
    }
  ],
  "types": [
    {
      "name": "identity",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "masterOwner",
            "type": "pubkey"
          },
          {
            "name": "nameId",
            "type": "string"
          },
          {
            "name": "slaveAccounts",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "balancePrivacy",
            "type": {
              "vec": {
                "defined": {
                  "name": "privacyBalanceInfo"
                }
              }
            }
          },
          {
            "name": "volumePrivacy",
            "type": {
              "vec": {
                "defined": {
                  "name": "privacyVolumeInfo"
                }
              }
            }
          },
          {
            "name": "twitterPrivacy",
            "type": {
              "vec": {
                "defined": {
                  "name": "privacyTwitterInfo"
                }
              }
            }
          },
          {
            "name": "permissions",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "privacyBalanceInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "storeId",
            "type": "string"
          },
          {
            "name": "secretName",
            "type": "string"
          },
          {
            "name": "typeInfo",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "privacyTwitterInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "storeId",
            "type": "string"
          },
          {
            "name": "secretName",
            "type": "string"
          },
          {
            "name": "typeInfo",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "privacyVolumeInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "storeId",
            "type": "string"
          },
          {
            "name": "secretName",
            "type": "string"
          },
          {
            "name": "typeInfo",
            "type": "string"
          }
        ]
      }
    }
  ]
};
