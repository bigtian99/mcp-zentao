export interface ZentaoConfig {
    url: string;
    username: string;
    password: string;
    apiVersion: string;
}
export declare function saveConfig(config: ZentaoConfig): void;
export declare function loadConfig(): ZentaoConfig | null;
export declare function isConfigured(): boolean;
