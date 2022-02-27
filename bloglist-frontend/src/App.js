import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
      setErrorMessage('wrong credentials')      
      setTimeout(() => {        
        setErrorMessage(null)      
      }, 5000)    
    }  
  }


  const handleLogOut = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }


  const addBlog = (event) => {
    event.preventDefault()
    try {
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })
    } catch (exception) {
      console.error(exception)
    }
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type="submit">login</button>
    </form>      
  )


  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label>Title: </label>
        <input
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        <label>Author: </label>
        <input
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        <label>URL: </label>
        <input
          type="url"
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>  
  )


  if (user === null) {
    return (
      <div>
        <p>{errorMessage}</p>
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    )
  }
  else {
    return (
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in</p>
        <button onClick={handleLogOut}>
          logout
        </button>
        <br></br>
        <h2>create new</h2>
        {blogForm()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }
}

export default App