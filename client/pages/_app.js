import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Auth } from "../components/Context/Auth";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Auth>
        <Component {...pageProps} />
      </Auth>
    </ThemeProvider>
  );
}

export default MyApp;
