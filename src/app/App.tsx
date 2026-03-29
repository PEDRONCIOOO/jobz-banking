import { RouterProvider } from 'react-router-dom'
import { Providers } from './providers'
import { router } from './router'
import { ViewModeToggle } from '@/components/shared/view-mode-toggle'

export default function App() {
  return (
    <Providers>
      <ViewModeToggle />
      <RouterProvider router={router} />
    </Providers>
  )
}
