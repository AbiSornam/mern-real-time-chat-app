import React from 'react'
import { Link } from 'react-router-dom'
import { LANGUAGE_TO_FLAG } from '../constants'

const FriendCard = ({ friend }) => {
  if (!friend) return null;

  const imgSrc = friend.profilePic || '/vite.svg';

  return (
    <div className="border border-base-300 rounded-lg p-4 flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full overflow-hidden">
        <img
          src={imgSrc}
          alt={friend.fullName || friend.name || friend.username}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/vite.svg';
          }}
        />
      </div>

      <h3 className="mt-3 text-sm font-medium">{friend.fullName || friend.name || friend.username}</h3>

      <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
        {getLanguageFlag(friend.nativeLanguage)}
        <span className="badge badge-secondary text-xs">Native: {friend.nativeLanguage}</span>
        {getLanguageFlag(friend.learningLanguage)}
        <span className="badge badge-outline text-xs">Learning: {friend.learningLanguage}</span>
      </div>
      <Link to={`/chat/${friend._id}`} className="btn btn-primary btn-sm w-full">
        Message
      </Link>

      {/* additional actions could go here (message, call, remove) */}
    </div>
  )
}

export default FriendCard

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  return null;
}