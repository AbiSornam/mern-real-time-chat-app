import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser'
import { ShipWheelIcon, BellIcon, LogOut } from 'lucide-react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { logout } from '../lib/api'
import ThemeSelector from './ThemeSelector'
const Navbar = () => {
  const location = useLocation()
  const { authUser } = useAuthUser()
  const isChatPage = location.pathname.startsWith('/chat/')

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutateAsync: logoutMutationAsync } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // clear cached authUser immediately so UI updates
      queryClient.setQueryData(['authUser'], null)
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
      // redirect to login
      navigate('/login')
    },
  })

  const handleLogout = async () => {
    try {
      console.log('Logging out...')
      await logoutMutationAsync()
      toast.success('Logged out')
    } catch (err) {
      console.error('Logout failed', err)
      toast.error(err?.response?.data?.message || 'Logout failed')
    }
  }

  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-end w-full'>
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className='pl-5'>
              <Link to='/' className='flex items-center gap-2.5'>
                {authUser?.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt='User Avatar'
                    className='w-9 h-9 rounded-full object-cover'
                    referrerPolicy='no-referrer'
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/vite.svg'
                    }}
                  />
                ) : (
                  <ShipWheelIcon className='w-9 h-9 text-primary' />
                )}
                <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
                  Streamify
                </span>
              </Link>
            </div>
          )}

          <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
            <Link to={'/notifications'}>
              <button className='btn btn-ghost btn-circle' aria-label='Notifications'>
                <BellIcon className='h-6 w-6 text-base-content opacity-70' />
              </button>
            </Link>

            {/* Theme selector label + control */}
            <div className='flex items-center gap-2'>
              <span className='hidden sm:inline text-sm'>ThemeSelector</span>
              <ThemeSelector />
            </div>

            {/* small avatar */}
            <div className='avatar'>
              <div className='w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary'>
                {authUser?.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt='User Avatar'
                    className='object-cover w-full h-full'
                    referrerPolicy='no-referrer'
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/vite.svg'
                    }}
                  />
                ) : (
                  <ShipWheelIcon className='w-6 h-6 text-primary' />
                )}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className='btn btn-ghost btn-circle'
              aria-label='Logout'
            >
              <LogOut className='h-5 w-5 text-base-content opacity-80' />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar