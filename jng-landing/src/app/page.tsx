import { connection } from "next/server";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import Caipra from "@/components/Caipra";
import Testimonials from "@/components/Testimonials";
import Map from "@/components/Map";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function Home() {
  // CSP nonces (set in src/proxy.ts) require dynamic rendering.
  // See: https://nextjs.org/docs/app/guides/content-security-policy
  // Removing this line will silently break inline scripts hydration.
  await connection();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutUs />
        <Services />
        <Caipra />
        <Testimonials />
        <Map />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
