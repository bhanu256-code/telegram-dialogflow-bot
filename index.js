2025-06-25T09:16:13.703071892Z ==> Cloning from https://github.com/bhanu256-code/telegram-dialogflow-bot
2025-06-25T09:16:14.147512999Z ==> Checking out commit 53710da764bf03a61c942cd41b3f5ad7ee4082a6 in branch main
2025-06-25T09:16:15.257051937Z ==> Downloading cache...
2025-06-25T09:16:30.657453565Z ==> Transferred 197MB in 7s. Extraction took 6s.
2025-06-25T09:16:39.891440688Z ==> Using Node.js version 22.16.0 (default)
2025-06-25T09:16:39.921614789Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-06-25T09:16:40.097095476Z ==> Using Bun version 1.1.0 (default)
2025-06-25T09:16:40.097113537Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-06-25T09:16:40.172690409Z ==> Running build command 'npm install'...
2025-06-25T09:16:41.995653998Z 
2025-06-25T09:16:41.995683859Z up to date, audited 171 packages in 2s
2025-06-25T09:16:41.99570208Z 
2025-06-25T09:16:41.995762334Z 17 packages are looking for funding
2025-06-25T09:16:41.995776245Z   run `npm fund` for details
2025-06-25T09:16:42.196928989Z 
2025-06-25T09:16:42.19695713Z 4 moderate severity vulnerabilities
2025-06-25T09:16:42.196961851Z 
2025-06-25T09:16:42.196966621Z To address all issues (including breaking changes), run:
2025-06-25T09:16:42.196971411Z   npm audit fix --force
2025-06-25T09:16:42.196974851Z 
2025-06-25T09:16:42.196979281Z Run `npm audit` for details.
2025-06-25T09:16:54.181930783Z ==> Uploading build...
2025-06-25T09:17:00.698616646Z ==> Uploaded in 3.7s. Compression took 2.8s
2025-06-25T09:17:00.717765474Z ==> Build successful 🎉
2025-06-25T09:17:11.114317588Z ==> Deploying...
2025-06-25T09:17:28.838428734Z ==> Running 'node index.js'
2025-06-25T09:17:29.04152826Z file:///opt/render/project/src/index.js:33
2025-06-25T09:17:29.041552062Z   const url = https://api.telegram.org/bot${botToken}/sendMessage;  // ✅ CORRECTED HERE
2025-06-25T09:17:29.041557602Z                    ^
2025-06-25T09:17:29.041559853Z 
2025-06-25T09:17:29.041562203Z SyntaxError: Unexpected token ':'
2025-06-25T09:17:29.041565213Z     at compileSourceTextModule (node:internal/modules/esm/utils:344:16)
2025-06-25T09:17:29.041567573Z     at ModuleLoader.moduleStrategy (node:internal/modules/esm/translators:105:18)
2025-06-25T09:17:29.041570343Z     at #translate (node:internal/modules/esm/loader:534:12)
2025-06-25T09:17:29.041572644Z     at ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:581:27)
2025-06-25T09:17:29.041575224Z     at async ModuleJob._link (node:internal/modules/esm/module_job:116:19)
2025-06-25T09:17:29.041577454Z 
2025-06-25T09:17:29.041582715Z Node.js v22.16.0
2025-06-25T09:17:31.820604769Z ==> Exited with status 1
2025-06-25T09:17:31.837459099Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys
2025-06-25T09:17:37.852193358Z ==> Running 'node index.js'
2025-06-25T09:17:38.146551518Z file:///opt/render/project/src/index.js:33
2025-06-25T09:17:38.14657728Z   const url = https://api.telegram.org/bot${botToken}/sendMessage;  // ✅ CORRECTED HERE
2025-06-25T09:17:38.14658261Z                    ^
2025-06-25T09:17:38.14658507Z 
2025-06-25T09:17:38.146587501Z SyntaxError: Unexpected token ':'
2025-06-25T09:17:38.146590521Z     at compileSourceTextModule (node:internal/modules/esm/utils:344:16)
2025-06-25T09:17:38.146593071Z     at ModuleLoader.moduleStrategy (node:internal/modules/esm/translators:105:18)
2025-06-25T09:17:38.146596091Z     at #translate (node:internal/modules/esm/loader:534:12)
2025-06-25T09:17:38.146598402Z     at ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:581:27)
2025-06-25T09:17:38.146604792Z     at async ModuleJob._link (node:internal/modules/esm/module_job:116:19)
2025-06-25T09:17:38.146606992Z 
2025-06-25T09:17:38.146609223Z Node.js v22.16.0
