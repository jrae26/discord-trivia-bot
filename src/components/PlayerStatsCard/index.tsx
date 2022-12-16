import React from 'react'

import './styles.css'

const bulbasaur = 'https://i.ebayimg.com/images/g/LWsAAOSwV1ViF-39/s-l500.png'

interface PlayerStatsCardProps {
  avatarUrl: string
  name: string
}

const defaultProps = {
  avatarUrl: bulbasaur,
  name: 'Kate Beckett',
}

export const PlayerStatsCard = ({}: PlayerStatsCardProps) => {
  const { avatarUrl, name } = defaultProps
  return (
    <div className="container">
      <div className="content">
        <div className="right">
          <div className="avatar-container">
            <img src={avatarUrl} className="avatar" />
          </div>
          <hr className="divider" />
          <span className="name">{name}</span>
        </div>
      </div>
    </div>
  )
}
