import React from 'react'

const Social = (props) => {

    const username = props.match.params.username;

    return (
        <div>
            {username} Social Page
        </div>
    )
}

export default Social
