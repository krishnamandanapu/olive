import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [dogs, setDogs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pageInput, setPageInput] = useState('')
  const [inputError, setInputError] = useState(false)
  const itemsPerPage = 15

  useEffect(() => {
    fetchDogs(currentPage)
  }, [currentPage])

  useEffect(() => {
    // Initialize Lucide icons after component mounts
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }, [dogs, error, loading])

  const fetchDogs = async (page) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8000/api/dogs?page=${page}`)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setDogs([])
      } else {
        setDogs(data.items)
        setTotalPages(data.total_pages)
        // Use total_items from API response
        setTotalItems(data.total_items || 0)
      }
    } catch (err) {
      setError('Failed to fetch dogs. Please make sure the backend server is running.')
      setDogs([])
    } finally {
      setLoading(false)
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const jumpToPage = () => {
    const page = parseInt(pageInput)

    if (isNaN(page) || page < 1 || page > totalPages) {
      setInputError(true)
      setTimeout(() => {
        setInputError(false)
        setPageInput('')
      }, 2000)
      return
    }

    setPageInput('')
    setInputError(false)
    goToPage(page)
  }

  const handlePageInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      jumpToPage()
    }
  }

  const generatePageNumbers = () => {
    const pages = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="rounded-xl overflow-hidden" style={{ background: 'oklch(var(--card))', boxShadow: 'var(--shadow-md)' }}>
      <div className="relative aspect-square bg-gray-200 skeleton-pulse"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded skeleton-pulse mx-auto" style={{ width: '70%' }}></div>
      </div>
    </div>
  )

  // Dog silhouette placeholder
  const DogPlaceholder = () => (
    <svg viewBox="0 0 512 512" className="w-32 h-32 mx-auto" style={{ color: 'oklch(var(--muted-foreground))', opacity: 0.4 }}>
      <path fill="currentColor" d="M226.5 92.85c-10.04-2.35-20.48-3.65-31.26-3.65c-61.14 0-113.6 43.81-125.4 104.2c-9.43 48.32 4.01 94.82 33.58 127.8c.05.06.09.13.14.19c.09.12.18.25.27.37c29.08 38.45 73.43 64.19 123.7 67.73c.05 0 .09 0 .14.01c.17.01.33.03.5.04c54.01 3.65 103.6-14.62 139.2-47.36c38.1-35.07 59.07-84.41 59.07-138.9c0-28.87-23.41-52.28-52.28-52.28c-14.5 0-27.63 5.91-37.15 15.46c-15.26-21.84-37.12-39.32-62.68-50.15c-13.63-5.77-28.15-9.51-43.25-10.91c-.38-.05-.76-.1-1.14-.15c-.19-.02-.38-.04-.57-.06c-.56-.06-1.12-.12-1.68-.17c-.02 0-.04 0-.06-.01c-2.28-.21-4.59-.38-6.92-.5c-.04 0-.07 0-.11-.01zm32.57 64.83c12.01 0 21.76 9.73 21.76 21.73c0 12.01-9.75 21.75-21.76 21.75c-12 0-21.73-9.74-21.73-21.75c0-12 9.73-21.73 21.73-21.73zm-103.6 32c12.01 0 21.76 9.73 21.76 21.73c0 12.01-9.75 21.75-21.76 21.75c-12 0-21.73-9.74-21.73-21.75c0-12 9.73-21.73 21.73-21.73zM149.9 278.5c-2.81.13-5.57.93-8.13 2.45c-26.36 15.72-49.88 49.88-49.88 80.35c0 17.67 14.32 32 31.99 32h159.8c17.67 0 32.01-14.33 32.01-32c0-30.47-23.52-64.63-49.88-80.35c-13.49-8.04-30.67-4.07-39.16 9.1c-10.24 15.87-27.51 25.55-46.08 25.55s-35.84-9.68-46.08-25.55c-5.05-7.82-13.07-11.81-21.13-11.81c-1.15 0-2.3.08-3.46.26z"/>
    </svg>
  )

  if (loading && dogs.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <i data-lucide="dog" className="w-12 h-12" style={{ color: 'oklch(var(--primary))' }}></i>
              <h1 className="text-5xl font-bold" style={{ color: 'oklch(var(--foreground))' }}>
                Dog Breeds Directory
              </h1>
            </div>
            <p className="text-lg" style={{ color: 'oklch(var(--muted-foreground))' }}>
              Explore amazing dog breeds from around the world
            </p>
          </header>

          {/* Skeleton Loaders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
            {Array.from({ length: 15 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl page-load">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <i data-lucide="dog" className="w-12 h-12" style={{ color: 'oklch(var(--primary))' }}></i>
            <h1 className="text-5xl font-bold" style={{ color: 'oklch(var(--foreground))' }}>
              Dog Breeds Directory
            </h1>
          </div>
          <p className="text-lg" style={{ color: 'oklch(var(--muted-foreground))' }}>
            Explore amazing dog breeds from around the world
          </p>
        </header>

        {/* Error State */}
        {error && (
          <div className="error-container max-w-md mx-auto text-center p-8 rounded-xl mb-12"
               style={{ background: 'oklch(var(--card))', boxShadow: 'var(--shadow-lg)' }}>
            <i data-lucide="alert-circle" className="w-16 h-16 mx-auto mb-4"
               style={{ color: 'oklch(var(--destructive))' }}></i>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'oklch(var(--foreground))' }}>
              {currentPage > totalPages ? 'Oops! Page Not Found' : 'Error Loading Breeds'}
            </h2>
            <p className="mb-6" style={{ color: 'oklch(var(--muted-foreground))' }}>
              {error}
            </p>
            <button
              onClick={() => goToPage(1)}
              className="px-6 py-3 rounded-lg font-medium text-white"
              style={{ background: 'oklch(var(--primary))' }}
            >
              Go to First Page
            </button>
          </div>
        )}

        {/* Breeds Grid */}
        {!error && dogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12 page-change">
              {dogs.map((dog, index) => (
                <div
                  key={index}
                  className="breed-card rounded-xl overflow-hidden card-entrance"
                  style={{ background: 'oklch(var(--card))', boxShadow: 'var(--shadow-md)' }}
                >
                  <div className="relative aspect-square bg-gray-200 overflow-hidden">
                    {dog.image ? (
                      <img
                        src={dog.image}
                        alt={dog.breed}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Hide the broken image and show dog placeholder
                          e.target.style.display = 'none'
                          const placeholder = e.target.nextElementSibling
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    {/* Dog silhouette placeholder - shown when no image or image fails to load */}
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        display: dog.image ? 'none' : 'flex',
                        background: 'oklch(var(--muted) / 0.5)'
                      }}
                    >
                      <DogPlaceholder />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-center"
                        style={{ color: 'oklch(var(--foreground))' }}>
                      {dog.breed}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center gap-6">
              {/* Page Numbers */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                  style={{
                    background: 'oklch(var(--card))',
                    color: 'oklch(var(--foreground))',
                    border: '2px solid oklch(var(--border))'
                  }}
                >
                  <i data-lucide="chevron-left" className="w-4 h-4"></i>
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Number Buttons */}
                {generatePageNumbers().map((pageNum, index) => {
                  if (pageNum === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="px-2"
                            style={{ color: 'oklch(var(--muted-foreground))' }}>
                        ...
                      </span>
                    )
                  }

                  const isActive = pageNum === currentPage
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`pagination-btn ${isActive ? 'active' : ''} w-10 h-10 rounded-lg font-medium`}
                      style={{
                        background: isActive ? 'oklch(var(--primary))' : 'oklch(var(--card))',
                        color: isActive ? 'white' : 'oklch(var(--foreground))',
                        border: '2px solid oklch(var(--border))'
                      }}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {/* Next Button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                  style={{
                    background: 'oklch(var(--card))',
                    color: 'oklch(var(--foreground))',
                    border: '2px solid oklch(var(--border))'
                  }}
                >
                  <span className="hidden sm:inline">Next</span>
                  <i data-lucide="chevron-right" className="w-4 h-4"></i>
                </button>
              </div>

              {/* Jump to Page */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="pageInput" className="font-medium"
                         style={{ color: 'oklch(var(--foreground))' }}>
                    Jump to page:
                  </label>
                  <input
                    type="number"
                    id="pageInput"
                    min="1"
                    max={totalPages}
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onKeyDown={handlePageInputKeyDown}
                    placeholder={currentPage.toString()}
                    className={`page-input w-20 px-3 py-2 rounded-lg text-center ${inputError ? 'error shake' : ''}`}
                    style={{
                      background: 'oklch(var(--card))',
                      color: 'oklch(var(--foreground))',
                      border: '2px solid oklch(var(--border))'
                    }}
                  />
                  <button
                    onClick={jumpToPage}
                    className="go-btn px-4 py-2 rounded-lg font-medium text-white"
                    style={{ background: 'oklch(var(--accent))' }}
                  >
                    Go
                  </button>
                </div>

                <div className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
                  Showing{' '}
                  <span className="font-semibold" style={{ color: 'oklch(var(--foreground))' }}>
                    {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold" style={{ color: 'oklch(var(--foreground))' }}>
                    {totalItems}
                  </span>{' '}
                  breeds
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 mt-12" style={{ color: 'oklch(var(--muted-foreground))' }}>
        <p>
          Powered by your amazing backend API
        </p>
      </footer>
    </div>
  )
}

export default App
