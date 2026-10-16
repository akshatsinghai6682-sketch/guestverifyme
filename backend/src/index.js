import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`[GuestVerify] Security Guard Backend active on port ${config.port}`);
  console.log(`[GuestVerify] Operating Mode: ${config.aiMode.toUpperCase()}`);
});
