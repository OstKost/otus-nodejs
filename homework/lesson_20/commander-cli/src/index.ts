#!/usr/bin/env node
import {initDB} from "./db.js";
import {login} from "./login.js";
import program from "./program.js";

async function main() {
    await initDB();
    await login();
    program.parse(process.argv);
}

void main();