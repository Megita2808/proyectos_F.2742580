import About from "@/components/Clients/About";
import HomeBlogSection from "@/components/Clients/Blog/HomeBlogSection";
import CallToAction from "@/components/Clients/CallToAction";
import Clients from "@/components/Clients/Clients";
import ScrollUp from "@/components/Clients/Common/ScrollUp";
import Contact from "@/components/Clients/Contact";
import Faq from "@/components/Clients/Faq";
import Features from "@/components/Clients/Features";
import Hero from "@/components/Clients/Hero";
import Pricing from "@/components/Clients/Pricing";
import Team from "@/components/Clients/Team";
import Testimonials from "@/components/Clients/Testimonials";
import ClienteLayout from "@/components/Layouts/ClienteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " Principal | AguaMarina",
  description: "Gracias por visitar AguaMarina",
};

export default function Home() {

  return (
    <ClienteLayout>
      <main>
        <ScrollUp />
        <Hero />
        <Features />
        {/* <Pricing /> */}
        <About />
        <CallToAction />
        {/* <Testimonials /> */}
        {/* <Faq /> */}
        {/* <Team /> tarjetas de equipo */} 
        {/* <HomeBlogSection posts={posts} /> */}
        {/* <Contact /> */}
        <Clients />
      </main>
    </ClienteLayout>
  );
}
