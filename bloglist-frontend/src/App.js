import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/Blogform'
import LoginForm from './components/Loginform'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])


  useEffect(() => {    
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      blogService.setToken(user.token)    
    }  
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {      
      const user = await loginService.login({        
      username, password,      
    })
    window.localStorage.setItem(        
      'loggedBlogappUser', JSON.stringify(user)      
    )
    blogService.setToken(user.token) 
    setUser(user)      
    setUsername('')      
    setPassword('')
    } catch (exception) {      
      setMessage('wrong credentials')      
      setTimeout(() => {        
        setMessage(null)      
      }, 5000)    
    }  
  }


  const handleLogOut = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }
  

  const incrementLikes = id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }
  
    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(error => {
        setMessage(
          `Blog '${blog.title}' was already removed from server`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setBlogs(blogs.filter(b => b.id !== id))
      })
  }


  const blogFormRef = useRef()

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
      if (blogObject.author !== '') {
        setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`) 
      } else {
        setMessage(`a new blog ${blogObject.title} added`)
      }     
        setTimeout(() => {        
          setMessage(null)      
        }, 5000)
    } catch (exception) {
      console.error(exception)
    }
  }


  if (user === null) {
    return (
      <div>
        <p>{message}</p>
        <h1>Blogs</h1>
        <h2>Log in to application</h2>
        <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleLogin={handleLogin}
        />
      </div>
    )
  }
  else {
    return (
      <div>
        <p>{message}</p>
        <h1>Blogs</h1>
        <p>{user.name} logged in</p>
        <button onClick={handleLogOut}>
          logout
        </button>
        <br></br>
        <div>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
        {blogs.map(blog =>
          <Blog 
          key={blog.id} 
          blog={blog}
          incrementLikes={() => incrementLikes(blog.id)}
          />
        )}
      </div>
    )
  }
}

export default App