import {Module} from "@/types/Module";
import {Struct} from "@/types/Struct";

export const moduleToString = (module: Module) => `${module.account_address}::${module.module_name}`;

export const structToString = (struct: Struct) => `${struct.account_address}::${struct.module_name}::${struct.struct_name}`;