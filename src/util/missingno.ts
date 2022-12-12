/**
 * Missingno
 * ---
 * Automatic console logging.
 */
export module Missingno {
    export class MissingnoImpl {
        private _verbose: boolean = false;
    
        public setVerbose(verbose = true) {
            this._verbose = verbose;
        }
    
        public log(message: string) {
            if (this._verbose) {
                console.log(message);
            }
        }
    
        private static _instance: MissingnoImpl;
        
        public static Instance(): MissingnoImpl {
            if (!this._instance) {
                this._instance = new MissingnoImpl();
            }
    
            return this._instance;
        }
    }
    
    /**
     * Set verbosity level.
     */
    export function setVerbose(setVerbose = true) {
        MissingnoImpl.Instance().setVerbose(setVerbose);
    }
    
    /**
     * Log message if verbose is set to true.
     */
    export function log(message: string) {
        MissingnoImpl.Instance().log(message);
    } 
}
