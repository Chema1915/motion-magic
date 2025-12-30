import { Link } from 'react-router-dom';

const ValuePropSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-secondary px-6 py-32">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-light mb-8 text-foreground leading-tight">
              Qué hacemos
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-light mb-6">
              Diseñamos automatizaciones específicas para problemas específicos.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              Agenda, emails, facturación, seguimiento. Cada automatización pensada 
              para devolverle control a tu tiempo.
            </p>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-display font-light mb-8 text-foreground leading-tight">
              Cómo lo hacemos
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-light mb-6">
              Sin suscripciones. Sin plataformas complicadas.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              Compras una vez, implementas en minutos, funciona para siempre. 
              Simple como debería ser.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link 
            to="/catalogo"
            className="inline-block text-accent hover:text-foreground transition-colors duration-300 text-lg group"
          >
            Explora nuestras automatizaciones
            <span className="inline-block ml-2 group-hover:ml-4 transition-all duration-300">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ValuePropSection;
