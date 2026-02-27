import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, Phone, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-serif tracking-wider">SHELBY</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#about"
              className="text-sm font-medium tracking-wider hover:text-primary transition-colors"
            >
              SOBRE NOSOTROS
            </Link>
            <Link
              href="#services"
              className="text-sm font-medium tracking-wider hover:text-primary transition-colors"
            >
              SERVICIOS
            </Link>
            <Link
              href="#experience"
              className="text-sm font-medium tracking-wider hover:text-primary transition-colors"
            >
              EXPERIENCIA
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium tracking-wider hover:text-primary transition-colors"
            >
              CONTACTO
            </Link>
          </nav>
          <Link
            href="/reservar"
            className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-background px-6 text-sm font-medium tracking-wider text-primary shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground bronze-glow"
          >
            RESERVAR AHORA
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[90vh] w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
              SHELBY
            </h1>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/reservar"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium tracking-wider text-primary-foreground shadow transition-colors hover:bg-primary/90 bronze-glow"
              >
                RESERVAR UN TURNO
              </Link>
              <Link
                href="#experience"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/30 bg-white/10 backdrop-blur-sm px-8 text-sm font-medium tracking-wider text-white shadow transition-colors hover:bg-white/20"
              >
                EXPLORAR NUESTROS SERVICIOS
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif tracking-tight">
                  Nuestra Historia
                </h2>
                <div className="mt-6 h-1 w-20 bg-primary bronze-glow" />
                <p className="mt-8 text-muted-foreground leading-relaxed">
                  Lo que diferencia a Shelby de otros salones es su enfoque en
                  ofrecer una experiencia a medida. Cada cliente recibe un trato
                  único y un corte adaptado a su estilo personal, asegurando que
                  cada visita sea memorable. Además, el ambiente exclusivo y la
                  atención al detalle hacen de este salón un verdadero santuario
                  de belleza y bienestar.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Creé este salón exclusivo con una visión clara: brindar un
                  servicio excepcional en un ambiente elegante y sofisticado.
                  Desde su apertura, Shelby ha logrado atraer a una clientela
                  selecta que valora la atención personalizada y la calidad en
                  cada detalle.
                </p>
                <Link
                  href="#services"
                  className="mt-8 inline-flex items-center text-sm font-medium tracking-wider text-primary"
                >
                  DESCUBRIR NUESTRO ENFOQUE
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image
                  src="/images/owner.jpg"
                  alt="Dueño de Shelby"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-muted">
          <div className="container">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif tracking-tight">
                Nuestros Servicios Destacados
              </h2>
              <div className="mt-6 h-1 w-20 bg-primary bronze-glow" />
              <p className="mt-6 max-w-2xl text-muted-foreground">
                Contamos con muchos servicios, estos son nuestros favoritos.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Corte de cabello masculino",
                  description:
                    "Desde cortes clásicos hasta estilos modernos, nosotros te ayudamos a encontrar el look perfecto que refleje tu personalidad.",
                  image: "/images/man-cut.jpg",
                },
                {
                  title: "Hidratación",
                  description:
                    "Revitaliza tu cabello con nuestros tratamientos de hidratación profunda. Nutrición intensa para lograr un cabello suave, brillante y saludable.",
                  image: "/images/woman-nutrition.jpg",
                },
                {
                  title: "Brushing",
                  description:
                    "Volumen, suavidad y un brillo espectacular para cualquier ocasión. Perfecto para lucir un cabello impecable.",
                  image: "/images/woman-brushing.jpg",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-md bg-background shadow-md transition-all hover:shadow-lg"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif tracking-tight">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 flex justify-center">
              <Link
                href="/reservar"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium tracking-wider text-primary-foreground shadow transition-colors hover:bg-primary/90 bronze-glow"
              >
                VER MENU COMPLETO DE SERVICIOS
              </Link>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-24 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] relative overflow-hidden rounded-md">
                  <Image
                    src="/images/shelby-experience01.jpg"
                    alt="Herramientas de trabajo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-[3/4] relative overflow-hidden rounded-md mt-8">
                  <Image
                    src="/images/shelby-experience.jpg"
                    alt="Dueño de shelby"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-4xl font-serif tracking-tight">
                  La Experiencia Shelby
                </h2>
                <div className="mt-6 h-1 w-20 bg-primary bronze-glow" />
                <p className="mt-8 text-muted-foreground leading-relaxed">
                  En Shelby, cada visita es una experiencia única. Nos dedicamos
                  a brindarte un servicio personalizado, donde cada detalle está
                  pensado para tu comodidad y satisfacción. Te asesoramos para
                  que encuentres el estilo que mejor se adapte a ti.
                </p>
                <div className="mt-8 space-y-6">
                  {[
                    {
                      title: "Herramientas",
                      description:
                        "Poseemos las mejores herramientas de trabajo para dar el mejor resultado posible, contamos con productos de primera marca.",
                    },
                    {
                      title: "Atención",
                      description:
                        "Nos tomamos el tiempo para entender tus necesidades y preferencias, ofreciendo soluciones a medida para cada cliente.",
                    },
                    {
                      title: "Ambiente",
                      description:
                        "Disfruta de un espacio diseñado para tu relajación, con una atmósfera que te va a hacer sentir especial.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center bronze-glow">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-muted">
          <div className="container">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif tracking-tight">
                Experiencias de Clientes
              </h2>
              <div className="mt-6 h-1 w-20 bg-primary bronze-glow" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "Volvería una y otra vez, me gustó el servicio de corte masculino. No tuve que esperar nada y su agenda de turnos es perfecta para ahorrar tiempo coordinando.",
                  name: "Alan K.",
                },
                {
                  quote:
                    "Me quedó el cabello super brilloso y renovado con el tratamiento de hidratación. Tuve muy buen trato y Pedro fue super atento. Gracias a Shelby quede hermosa para mi cumpleaños!",
                  name: "Camila D.",
                },
                {
                  quote:
                    "Me dejaron la barba super prolija para mi boda. Sin dudas volvería mas que nada por la atención personalizada y la dedicación de Pedro.",
                  name: "Nahuel S.",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="rounded-md bg-background p-8 shadow-md"
                >
                  <div className="mb-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-primary"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="italic text-muted-foreground">
                    {testimonial.quote}
                  </p>
                  <p className="mt-4 font-medium">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 bg-background overflow-hidden">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl md:text-4xl font-serif tracking-tight">
                Comienza tu experiencia Shelby
              </h2>
              <div className="mx-auto mt-6 h-1 w-20 bg-primary bronze-glow" />
              <p className="mt-8 text-muted-foreground">
                No esperes para venir a atenderte con nosotros. Vamos a darte la
                mejor atención y cumplir tu resultado esperado.
              </p>
              <Link
                href="/reservar"
                className="mt-10 inline-flex h-12 items-center justify-center rounded-md bg-primary px-10 text-sm font-medium tracking-wider text-primary-foreground shadow transition-colors hover:bg-primary/90 bronze-glow"
              >
                RESERVAR TU TURNO
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-muted">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif tracking-tight">
                  Visita Nuestro Salón
                </h2>
                <div className="mt-6 h-1 w-20 bg-primary bronze-glow" />
                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Ubicación</h3>
                      <p className="mt-1 text-muted-foreground">
                        Argentina, Corrientes, Corrientes
                      </p>
                      <p className="text-muted-foreground">
                        Jujuy 805 (esquina 9 de Julio)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Contacto</h3>
                      <p className="mt-1 text-muted-foreground">
                        +54 9 3794 91-0607
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Horarios</h3>
                      <p className="mt-1 text-muted-foreground">
                        Martes - Sábados: 13 - 22 hs
                      </p>
                      <p className="text-muted-foreground">
                        Domingo y Lunes: Cerrado
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <Link
                    href="https://www.instagram.com/shelby.peluqueria/"
                    target="_blank"
                    className="rounded-full bg-background p-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Image
                      src="/icons/instagram.svg"
                      alt="Instagram icon"
                      width={20}
                      height={20}
                    />
                  </Link>
                  <Link
                    href="https://wa.me/543794910607"
                    target="_blank"
                    className="rounded-full bg-background p-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Image
                      src="/icons/whatsapp.svg"
                      alt="WhatsApp icon"
                      width={20}
                      height={20}
                    />
                  </Link>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-md aspect-auto">
                <Image
                  src="/images/shelby-interior.jpg"
                  alt="Salon interior"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-serif tracking-wider">
                  SHELBY
                </span>
              </Link>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <nav className="flex gap-6">
                <Link
                  href="#about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Sobre Nosotros
                </Link>
                <Link
                  href="#services"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Servicios
                </Link>
                <Link
                  href="#experience"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Experiencia
                </Link>
                <Link
                  href="#contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contacto
                </Link>
              </nav>
              <Link
                href="/reservar"
                className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-background px-6 text-sm font-medium tracking-wider text-primary shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground bronze-glow"
              >
                RESERVAR AHORA
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t pt-8">
            <p className="text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} Shelby peluquería. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
