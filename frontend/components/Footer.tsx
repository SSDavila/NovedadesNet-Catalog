export default function Footer() {
  return (
    <footer className="bg-white shadow p-4 mt-6">
      <div className="container mx-auto text-center text-gray-500">
        &copy; {new Date().getFullYear()} Novedades Net. Todos los derechos reservados.
      </div>
    </footer>
  );
}
