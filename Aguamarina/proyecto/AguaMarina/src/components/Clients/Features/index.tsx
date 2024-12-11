import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <section className="pb-8 pt-20 dark:bg-dark lg:pb-[70px] lg:pt-[120px] px-20 lg:px-50">
      <div className="container items-center">
        <SectionTitle
          title="Te damos la bienvenida a AguaMarina."
          paragraph="Te invitamos a conocer nuestra empresa, donde encontrarás un equipo comprometido en ofrecerte servicios excepcionales. Descubre cómo podemos ayudarte a transformar tu evento en una experiencia memorable, con nuestra amplia selección de mobiliario de alta calidad y atención."
        />

        <div className="-mx-4 mt-12 flex flex-wrap justify-center items-center lg:mt-20">
          {featuresData.map((feature, i) => (
            <SingleFeature key={i} feature={feature} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
