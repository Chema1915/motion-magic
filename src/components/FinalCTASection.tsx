import { Link } from 'react-router-dom';

const FinalCTASection = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-light mb-12 text-foreground leading-tight">
          ¿Listo para recuperar
          <br />
          tu tiempo?
        </h2>

        <Link
          to="/catalogo"
          className="inline-block px-12 py-5 bg-primary text-primary-foreground hover:bg-accent transition-all duration-300 text-sm tracking-wide"
        >
          COMENZAR AHORA
        </Link>

        <p className="mt-8 text-muted-foreground text-sm">
          Desde $150 MXN · Sin suscripciones · Soporte incluido
        </p>
      </div>
    </section>
  );
};

export default FinalCTASection;
