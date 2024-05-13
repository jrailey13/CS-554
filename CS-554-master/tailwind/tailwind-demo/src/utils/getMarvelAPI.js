import md5 from "blueimp-md5";

/**
 * Generates the URL for a Marvel API request.
 */
export default function getMarvelAPI(route, query = "", override) {
  const ENV = import.meta.env;
  const publickey = ENV.VITE_MARVEL_PUBLIC_KEY;
  const privatekey = ENV.VITE_MARVEL_PRIVATE_KEY;

  const ts = new Date().getTime();
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const baseUrl = "https://gateway.marvel.com:443/v1/public/";
  if (override) return `${override}${route}?ts=${ts}&apikey=${publickey}&hash=${hash}${query}`;
  const url = `${baseUrl}${route}?ts=${ts}&apikey=${publickey}&hash=${hash}${query}`;

  return url;
}
