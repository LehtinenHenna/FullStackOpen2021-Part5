import React, { useState } from 'react'

const Blog = ({blog}) => {
  const [fullView, setFullView] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return(
    <div style={blogStyle}>
      {fullView 
      ? <div>
          <p>
            {blog.title}&nbsp;
            <button onClick={ () => setFullView(!fullView) }>{ fullView? 'hide' : 'show' }</button>
          </p>
          <p>{blog.author}</p>
          <p>
            likes {blog.likes}&nbsp;
            <button>like</button>
          </p>
          <p>{blog.url}</p>
        </div>

      : <div>
          <p>
            {blog.title}&nbsp;
            {blog.author? 'by ' : ''}
            {blog.author}&nbsp;
            <button onClick={ () => setFullView(!fullView) }>{ fullView? 'hide' : 'show' }</button>
          </p>
        </div>
      }
    </div>  
  )
}

export default Blog