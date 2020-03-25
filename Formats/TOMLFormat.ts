import { IFormat } from "./IFormat.ts";

export class TOMLFormat extends IFormat {
    IsOfType(object: string): boolean {
        return false;
    }
        
    Marshal(object: any, color: boolean, compact: boolean): string {
        throw new Error("Not implemented")
    }

    Unmarshal(object: string): any {
        throw new Error("Not implemented")
    }
}
