
import React, { useState } from 'react'
import { BackgroundTypes } from '../../constants/background'
import './Background.scss'

const Background = () => {
    const bgItems = BackgroundTypes;

    const [activeBg, setActiveBg] = useState(1);

    const onBackgroundClick = (id) => {
        setActiveBg(id);
    }

    return (
        <div className="background">
            {
                bgItems.map(bg =>
                (
                    <div onClick={() => onBackgroundClick(bg.id)} className={`background__item ${activeBg === bg.id ? 'active' : null}`} key={bg.id}>
                        <div className="background__item__pattern" style={{ backgroundImage: bg.background }}>
                        </div>
                        <p className="background__item__title">{bg.name}</p>
                    </div>
                )
                )
            }
        </div>
    )
}

export default Background
