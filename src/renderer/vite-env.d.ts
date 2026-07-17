/// <reference types="vite/client" />

import type { templeCVApi } from "../preload/preload";

declare global {
  interface Window {
    templeCV: templeCVApi;
  }
}
