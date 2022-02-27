import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {      
      const user = await loginService.login({        
      username, password,      
    })      
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


  const addBlog = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newBlog,
      date: new Date().toISOString(),
      id: blogs.length + 1,
    }

    blogService
      .create(noteObject)
      .then(returnedNote => {
        setBlogs(blogs.concat(returnedNote))
        setNewBlog('')
      })
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
      <input
        value={newBlog}
        onChange={({ target }) => setNewBlog(target.value)}
      />
      <button type="submit">save</button>
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
        <br></br>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }
}

export default App