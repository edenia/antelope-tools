import proj4 from "proj4";

// NOTE: when dealing with server side rendering as we are, check for window before doing things with it.
// If you're not doing server side rendering, then you don't need this check and can just assign straight to window.
if (typeof window !== "undefined") {
  window.proj4 = window.proj4 || proj4;
}

const proj4Wrapper = proj4;

export default proj4Wrapper;
