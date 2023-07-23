import { next, serverless, ethereum } from "./frameworks";
export default [
  {
    filepath: "./frontend",
    cli: next,
  },
  {
    filepath: "./backend/serverless",
    cli: serverless,
  },
  {
    filepath: "./backend/ethereum",
    cli: ethereum,
  },
];
