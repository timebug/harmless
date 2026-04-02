export default function Courses() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Course Catalog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="h-40 bg-slate-100 rounded-xl mb-4 animate-pulse"></div>
            <h3 className="text-lg font-bold">Language Course {i}</h3>
            <p className="text-slate-500 mt-2">Level A{i % 3 + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}