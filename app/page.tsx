// 'use client'
// import { createClient } from '@/lib/supabase'
// import { useEffect, useState } from 'react'

// export default function Home() {
//   const [user, setUser] = useState<any>(null)
//   const [bookmarks, setBookmarks] = useState<any[]>([])
//   const [url, setUrl] = useState('')
//   const [title, setTitle] = useState('')
//   const supabase = createClient()

//   useEffect(() => {
//     checkUser()
//     setupRealtimeSubscription()
//   }, [])

//   async function checkUser() {
//     const { data: { user } } = await supabase.auth.getUser()
//     setUser(user)
//     if (user) fetchBookmarks()
//   }

//   async function fetchBookmarks() {
//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) return
    
//     const { data, error } = await supabase
//       .from('bookmarks')
//       .select('*')
//       .eq('user_id', user.id)
//       .order('created_at', { ascending: false })
    
//     if (error) {
//       console.error('Error fetching bookmarks:', error)
//       return
//     }
    
//     console.log('Fetched bookmarks:', data)
//     setBookmarks(data || [])
//   }

//   function setupRealtimeSubscription() {
//     supabase
//       .channel('bookmarks-channel')
//       .on('postgres_changes', 
//         { event: '*', schema: 'public', table: 'bookmarks' },
//         () => {
//           console.log('Realtime update detected')
//           fetchBookmarks()
//         }
//       )
//       .subscribe()
//   }

//   async function signInWithGoogle() {
//     await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         redirectTo: window.location.origin
//       }
//     })
//   }

//   async function signOut() {
//     await supabase.auth.signOut()
//     setUser(null)
//     setBookmarks([])
//   }

//   async function addBookmark() {
//     if (!url || !title) return
    
//     const { error } = await supabase.from('bookmarks').insert({
//       user_id: user.id,
//       url,
//       title
//     })
    
//     if (error) {
//       console.error('Error adding bookmark:', error)
//       return
//     }
    
//     setUrl('')
//     setTitle('')
//   }

//   async function deleteBookmark(id: string) {
//     console.log('Deleting bookmark with ID:', id)
    
//     if (!id) {
//       console.error('No ID provided for deletion')
//       return
//     }
    
//     const { error } = await supabase
//       .from('bookmarks')
//       .delete()
//       .eq('id', id)
    
//     if (error) {
//       console.error('Error deleting bookmark:', error)
//     } else {
//       console.log('Successfully deleted bookmark')
//     }
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-md">
//           <h1 className="text-2xl font-bold mb-4">Bookmark Manager</h1>
//           <button 
//             onClick={signInWithGoogle}
//             className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
//           >
//             Sign in with Google
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h1 className="text-2xl font-bold">My Bookmarks</h1>
//             <button 
//               onClick={signOut}
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Sign Out
//             </button>
//           </div>
          
//           <div className="flex gap-2 mb-4">
//             <input
//               type="url"
//               placeholder="URL"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               className="flex-1 border p-2 rounded"
//             />
//             <input
//               type="text"
//               placeholder="Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="flex-1 border p-2 rounded"
//             />
//             <button 
//               onClick={addBookmark}
//               className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
//             >
//               Add
//             </button>
//           </div>
//         </div>

//         <div className="space-y-2">
//           {bookmarks.map((bookmark) => (
//             <div key={bookmark.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
//               <div>
//                 <h3 className="font-bold">{bookmark.title}</h3>
//                 <a 
//                   href={bookmark.url} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:underline text-sm"
//                 >
//                   {bookmark.url}
//                 </a>
//               </div>
//               <button 
//                 onClick={() => deleteBookmark(bookmark.id)}
//                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }





'use client'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    setupRealtimeSubscription()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) fetchBookmarks()
  }

  async function fetchBookmarks() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching bookmarks:', error)
      return
    }
    
    setBookmarks(data || [])
  }

  function setupRealtimeSubscription() {
    supabase
      .channel('bookmarks-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookmarks' },
        () => {
          fetchBookmarks()
        }
      )
      .subscribe()
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setBookmarks([])
  }

  async function addBookmark() {
    if (!url || !title) return
    
    const { error } = await supabase.from('bookmarks').insert({
      user_id: user.id,
      url,
      title
    })
    
    if (error) {
      console.error('Error adding bookmark:', error)
      return
    }
    
    setUrl('')
    setTitle('')
  }

  async function deleteBookmark(id: string) {
    if (!id) return
    
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting bookmark:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-10 rounded-xl shadow-xl border-2 border-gray-200">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Bookmark Manager</h1>
          <button 
            onClick={signInWithGoogle}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-md transition"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
            <button 
              onClick={signOut}
              className="bg-red-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-red-700 shadow-md transition"
            >
              Sign Out
            </button>
          </div>
          
          <div className="flex gap-3 mb-4">
            <input
              type="url"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 border-2 border-gray-300 p-3 rounded-lg text-gray-900 font-medium placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border-2 border-gray-300 p-3 rounded-lg text-gray-900 font-medium placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
            <button 
              onClick={addBookmark}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-md transition"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="bg-white p-5 rounded-xl shadow-lg border-2 border-gray-200 flex justify-between items-center hover:shadow-xl transition">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-1">{bookmark.title}</h3>
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline text-base font-medium break-all"
                >
                  {bookmark.url}
                </a>
              </div>
              <button 
                onClick={() => deleteBookmark(bookmark.id)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 shadow-md transition ml-4"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}