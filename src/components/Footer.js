export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-8 mt-12">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">ShivSagar Tours</h2>
        <p className="mb-4 text-gray-400">Making your travel dreams a reality.</p>
        <div className="flex justify-center space-x-4 mb-4">
          <a href="#" className="hover:text-yellow-500 text-yellow-500">Facebook</a>
          <a href="#" className="hover:text-yellow-500 text-yellow-500">Instagram</a>
          <a href="#" className="hover:text-yellow-500 text-yellow-500">Twitter</a>
        </div>
        <p className="text-yellow-500">&copy; 2026 ShivSagar Tours. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
