const localIP = process.env.api_local_ip_address;
const httpLocalPort = process.env.local_api_rest_port;
const wsLocalPort = parseInt(httpLocalPort) + 500;
const stage = process.env.stage;
const httpLocalUrl = `https://${localIP}:${httpLocalPort}/${stage}`;
const httpLiveUrl = `https://api.${process.env.domain_name}`;
const wsLocalUrl = `wss://${localIP}:${wsLocalPort}/${stage}`;
const wsLiveUrl = `wss://ws.${process.env.domain_name}`;
const { domain_name } = process.env;

export const isLive = () => {
  // if window object exists and the url name includes the domain name
  if (
    typeof window !== "undefined" &&
    window.location.hostname.includes(domain_name)
  ) {
    return true;
  }
  return false;
};

export const imageUrl = (asset) => {
  if (isLive()) {
    return `https://${process.env.domain_name}${asset}`;
  } else {
    return asset;
  }
};

export const httpApiURL = isLive() ? httpLiveUrl : httpLocalUrl;
// export const httpApiURL = httpLiveUrl;

export const wsApiURL = isLive() ? wsLiveUrl : wsLocalUrl;
// export const wsApiURL = wsLiveUrl;
