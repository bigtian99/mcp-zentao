#!/usr/bin/env node
import { ZentaoConfig } from './config.js';
interface UserParams {
    config?: ZentaoConfig;
    name: string;
    age: number;
    skills: string[];
}
export default function main(params: UserParams): Promise<void>;
export {};
