// src/app/test-tailwind/page.js
export default function TestTailwindPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">
        🎨 Test de Tailwind CSS
      </h1>
      
      {/* Botón primario */}
      <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-all">
        Botón Primario
      </button>
      
      {/* Card */}
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Card de Ejemplo</h2>
        <p className="text-gray-600">
          Este es un ejemplo de card hecho con Tailwind CSS.
        </p>
      </div>
      
      {/* Grid responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-primary text-white p-6 rounded-lg">Item 1</div>
        <div className="bg-primary text-white p-6 rounded-lg">Item 2</div>
        <div className="bg-primary text-white p-6 rounded-lg">Item 3</div>
      </div>
    </div>
  );
}