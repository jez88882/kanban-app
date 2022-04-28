import { Link } from 'react-router-dom'

export default function Landing() {
  return(
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Kanban App</h1>
          <p class="py-6">cool cool cool</p>
          <button class="btn btn-primary">
            <Link to="/login">Login</Link>
          </button>
        </div>
      </div>
    </div>
  )
}