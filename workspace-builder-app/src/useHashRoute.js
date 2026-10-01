import { useEffect, useState } from 'react'

export const useHashRoute = () => {
    const [hash, setHash] = useState(window.location.hash)
    useEffect(() => {
        const handleChange = () => setHash(window.location.hash)
        window.addEventListener('hashchange', handleChange)
        return () => window.removeEventListener('hashchange', handleChange)
    }, [])
    return hash
}
