import Reserva from "@/components/Clients/pedido/index";
import ClienteLayout from "@/components/Layouts/ClienteLayout";

const Pedidos = () => {
  return (
    <ClienteLayout>
        <div>
          <section className="px-20 pb-8 pt-20 dark:bg-dark lg:px-50 lg:pb-[70px] lg:pt-10">
          <div className="container items-center">
            <div className="-mx-4 mt-12 flex flex-wrap items-center justify-center lg:mt-20">
                <Reserva/>
            </div>
          </div>
        </section>
      </div>
    </ClienteLayout>
  );
};

export default Pedidos;
