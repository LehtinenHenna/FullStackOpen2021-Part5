import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({
  blog,
  incrementLikes,
  removeBlog,
  user
}) => {
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
            <button onClick={incrementLikes}>like</button>
          </p>
          <p>{blog.url}</p>
          {user.id === blog.user.id || user.id === blog.user
            ? <button onClick={removeBlog}>delete</button>
            : <></>
          }
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

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  incrementLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog