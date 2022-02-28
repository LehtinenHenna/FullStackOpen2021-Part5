import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/Blogform'
import LoginForm from './components/Loginform'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs
        .sort((a, b) => (a.likes > b.likes) // sort by number of likes
        ? -1 : (a.likes === b.likes) // if number of likes is the same sort by title
        ? ((a.title > b.title)
        ? 1 : -1) : 1))
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
    const users = await userService.getUsers()
    const id = users.find(u => u.username === user.username).id // find the id by matching username
    setUser({ ...user, id: id })
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
    // for some unimaginable reason when blog's like button is clicked for the first time blog.user contains the whole user object, 
    // but if the like button is clicked again blog.user contains ONLY user id
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog)
        .sort((a, b) => (a.likes > b.likes) // sort by number of likes
        ? -1 : (a.likes === b.likes) // if number of likes is the same sort alphabetically by title
        ? ((a.title > b.title)
        ? 1 : -1) : 1))
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


  const removeBlog = id => {
    const blog = blogs.find(b => b.id === id)
    const result = window.confirm(`Are you sure you want to delete blog ${blog.title}?`)
    if (result) {
      blogService
        .remove(blog.id)
        .then(returnedBlog => {
          setBlogs(blogs.filter(b => b.id !== id))
        })
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
          removeBlog={() => removeBlog(blog.id)}
          user={user}
          />
        )}
      </div>
    )
  }
}

export default App