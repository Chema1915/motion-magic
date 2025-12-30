import { Link } from 'react-router-dom';
import ZolveLogo from './ZolveLogo';

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <ZolveLogo size="small" />
          </div>

          <div>
            <h3 className="font-medium mb-4 text-sm text-foreground">Producto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/catalogo" className="hover:text-foreground transition-colors">Catálogo</Link></li>
              <li><Link to="/catalogo#agenda" className="hover:text-foreground transition-colors">Agenda</Link></li>
              <li><Link to="/catalogo#email" className="hover:text-foreground transition-colors">Email</Link></li>
              <li><Link to="/catalogo#facturacion" className="hover:text-foreground transition-colors">Facturación</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-sm text-foreground">Empresa</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/nosotros" className="hover:text-foreground transition-colors">Nosotros</Link></li>
              <li><Link to="/soporte" className="hover:text-foreground transition-colors">Soporte</Link></li>
              <li><Link to="/contacto" className="hover:text-foreground transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-sm text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/terminos" className="hover:text-foreground transition-colors">Términos</Link></li>
              <li><Link to="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link></li>
              <li><Link to="/garantia" className="hover:text-foreground transition-colors">Garantía</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Zolve. Automatizaciones que devuelven tu tiempo.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
