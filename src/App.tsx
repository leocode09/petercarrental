import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <main className="text-center p-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Peter Car Rental
          </h1>
          <p className="text-slate-600 text-lg">
            Your ride, your way.
          </p>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
